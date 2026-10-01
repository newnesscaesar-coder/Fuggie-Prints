param([string]$Sdk='C:\Users\UPF\AppData\Local\Android\Sdk',[string]$Jdk='C:\Program Files\Android\Android Studio\jbr')
$ErrorActionPreference='Stop'
$appRoot=$PSScriptRoot
$build=Join-Path $appRoot '..\..\work\android-build'
$build=[System.IO.Path]::GetFullPath($build)
$tools=Join-Path $Sdk 'build-tools\36.0.0'
$platform=Join-Path $Sdk 'platforms\android-37.0\android.jar'
New-Item -ItemType Directory -Path $build,(Join-Path $build 'classes'),(Join-Path $build 'dex'),(Join-Path $build 'assets\public') -Force | Out-Null
function Run-Checked([string]$exe,[string[]]$arguments){ & $exe @arguments; if($LASTEXITCODE -ne 0){throw "Build step failed: $exe"} }
Run-Checked (Join-Path $Jdk 'bin\java.exe') @((Join-Path $appRoot 'android\MakeIcons.java'),(Join-Path $appRoot 'public\logo.jpeg'),(Join-Path $appRoot 'public'))
Copy-Item -LiteralPath (Join-Path $appRoot 'public\icon-512.png') -Destination (Join-Path $appRoot 'android\res\drawable\logo.png')
Get-ChildItem -LiteralPath (Join-Path $appRoot 'public') -File | Copy-Item -Destination (Join-Path $build 'assets\public')
Run-Checked (Join-Path $tools 'aapt2.exe') @('compile','--dir',(Join-Path $appRoot 'android\res'),'-o',(Join-Path $build 'resources.zip'))
Run-Checked (Join-Path $tools 'aapt2.exe') @('link','-o',(Join-Path $build 'unsigned.apk'),'--manifest',(Join-Path $appRoot 'android\AndroidManifest.xml'),'-I',$platform,'--java',(Join-Path $build 'generated'),'-A',(Join-Path $build 'assets'),(Join-Path $build 'resources.zip'))
# Windows aapt2 can emit backslashes in nested asset names. Android AssetManager needs forward slashes.
$inputArchive=[System.IO.Compression.ZipFile]::OpenRead((Join-Path $build 'unsigned.apk'))
$normalizedPath=Join-Path $build 'normalized.apk'
$normalizedStream=[System.IO.File]::Open($normalizedPath,[System.IO.FileMode]::Create)
$outputArchive=[System.IO.Compression.ZipArchive]::new($normalizedStream,[System.IO.Compression.ZipArchiveMode]::Create)
try { foreach($entry in $inputArchive.Entries){$newEntry=$outputArchive.CreateEntry($entry.FullName.Replace('\','/'),[System.IO.Compression.CompressionLevel]::NoCompression);$from=$entry.Open();$to=$newEntry.Open();try{$from.CopyTo($to)}finally{$from.Dispose();$to.Dispose()}} } finally {$outputArchive.Dispose();$normalizedStream.Dispose();$inputArchive.Dispose()}
$sources=@(Get-ChildItem -LiteralPath (Join-Path $appRoot 'android\src'),(Join-Path $build 'generated') -Filter '*.java' -Recurse | ForEach-Object { $_.FullName })
Run-Checked (Join-Path $Jdk 'bin\javac.exe') (@('-encoding','UTF-8','-source','8','-target','8','-classpath',$platform,'-d',(Join-Path $build 'classes'))+$sources)
$classes=@(Get-ChildItem -LiteralPath (Join-Path $build 'classes') -Filter '*.class' -Recurse | ForEach-Object {$_.FullName})
Run-Checked (Join-Path $Jdk 'bin\java.exe') (@('-cp',(Join-Path $tools 'lib\d8.jar'),'com.android.tools.r8.D8','--min-api','26','--lib',$platform,'--output',(Join-Path $build 'dex'))+$classes)
Push-Location (Join-Path $build 'dex')
try { Run-Checked (Join-Path $tools 'aapt.exe') @('add',(Join-Path $build 'normalized.apk'),'classes.dex') } finally { Pop-Location }
Run-Checked (Join-Path $tools 'zipalign.exe') @('-f','-p','4',(Join-Path $build 'normalized.apk'),(Join-Path $build 'aligned.apk'))
$key=Join-Path $build 'development-signing.p12'
if(-not(Test-Path -LiteralPath $key)){Run-Checked (Join-Path $Jdk 'bin\keytool.exe') @('-genkeypair','-keystore',$key,'-storepass','development-only','-keypass','development-only','-alias','fuggie-development','-keyalg','RSA','-keysize','2048','-validity','3650','-dname','CN=Fuggie Prints Development, O=Fuggie Prints, C=UG')}
Run-Checked (Join-Path $Jdk 'bin\java.exe') @('-jar',(Join-Path $tools 'lib\apksigner.jar'),'sign','--ks',$key,'--ks-pass','pass:development-only','--key-pass','pass:development-only','--out',(Join-Path $appRoot '..\Fuggie-Prints.apk'),(Join-Path $build 'aligned.apk'))
Run-Checked (Join-Path $Jdk 'bin\java.exe') @('-jar',(Join-Path $tools 'lib\apksigner.jar'),'verify','--verbose',(Join-Path $appRoot '..\Fuggie-Prints.apk'))
Write-Output 'APK built and signature verified.'
