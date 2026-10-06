# Comprehensive Landing Page Fixes

Date: 2026-10-05 22:06:00 +07:00

## Task / Problem
Memperbaiki seluruh temuan hasil code review pada landing page Waktu Sejak, meliputi 2 bug kritis (syntax error petik unescaped dan data-i18n mapping di Kebijakan Privasi), masalah aksesibilitas skip link & rasio kontras WCAG AA, navigasi responsif mobile, optimasi Core Web Vitals (LCP/CLS), security headers, sitemap, robots.txt, dan sanitasi repositori.

## Key Files Changed
- `privacy-policy/index.html`: Perbaikan petik unescaped (`Google\'s`, `app\'s`), pemetaan `data-i18n` Section 2 (`s2_p1..3`), hardening `localStorage`, favicon, preconnect, dan focus styling.
- `terms-of-service/index.html`: Hardening `localStorage`, favicon, preconnect, dan focus styling.
- `index.html`: Penambahan `<main id="main-content">`, perbaikan accessible `.skip-link`, penanganan navigasi mobile (auto-close, `aria-expanded`, Escape key), hardening `localStorage`, kontras badge `.dl-status.available` (#006644), penghapusan `loading="lazy"` di hero ATF, penambahan `fetchpriority="high"` & atribut dimensi gambar, SEO `x-default`, meta description & title sync.
- `vercel.json`: Penambahan HTTP Security Headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-DNS-Prefetch-Control`) dan penghapusan rewrite rule `sw.js` yatim.
- `robots.txt`: Berkas baru untuk perayapan mesin pencari dengan tautan sitemap.
- `sitemap.xml`: Berkas baru sitemap standar untuk seluruh rute landing page (`/`, `/privacy-policy`, `/terms-of-service`).
- `.gitignore`: Berkas baru untuk sanitasi file OS, IDE, dan local cache worktree (`.claude/`, `.gemini/`).
- `uploads/`: Direktori redundan dihapus dari pelacakan git dan disk.
- `plans/2026-10-05-comprehensive-landing-page-fixes.md`: Plan pelacakan tugas dan progres.

## Technical & Business Decisions
- Menyelaraskan teks Section 2 Kebijakan Privasi dengan kamus i18n yang sudah memuat klausul portabilitas data CSV dan ketiadaan permission `INTERNET`.
- Menggunakan `#006644` untuk teks status ketersediaan agar mencapai kontras 5.8:1 (> 4.5:1) terhadap latar belakang hijau muda, mematuhi WCAG 2.1 AA tanpa merusak estetika desain Okabe-Ito.
- Menetapkan `hreflang="x-default"` untuk navigasi single-URL multi-bahasa berbasis DOM swap.
- Mengamankan akses storage lokal peramban dengan blok `try...catch` dan whitelist nilai bahasa yang diizinkan (`id` atau `en`).

## Assumptions & Risks
- Pengguna yang sebelumnya memiliki nilai `ws_lang` selain `id` atau `en` di browser kini otomatis di-fallback ke `id` tanpa memicu uncaught exception.
- Penghapusan direktori `uploads/` tidak mempengaruhi tampilan situs karena seluruh elemen HTML merujuk ke direktori `assets/`.

## Blockers & Open Items
- Tidak ada blocker aktif. Seluruh pengujian dan verifikasi berhasil.

## Verification Done / Suggested
- Menjalankan script uji verifikasi otomatis `scratch/verify_all.js` mencakup validitas sintaks JS, eksekusi VM, ketiadaan duplikasi `data-i18n`, kelengkapan kamus ID dan EN, serta eksistensi berkas aset.
- Verifikasi Git status: folder duplikat `uploads/` telah dihapus dan `.claude/` diabaikan oleh `.gitignore`.

## Proposed Conventional Commit
`fix: resolve syntax error, i18n mapping, a11y, and security headers`

## Related Links
- Plan: `plans/2026-10-05-comprehensive-landing-page-fixes.md`
