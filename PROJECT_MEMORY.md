# Project Memory

## 2026-06-05

- Status rilis: aplikasi sudah tersedia di Google Play Store production.
- Link production: https://play.google.com/store/apps/details?id=com.alamaby.waktu_sejak
- Keputusan teknis: gunakan link Play Store production ini untuk CTA/download/link eksternal yang mengarah ke aplikasi Android.
- Command verifikasi yang disarankan: tidak ada command khusus untuk perubahan catatan ini.

## 2026-06-05 - Update Landing Page Google Play

- Fitur/bug: section download landing page diupdate agar user Android bisa klik kartu Google Play dan diarahkan ke Play Store production.
- File penting yang diubah: `index.html`, `PROJECT_MEMORY.md`.
- Keputusan teknis: kartu Google Play dibuat sebagai anchor penuh dengan `target="_blank"` dan `rel="noopener"`, status diubah menjadi tersedia, copy i18n Indonesia/English diperbarui, dan JSON-LD `SoftwareApplication.offers.url` diarahkan ke Play Store.
- Command verifikasi yang disarankan: buka `index.html` di browser lalu klik kartu Google Play pada section Download; opsional cek deployment setelah publish.

## 2026-06-05 - Privacy Policy dan Download Options

- Fitur/bug: halaman Privacy Policy landing page diperbarui mengikuti `C:\Works\github.com\alamaby\waktu-sejak\PRIVACY_POLICY.md`; opsi Android APK sideload dan F-Droid dihapus dari section Download.
- File penting yang diubah: `index.html`, `privacy-policy/index.html`, `PROJECT_MEMORY.md`.
- Keputusan teknis: section Download hanya menampilkan Google Play sebagai Android release utama dan App Store sebagai coming soon; privacy policy tetap bilingual via i18n object, dengan konten terbaru tentang local-first storage, Google Play Billing, Supporter reward event, ekspor/impor, external links, analytics/ads/tracking, children, choices, changes, dan contact.
- Command verifikasi yang disarankan: buka landing page dan `/privacy-policy` di browser, klik kartu Google Play, lalu toggle bahasa ID/EN pada halaman privacy.
## 2026-06-17 - Privacy Policy overhaul dan Terms of Service baru
- Fitur/dokumen: halaman privacy policy direvisi mengikuti versi in-app terbaru, ditambah halaman Terms of Service baru, ditambah kontak email resmi.
- File penting:
  - `privacy-policy/index.html`
  - `terms-of-service/index.html` (baru)
  - `index.html`
  - `PROJECT_MEMORY.md`
- Keputusan teknis:
  - Privacy policy ditambah section "Akses Internet dan Jaringan" / "Internet and Network Access" yang menyatakan secara eksplisit tidak ada permission `INTERNET` untuk fitur inti.
  - Section di-rename, 10 section lama menjadi 11 section dengan section baru di posisi 2.
  - Kontak ditambah email `alam.aby.b@gmail.com` di section 11 (Kontak).
  - Halaman `terms-of-service/index.html` baru, bilingual, mengikuti pola i18n yang sama dengan privacy policy.
  - Footer di `index.html` dan `privacy-policy/index.html` ditambah link `/terms-of-service`.
  - Bahasa i18n ID/EN untuk `footer_termsOfService` ditambah di ketiga halaman.
- Command verifikasi yang disarankan: buka `/privacy-policy` dan `/terms-of-service` di browser, lalu toggle bahasa ID/EN.
- Propose commit message: `feat: add terms of service page and update privacy policy`

## 2026-06-19 - Sinkronisasi landing page dengan fitur aplikasi terbaru
- Fitur/bug: update landing page agar informasi fitur, data portability, legal docs, dan metadata akurat dengan kondisi terakhir aplikasi.
- File penting:
  - `index.html`
  - `privacy-policy/index.html`
  - `terms-of-service/index.html`
  - `PROJECT_MEMORY.md`
- Keputusan teknis:
  - Meta description diubah dari klaim iOS/desktop menjadi "Available on Google Play for Android, with App Store coming soon."
  - Feature grid diperluas dari 6 menjadi 9 kartu: menambahkan Search & Filters, Recurring Events & Calendar, Pin & Duplicate.
  - Kartu Export & Import diperbarui menyebut CSV export selain JSON.
  - JSON-LD `SearchAction` dihapus karena landing page tidak memiliki fungsionalitas search.
  - Privacy Policy section 5 dan 9 ditambah CSV export; external links di section 2 dihapus Privacy Policy/Terms karena sekarang legal docs dirender in-app.
  - Terms of Service section 4 diperjelas bahwa Support Developer purchase tidak membuka fitur produktivitas inti tetapi dapat membuat event reward Supporter lokal.
  - i18n ID/EN diselaraskan di ketiga halaman.
  - iOS App Store card tetap dipertahankan sebagai "Coming Soon" sesuai instruksi user.
- Command verifikasi yang disarankan:
  - Buka `index.html`, `privacy-policy/index.html`, `terms-of-service/index.html` di browser.
  - Toggle bahasa ID/EN di tiap halaman.
  - Pastikan 9 feature card muncul dengan benar.
  - Verifikasi link footer dan legal page berfungsi.
- Propose commit message: `docs: sync landing page with latest Android app features`
