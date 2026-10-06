# Project Memory Index

Last Updated: 2026-10-05 22:06:00 +07:00  
Format Version: 1.0.0  

## Current State
Landing page Waktu Sejak dalam kondisi stabil dan siap produksi. Seluruh temuan code review (syntax error di Privacy Policy, mapping data-i18n, perbaikan skip link a11y, Core Web Vitals LCP/CLS, navigasi mobile responsif, HTTP security headers di `vercel.json`, sitemap, robots.txt, dan sanitasi repositori) telah diperbaiki dan diverifikasi secara komprehensif.

## Active Decisions
- Arsitektur: Static vanilla HTML/CSS/JS tanpa dependensi eksternal, di-deploy ke Vercel.
- Internasionalisasi: Bilingual ID/EN berbasis client-side DOM swap dengan kamus terisolasi, disanitasi ketat melalui whitelist `id`/`en` dan aman dari exception `localStorage`.
- Desain & Aksesibilitas: Palet Okabe-Ito, WCAG 2.1 AA compliant (seluruh teks dan badge memiliki rasio kontras >= 4.5:1), landmark semantik `<main id="main-content">`, accessible skip link, dan tap target mobile >= 44x44px.
- SEO & Keamanan: Deklarasi `x-default`, update metadata dinamis saat beralih bahasa, HTTP security headers (`nosniff`, `DENY`, `strict-origin-when-cross-origin`, `Permissions-Policy`), `robots.txt`, dan `sitemap.xml`.

## Open Items & Blockers
- None.

## Legacy Archive
- [PROJECT_MEMORY.md (Legacy)](../PROJECT_MEMORY.md)

## Recent Entries
- [2026-10-05 Comprehensive Landing Page Fixes](2026-10-05/220600-comprehensive-landing-page-fixes.md)
