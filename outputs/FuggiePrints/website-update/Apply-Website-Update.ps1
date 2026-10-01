param([string]$WebsiteFolder=(Join-Path $env:USERPROFILE 'Desktop\Fuggie Prints'))
$ErrorActionPreference='Stop'
$root=[System.IO.Path]::GetFullPath($WebsiteFolder)
$index=Join-Path $root 'index.html'
if(-not(Test-Path -LiteralPath $index)){throw 'The selected folder must contain index.html.'}
$apk=Join-Path $PSScriptRoot '..\..\Fuggie-Prints.apk'
if(-not(Test-Path -LiteralPath $apk)){throw 'Keep FuggiePrints and Fuggie-Prints.apk beside each other as delivered.'}
$backup=Join-Path $root ('index.before-app-download-'+(Get-Date -Format 'yyyyMMdd-HHmmss')+'.html')
Copy-Item -LiteralPath $index -Destination $backup
$encoding=[System.Text.Encoding]::GetEncoding(28591)
$html=$encoding.GetString([System.IO.File]::ReadAllBytes($index))
if(-not $html.Contains('app-download.js')){$html=$html.Replace('</body>','<script defer src="app-download.js"></script></body>')}
[System.IO.File]::WriteAllBytes($index,$encoding.GetBytes($html))
New-Item -ItemType Directory -Path (Join-Path $root 'downloads') -Force | Out-Null
Copy-Item -LiteralPath $apk -Destination (Join-Path $root 'downloads\Fuggie-Prints.apk')
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'app-download.js') -Destination (Join-Path $root 'app-download.js')
Write-Output 'Added the APK and download-button update. Publish index.html, app-download.js and downloads/Fuggie-Prints.apk to the GitHub Pages repository.'
