# Project Memory Index

Last Updated: 2026-11-18 09:10:00 +07:00
Format Version: 1.0.0  

## Current State
Landing page Waktu Sejak dalam kondisi stabil dan siap produksi. Seluruh 5 implicit state machine (i18n, navigasi mobile, ketersediaan store, scrollspy seksi aktif, dan skip link focus) telah diimplementasikan secara eksplisit dengan optimasi tri-perspektif (UX, DX, AX). Automated regression suite diperluas menjadi 7 passing tests; verifikasi statis lulus tanpa dependensi eksternal.

## Active Decisions
- Arsitektur: Static vanilla HTML/CSS/JS tanpa dependensi eksternal, di-deploy ke Vercel.
- Internasionalisasi: Bilingual ID/EN berbasis client-side DOM swap dengan kamus terisolasi, sinkronisasi URL query param `?lang=` non-destructive via `history.replaceState`, dan atribut DOM `data-lang` & `data-lang-state`.
- Desain & Aksesibilitas: Palet Okabe-Ito, WCAG 2.1 AA compliant (seluruh teks dan badge memiliki rasio kontras >= 4.5:1), landmark semantik `<main id="main-content" tabindex="-1">` konsisten di seluruh halaman, accessible skip link, dan tap target mobile >= 44x44px.
- Navigasi & Orientasi: ScrollSpy berbasis `IntersectionObserver` ringan yang memperbarui `data-active-section` dan `aria-current="true"`, serta penguncian scroll mobile body saat drawer aktif.
- Agent Interface: Menyediakan interface aman pada `window.__APP_STATE__` (`i18n`, `nav`, `scrollspy`) untuk inspeksi dan otomasi deterministik oleh agen testing/AI.
- SEO & Keamanan: Deklarasi `x-default`, update metadata dinamis saat beralih bahasa, HTTP security headers (`nosniff`, `DENY`, `strict-origin-when-cross-origin`, `Permissions-Policy`), `robots.txt`, dan `sitemap.xml`.

## Open Items & Blockers
- Verifikasi visual dan assistive-technology pada browser nyata.

## Legacy Archive
- [PROJECT_MEMORY.md (Legacy)](../PROJECT_MEMORY.md)

## Recent Entries
- [2026-11-18 Comprehensive Implicit State Machines Audit and Tri-Perspective Optimizations](2026-11-18/084800-implicit-state-machines-comprehensive-audit.md)
- [2026-11-17 Implicit State Machines Audit](2026-11-17/211410-implicit-state-machines-audit.md)
- [2026-10-05 Comprehensive Landing Page Fixes](2026-10-05/220600-comprehensive-landing-page-fixes.md)
