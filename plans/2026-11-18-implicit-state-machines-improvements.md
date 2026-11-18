# Implicit State Machines Audit and Holistic Improvements Plan

Created: 2026-11-18 08:50:00

## Objective
Audit and inventory all implicit state machines across the Waktu Sejak web application, and design targeted architectural and runtime enhancements that simultaneously elevate User Experience (UX), Developer Experience (DX), and Agent Experience (AX) without breaking existing functionality or performance.

## Scope
- Shared i18n / language lifecycle state machine (`i18n.js`, `index.html`, `privacy-policy/index.html`, `terms-of-service/index.html`).
- Mobile responsive navigation state machine (`index.html`).
- Platform store availability state machine (`index.html`).
- Viewport active section / scrollspy state machine (`index.html`).
- Skip navigation link focus state machine (`index.html`, `privacy-policy/index.html`, `terms-of-service/index.html`).
- Verification suites (`tests/state-machines.test.js`).

## Milestones
1. Complete thorough codebase audit identifying all implicit state machines.
2. Formulate explicit state machine models (states, events, transitions, invariants) for each item.
3. Define non-breaking enhancements balancing UX, DX, and AX.
4. Document critical failure modes, counter-arguments, and implementation roadmaps.

## Tasks
- [x] Identify and verify all implicit state machines in the repository source code.
- [x] Model explicit states, events, transitions, and contracts for each machine.
- [x] Design multi-dimensional improvements for UX, DX, and AX.
- [x] Evaluate edge cases, trade-offs, and risk mitigations.
- [x] Propose structured implementation roadmap.
- [x] Implement explicit i18n lifecycle with URL query param sync (`?lang=`), DOM data attributes (`data-lang`, `data-lang-state`), and `i18n:change` custom event.
- [x] Implement explicit mobile navigation drawer state (`data-state`, `aria-hidden`, `data-menu-open` scroll lock, and `nav:statechange` event).
- [x] Implement explicit store availability semantics (`data-store`, `role="region"`, accessible labels, and non-intrusive interactive feedback notice).
- [x] Implement IntersectionObserver-based ScrollSpy state machine with `aria-current="true"` and `data-active-section`.
- [x] Implement accessible skip navigation link and `tabindex="-1"` target focus across all three pages.
- [x] Expose unified agent interface on `window.__APP_STATE__` (`i18n`, `nav`, `scrollspy`).
- [x] Expand regression test suite to 7 passing tests covering all explicit state machine contracts.

## Risks
- Introducing URL query parameter syncing (`?lang=`) must not cause unexpected history stack pollution (`history.replaceState` is used instead of `pushState`).
- ScrollSpy / IntersectionObserver uses `rootMargin: '-20% 0px -70% 0px'` to prevent layout thrashing or rapid flickering.
- Body scroll lock is restricted to `@media (max-width: 768px)` to prevent desktop layout shifts.
- Exposing runtime state on `window` is scoped strictly to `window.__APP_STATE__` with guarded methods.

## Progress Log
- 2026-11-18 08:50:00 — Plan initialized. Completed comprehensive audit of 5 implicit state machines across all pages. Detailed proposed architectural models and verification recommendations.
- 2026-11-18 09:08:00 — Implementation completed across all pages (`i18n.js`, `index.html`, `privacy-policy/index.html`, `terms-of-service/index.html`, and `tests/state-machines.test.js`). 7 automated state machine tests pass. Preserved LF/CRLF conventions. Ready for review.

## Notes
- All proposed enhancements preserve vanilla JS / static architecture with zero external dependencies.
- Retains existing `ws_lang` localStorage schema and key conventions for seamless backward compatibility.
