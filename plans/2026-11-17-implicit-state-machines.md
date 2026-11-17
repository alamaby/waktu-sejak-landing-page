# Implicit State Machines Audit and Improvements

Created: 2026-11-17 21:14:10

## Objective
Identify implicit runtime state machines in the static Waktu Sejak site, improve their clarity and accessibility without changing expected behavior, and document the findings and verification.

## Scope
- Shared Indonesian/English language selection and rendering on the landing page, Privacy Policy, and Terms of Service.
- Landing page responsive mobile navigation state.
- Store availability presentation on the landing page.
- Audit of other client-side state and initialization patterns.
- Regression tests for state transitions and translation consistency.

## Milestones
1. Inventory stateful behavior and inspect repository memory and existing page conventions.
2. Extract shared language state/rendering and make navigation state explicit/accessibly synchronized.
3. Represent store availability through one explicit state and add focused regression tests.
4. Review changes and execute available checks; note remaining risks.

## Tasks
- [x] Read active project memory and inspect all site HTML/JS for state-like behavior.
- [x] Create shared `i18n.js` and wire all three pages to it.
- [x] Make mobile menu open/closed state explicit, synchronized with `aria-expanded`, and dismissible by Escape, outside click, link activation, and desktop breakpoint.
- [x] Declare store availability on each card and derive presentation from that state.
- [x] Add regression tests for language dictionaries, persistence, cross-tab updates, storage failures, menu behavior, and availability semantics.
- [x] Review changes, preserve file line-ending conventions, and run available static tests.
- [ ] Browser-level visual and assistive-technology verification (not run in this environment).

## Risks
- Language translation remains a client-side DOM swap; crawlers or users with JavaScript disabled only receive the Indonesian HTML source. This matches the existing architecture, but server-rendered localized pages would be needed for localized indexing without JS.
- Outside-click dismissal and closing on breakpoint change add expected menu-dismiss behavior; test with keyboard/touch in a real browser before release.
- The App Store card remains non-interactive while marked `soon`; when availability changes, it must be converted into a real link and destination supplied.
- Automated DOM tests use a small mock rather than a browser engine and cannot detect layout, focus-ring, contrast, or assistive-technology issues.

## Progress Log
- 2026-11-17 21:14:10 — Initial inventory completed. Identified shared language state, mobile navigation, and store availability as explicit state machines; no other client-side state machinery found in site source. Started implementation.
- 2026-11-17 21:14:10 — Extracted shared i18n controller, completed language wiring and page metadata updates, formalized menu state and availability attributes, and added five regression tests. Automated checks pass; browser visual/a11y verification remains pending.

## Notes
- Preserved the `ws_lang` key and `id`/`en` values for compatibility. The controller still defaults to Indonesian, reads/writes through guarded localStorage access, and follows valid cross-tab storage events.
- The landing page download availability model is `available` for Google Play and `soon` for App Store. Styling is derived from `data-availability`; the Google Play anchor remains an anchor with its existing destination and security attributes.
- The working tree was clean before this task. Current changes are uncommitted.
- Proposed commit: `refactor: make landing page state explicit`
