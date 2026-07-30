# DECISIONS

Every judgement call made where the blueprint was silent, ambiguous, or in
tension with itself. One line each, newest phase last.

## Phase 1

### Repository and stack

- Built in `C:\Users\hp\KENSARA LABS 2` because `C:\Users\hp\KENSARA LABS` already holds a finished, unrelated Vite project; nothing in it was touched.
- `pnpm` was not installed on this machine, so it was installed globally via npm; `pnpm check` runs typecheck, lint, build and the bundle assertion.
- Next 15.5 / React 19 / Tailwind v4 / TypeScript strict with `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters` on.
- `output: 'export'`, `trailingSlash: true`: no page needs a server at request time, and every internal link carries its trailing slash so the static export resolves without a redirect.
- `three` and `@types/three` are pinned to the same minor (0.185) because two copies of `@types/three` in the tree produce structurally incompatible `Color` and `BufferGeometry` types under strict mode.
- Analytics is a Plausible stub that renders nothing unless `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set at build time, so dev and preview builds ship zero analytics bytes.
- `eslint .` replaces `next lint`, which is deprecated in Next 15 and removed in 16.

### Copy

- **Em dashes are removed sitewide.** The build constraint bans them; the blueprint's own copy contains them. Every affected sentence is repunctuated (comma, colon, full stop, or a mono middot) with the wording otherwise untouched. This is the one systematic departure from "use the blueprint copy verbatim".
- Section rule labels are classifications of the section's content (`PREMISE`, `CONSEQUENCE`, `ALTERNATIVE`, `SYSTEM`, `ARTIFACT`, `DEPLOYMENT`, `NEXT`) rather than section numbers, because numbering is reserved for the two pipelines.
- The footer standards row is labelled `STANDARDS ADDRESSED`, not "compliance", because those are standards the product targets and not certifications the company holds.
- The footer legal line names the incubation and backing relationships only. The registered entity line needs supplying by the company; it was not invented.
- `/company` lists only the two people the blueprint actually names. `content/data/team.ts` is the file to extend; no placeholder people, no stock photography, no invented bios.
- Cost card counterfactuals for the three cases the blueprint left blank were written to match the verdict vocabulary already established (`REFUTED · counter-model at t=3`, and so on).

### Navigation

- Nav links only to routes that exist. `Platform`, `Industries`, `Governance`, `Journal`, `Security` and `Docs` join the nav as their phases ship, rather than appearing now as dead or "coming soon" links.
- Home industry tiles are not links in Phase 1 for the same reason; they become links when the sector pages exist.

### Design tokens and accessibility

- **Two text tiers were added: `--ink-500` (#7B8AA1) and `--proof-ink` (#5A8CFF).** The specified `--ink-600` (2.8:1) and `--proof` (4.2:1) do not clear 4.5:1 as small text on `--void`, and the accessibility floor is stated as a functional requirement. The original tokens are unchanged and still carry rules, borders, fills and large type; only small text uses the tiers. Same hue, same meaning, contrast that passes. Approved at the Phase 1 checkpoint.
- Measured result: zero WCAG AA text-contrast failures across all six pages.
- `REFUSE` is the one verdict chip with no accent colour. It uses `--ink-400` on `--slate-800`, because colouring an honest "I cannot answer" red would classify it as a failure, and red is reserved for refuted and denied.
- A passing predicate renders in `--proof`, not `--gate`. Green is Sentinel's identity and the enforcement path; blue is "this was proven or allowed", which is what a passing predicate is.
- Focus is a 2px `--proof` outline with 2px offset globally. Segmented controls use native radios with `has-[:focus-visible]` on the label so keyboard semantics come from the platform.
- Cost card counterfactuals are revealed on hover only where the device has a hover-capable pointer; on touch they are always visible, and they are always in the DOM for screen readers.

### The policy evaluator

- `evaluate(input, now)` takes the clock as a parameter. `now` stamps the decision and is deliberately excluded from the hash, so the same request is the same decision on any machine at any time.
- The decision id is a real SHA-256 over the canonicalised input: sorted keys, no whitespace, money as integer paise. `canonicalJson` throws on non-integer numbers rather than silently rounding them.
- `replay ✓` is earned: the digest is derived twice from the canonical form and compared. It is not a hardcoded tick.
- The ledger sequence is derived from the decision digest. In the product it is a position in an append-only log; here determinism matters more than realism, so it is a pure function of the decision.
- The verdict block lists failing predicates in rule evaluation order (R-207 then R-311). The blueprint's sample output shows them in the other order while naming R-207 as the deciding rule; evaluation order was chosen because the pack's ordering is fixed.
- **Resolved at the Phase 1 checkpoint: the rules stay literal.** The blueprint says setting `oms_status` to "in transit" must flip the verdict to ALLOW, but R-207 still fails at the default 22 minutes of evidence age, so it stays DENY. Confirmed that R-207 remains a hard rule: reaching ALLOW requires both a non-contradicting source and fresh evidence, which is a truer demonstration than a single control flipping the outcome.
- `window.kensara` exposes `canonicalJson`, `sha256Hex`, `evaluate` and the default input, so a visitor can reproduce any hash the demo shows.

### 3D scenes

- Static frames are inline SVG generated at build time, not pre-rendered WebP. Same composition, same seeded generator as the live scene, roughly 14KB for Scene A, and they are sharp, indexable, themeable and lighter than the 120KB WebP budget allowed.
- Scene A's still is always in the markup and carries the LCP. `three` loads only after `requestIdleCallback` and only when the tier check passes, then fades in over the still, so the hero scene never competes with first paint.
- The sampled-point count in the still is held close to the true 128/14,412 proportion. Inflating it for visual weight would argue against the point the scene exists to make.
- A left-weighted scrim sits over the hero scene and the cloud is offset to the right of the measure, so the headline never competes with the point cloud.
- Scene B's still is drawn by hand; an isometric corridor is a composition, not a generated layout. Scene C's still is generated from the same seeded graph the live scene will use in Phase 2.
- The ledger tick uses a fixed synthetic clock and a seeded sequence, so it reads identically for every visitor and never touches an ambient clock.

### The request form

- `/demo` posts to `NEXT_PUBLIC_FORM_ENDPOINT` if set, falls back to a `mailto:` composed from `NEXT_PUBLIC_CONTACT_EMAIL` if set, and otherwise copies the composed request to the clipboard and shows it. Neither value was invented. **Needs a real endpoint or address before launch.**

### Verification

- `check-bundle.mjs` fails the build if any route's initial chunks contain a three.js fingerprint, if any route's initial JS exceeds 180KB gzipped, or if the home page's total gzipped weight exceeds 1.4MB.
- Measured: home initial JS 112.8KB gzip, home total 142.0KB gzip, `three` absent from every initial chunk.
