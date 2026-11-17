# Implicit State Machines Audit and Improvements

- **Task:** Inventory implicit client-side state machines in the Waktu Sejak site and implement targeted clarity/accessibility improvements without breaking behavior.
- **Key files changed:** `i18n.js` (new shared language controller); `index.html` (language integration, mobile menu state, availability states, metadata); `privacy-policy/index.html` and `terms-of-service/index.html` (shared language controller integration and description metadata); `tests/state-machines.test.js` (new state/translation regression checks); `plans/2026-11-17-implicit-state-machines.md` (audit plan and progress).
- **Decisions:** Preserve `ws_lang` and its `id`/`en` values; centralize language selection/rendering and synchronize valid cross-tab storage events; model menu visibility as `menuOpen` and keep DOM class/`aria-expanded`/label in sync; encode store availability with one `data-availability` attribute and style from it. Keep current Google Play and coming-soon behavior.
- **Assumptions and risks:** The site remains client-rendered for English, so users/crawlers without JavaScript receive Indonesian content. The App Store card is intentionally not interactive until a destination exists. Unit checks use a minimal DOM mock and don't replace browser, visual, keyboard, or screen-reader verification.
- **Blockers/open items:** Browser-level visual and assistive-technology verification remains recommended; no implementation blocker identified.
- **Verification:** `node --test tests/state-machines.test.js` (5 passing), `node --check i18n.js`, `node --check tests/state-machines.test.js`, `git diff --check`; confirmed HTML line endings match their respective index format (LF for landing and privacy, CRLF for terms).
- **Related plan:** [Implicit State Machines Audit and Improvements](../../plans/2026-11-17-implicit-state-machines.md).
- **Proposed commit:** `refactor: make landing page state explicit`
