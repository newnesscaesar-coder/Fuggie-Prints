# Fuggie Prints delivery

The installable Android build is `../Fuggie-Prints.apk`. It is signed with a development key for direct installation and evaluation, not a Play Store release. Android 8.0 or later is required. The matching public website logo was used because Desktop file access was denied during this task. The image visually matches the supplied Desktop logo.

## Available in the APK now

- Purple, red and white branding matching the live website.
- Live Fuggie Prints website embedded inside the app; internet required.
- Searchable service catalogue and delayed scroll reveal, with reduced-motion support.
- Customer enquiry preparation via WhatsApp or email. These open a draft; the customer sends it. Attachments must be attached in the chosen messaging app.
- Manual Mobile Money instructions for **0706228935**, in UGX.
- **fuggieprintsmedia@gmail.com** and the website’s WhatsApp contact.
- Video links and live X, YouTube and TikTok account pages. Instagram currently opens the supplied reel; its profile URL remains outstanding.
- Three local reminders scheduled around **09:00, 13:00 and 17:00 Africa/Kampala**. Notification permission is requested through Android. There is no in-app disable switch; use Android Settings → Apps → Fuggie Prints → Notifications. Android battery restrictions and force-stop can delay or suppress reminders. Reboot/update/time-change handling restores schedules. The app does not fabricate order-update notifications.
- Account connection screen for a future hosted business platform.

## Included business platform source

Run with Node.js 24 or later. `server.mjs` serves the responsive PWA and a SQLite relational backend. It is not hosted publicly. To preview locally:

```powershell
$env:ADMIN_EMAIL='your-admin-email'
$env:ADMIN_PASSWORD='a-unique-password-of-at-least-12-characters'
node server.mjs
```

Open `http://127.0.0.1:8787`. Initial admin creation happens only when no administrator exists. No default administrator or sample customer accounts are shipped. The runtime creates `data/`; keep that directory private and backed up. Do not upload it to GitHub Pages.

Implemented workflows include customer registration/login, role checks on API actions, private order creation/tracking, quotes and calculations in UGX, private file upload/download, design proof versioning and explicit customer approval, payment-reference recording and staff verification, invoices/receipts via print/save PDF, in-app order updates, staff creation, editable services/settings, customers, inventory records, expenses, deliveries, reviews, promotions, and management reports. Reference numbers are allocated by the database; no fabricated payment confirmations or government submissions are provided. Customers cannot access other customers’ orders/files. Session tokens expire after eight hours and are kept in memory in the client, so a page reload requires sign-in.

Products, inventory, deliveries, promotions and online services currently use editable records. Advanced stock-movement ledgers, supplier/purchase workflows, automatic promotion redemption, complete financial accounting, saved-address management, design zoom previews and a passport-photo processing editor are not implemented. Invoices/receipts currently have basic document layouts; accounting-grade document numbering and full balance/delivery-note workflows remain. There is no Google/OTP sign-in, background-removal provider, email/SMS/WhatsApp API delivery, combined social feed, malware-scanning service or automatic payment gateway. Private Android downloads and document printing need phone testing. The original attached specification is therefore not fully production-complete.

Prices start as “Get a Quote” rather than invented published tariffs. Administrators can enter real prices. Opening hours are not invented.

For public deployment, arrange persistent server hosting with HTTPS, configure `PUBLIC_ORIGIN`, `ALLOWED_ORIGINS` (include `https://app.fuggieprints.local`), `DATA_DIR`, `HOST` and `PORT`, and protect/backup persistent data. The Node server should sit behind an HTTPS reverse proxy. GitHub Pages can distribute the APK and static website but cannot run the database/API. Set the hosted address in the APK’s Account connection screen. Production storage, account recovery, upload malware scanning and deployment hardening still need implementation and review before accepting sensitive customer documents.

## Website download-button update

The Desktop website could not be read or modified under the current permissions. No Desktop or live GitHub Pages files were changed.

`website-update/app-download.js` removes the existing `app-download-options` section and Play/App Store badges, then adds a large purple/red download callout in the home-page hero. The link points to `downloads/Fuggie-Prints.apk`. `website-update/Apply-Website-Update.ps1` is a user-run installer that backs up the selected website’s `index.html`, adds the script and copies the APK. Review it before running it. It requires the APK to remain alongside the FuggiePrints folder.

The original site ZIP is still needed to apply and verify the update against its actual source. After applying it, publish `index.html`, `app-download.js`, and `downloads/Fuggie-Prints.apk` to the existing Fuggie-Prints GitHub Pages repository. The live website is unchanged until those files are published. Direct APK distribution is for Android; it is not an iPhone app or a Play Store listing.

## Validation

Automated tests exercise registration, login, unique order numbers, private order/file access, quotation totals, payment pending/confirmed distinctions, staff permissions, design approval gating, inventory/service/settings records, notifications and reports. Browser checks covered staff login/dashboard and a real locally saved test order. APK compilation and APK v2/v3 signature verification passed. No Android emulator or connected phone was available, so installation, permission prompts, notifications, file picker, downloads and WebView navigation remain unverified on-device.

## Rebuilding Android

`build-android.ps1` uses the installed JDK and Android SDK directly. It creates the development signing key under the workspace’s `work/android-build`, outside the delivery package. Preserve your production signing key privately when preparing distribution updates. Rebuild after editing web assets/configuration.
