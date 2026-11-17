# Project Memory Index

Last Updated: 2026-11-17 21:14:10 +07:00
Format Version: 1.0.0  

## Current State
Landing page Waktu Sejak dalam kondisi stabil dan siap produksi. Temuan code review sebelumnya telah diperbaiki dan diverifikasi. Audit lanjutan merapikan state bahasa bersama, navigasi mobile, dan status ketersediaan store; automated state tests pass. Perubahan belum di-commit; browser-level visual dan assistive-technology verification masih direkomendasikan.

## Active Decisions
- Arsitektur: Static vanilla HTML/CSS/JS tanpa dependensi eksternal, di-deploy ke Vercel.
- Internasionalisasi: Bilingual ID/EN berbasis client-side DOM swap dengan kamus terisolasi, disanitasi ketat melalui whitelist `id`/`en` dan aman dari exception `localStorage`.
- Desain & Aksesibilitas: Palet Okabe-Ito, WCAG 2.1 AA compliant (seluruh teks dan badge memiliki rasio kontras >= 4.5:1), landmark semantik `<main id="main-content">`, accessible skip link, dan tap target mobile >= 44x44px.
- SEO & Keamanan: Deklarasi `x-default`, update metadata dinamis saat beralih bahasa, HTTP security headers (`nosniff`, `DENY`, `strict-origin-when-cross-origin`, `Permissions-Policy`), `robots.txt`, dan `sitemap.xml`.

## Open Items & Blockers
- Verifikasi visual dan assistive-technology pada browser nyata untuk pembaruan navigasi mobile.

## Legacy Archive
- [PROJECT_MEMORY.md (Legacy)](../PROJECT_MEMORY.md)

## Recent Entries
- [2026-11-17 Implicit State Machines Audit](2026-11-17/211410-implicit-state-machines-audit.md)
- [2026-10-05 Comprehensive Landing Page Fixes](2026-10-05/220600-comprehensive-landing-page-fixes.md)
