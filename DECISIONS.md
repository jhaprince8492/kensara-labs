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

## Phase 2

### Scenes

- `useSceneArmed` replaces the per-scene gate: a live scene mounts only on a capable tier, only once its container is within 200px of the viewport, and only once the browser is idle. All three scenes share it.
- Scene C's sequence fires once on arrival and then only on request. A three-second reveal that replays on every scroll-past stops being persuasive by the third viewing, so it gets a visible re-run control instead.
- Scene C's choreography is one progress value driving three overlapping windows: dim 0 to 0.30 on ease-out-quart, ignite 0.15 to 0.55, collapse 0.35 to 1.0 on ease-in-out-quint, staggered by each node's radius so the collapse reads as a wave inward rather than a fade.
- The canonical minimisation is deliberately slower to leave and faster through the middle. A linear collapse read as a transition; this reads as a reduction, which is the actual claim.
- Scene C's core matches the assurance object's recorded `unsat_core` exactly, and `check-scenes` asserts it. The graph on screen and the hash in the object describe the same proof.
- `/formus` keeps the composed still in the hero and puts the live scene in the minimisation section, rather than mounting Scene C twice on one page. The hero still shows the resolved state, which is the right hero image; the section shows it resolving.
- Scene B's three scenarios are fixed rather than sampled. A gate that demonstrates itself differently on every visit is demonstrating the wrong property. The readout under the corridor names the action, pack and deciding rule for whichever scenario is on screen, so the motion is never decorative.
- Scene B's corridor is drawn as four rails plus ribs so depth reads without lights, and every material is `MeshBasicMaterial`. No lighting pass, and the flat instrument look is the intent rather than a compromise.
- Source geometries in Scene B are hoisted to module constants; creating them inline in JSX leaked a geometry per render.
- `check-scenes` is a new build gate. The scenes are seeded, so their output is checkable without a GPU: it asserts finite coordinates, the exact core ids, a sampled share that does not overstate the true 128/14,412, full core connectivity, and that two builds of the same seeded graph are byte-identical.

### Pages

- `/industries` (the hub) ships in Phase 2 rather than Phase 3. It is in the blueprint sitemap, and the three sector pages need a parent for the nav item to point at. The three unpublished sectors appear on the hub with their standards and are not links.
- The six sector pages share one rigid template driven by `content/data/industries.ts`. Consistency is worth more than creativity here: a buyer comparing two pages should find the same thing in the same place.
- Every sector page carries the "what we do not do here" section as its own numbered step in the template rather than as a footnote, because naming the boundary is the most credible thing on the page.
- `/security` keeps its factual attestations in `content/data/security.ts`, shipped empty. Certification status and sub-processors are claims about the world; the page states an honest fallback rather than a placeholder, and the architecture claims (which follow from the design) are stated in full.
- Nav settles at five primary items plus two utility links plus the CTA. `Assurance object` moved out of the primary nav to the footer and inline links when `Platform` and `Industries` arrived, keeping the blueprint's seven-item ceiling.

### Journal

- MDX bodies live in `content/journal/` with a typed registry in `posts.ts` holding metadata and a static import map, rather than as route-level `page.mdx` files. Keeps content out of `app/` as the layout specifies, and `generateStaticParams` reads the registry.
- `mdx-components.tsx` applies the same measure and the same mono rule as the rest of the site: prose proportional and capped, code and identifiers monospaced.
- Post dates are set before today so the cadence claim on the index page is not contradicted by the archive.

### Verification

- The Browser pane was not compositing frames during this phase, so the three live scenes were verified structurally (typecheck, clean production build, seeded-generator assertions, zero console errors, correct still fallbacks and text equivalents) and **not visually**. A human pass on the animation itself is outstanding.
- Running `next build` while `next dev` shares `.next` produces a half-written manifest that passed every budget. `check-bundle` now rejects a manifest with fewer than ten routes or an implausibly small initial bundle.

## Homepage rebuild

### The headline

- The requested line, "provably 100% correct", was not shipped. It is the same class of warranty statement as the banned "guarantees 100% compliance", and it contradicts `REFUSE`, which `/formus` leads with. Shipped instead: **"Software that decides and acts on its own authority has to be provably correct, not probably correct."** Same force, no warranty, and it states the blueprint's central idea in six words.
- The 100% claim survives as a mechanism rather than a promise, in the hero's second line: "Every consequential action is checked against compiled policy before it executes. No exceptions, no sampling."
- The hero drops to `text-60` from `text-88`. The new headline is 100 characters against the old 62, and at 88px it filled the viewport before the sub-line was reached.

### The problem matrix (new H3)

- All four problems from the reference slide are carried with their own names: state-space explosion, proof brittleness, expertise shortage, environment constraints. Four Sentinel problems were added alongside them, because the slide's four are all Formus problems and a homepage that lists them alone proves half the company.
- **Problems and solutions are separated by ground and elevation, not by colour.** The reference uses orange against green; orange is not a token here and green already means the gate is enforcing. The problem sits flat on `--void`, the answer is raised onto `--slate-800`. The only hue in a row is its mono readout, which is a real verdict, so colour still means what it means everywhere else.
- Icons are replaced by eight pairs of hairline failure glyphs, each a miniature of the geometry the row is about. A lightbulb beside "expertise shortage" is exactly the stock iconography the blueprint bans. Roughly 5KB of inline SVG, static, server-rendered, all `aria-hidden` so a PDF export loses nothing.
- Markup is a `<dl>` per group with the problem as `<dt>` and the answer as `<dd>`, so the pairing reaches a screen reader without an ARIA table.
- The old "cost" section is absorbed: its four failure modes are now `REAL COST` lines inside the matrix, permanently visible instead of hidden behind hover.
- `assumptions: 14 inferred · 14 validated · 0 unstated` is the one readout in the matrix not drawn from something already built. Flagged for replacement with the real shape.

### Other changes

- **The demo lands on a decision.** The default scenario is evaluated on mount and shown already settled, with no animation and no screen-reader announcement. Previously the panel read "No decision yet", which meant every screenshot, PDF export and non-clicking visitor saw a blank where the highest-converting component should be.
- Changing an input now marks the decision `stale` and keeps it on screen behind a notice, rather than blanking the panel and returning it to the empty state.
- The demo is promoted from an `h3` inside the engines section to its own section with its own rule strip.
- `unsat core` and `Assurance Object` are each glossed in one line at first use on the home page.
- The two diagram captions ("Five paths you can list. A space you cannot." and "The model drafts. A human confirms. The solver decides.") moved from 12px `--ink-500` to 17px `--ink-100`. They were the clearest sentences in their sections and were set to be ignored.
- Every industry tile is now a link. The three sectors without pages anchor to their card on the hub instead of going nowhere.
- The journal is promoted to the hero's secondary CTA. It is the investor path and it was the least prominent link on the page.

### Cost

- Home initial JS 113.5KB gzip (was 112.9), home total 151.4KB gzip (was 142.7). Both well inside budget.
- The page is longer: roughly nine screens at a 1440x900 desktop against six before. The matrix is about 1,900px of that. If it needs to come down, the cheapest cut is H2, whose argument is now carried by the matrix's `REAL COST` lines.

## Formus rebuild

The page was built on the blueprint's P2 framing, which is a different product: it answered regulated questions over a rule base, with a GST input-tax-credit worked example. Formus actually automates requirement-to-property authoring and feeds existing verification flows. That is a rebuild, not an edit.

### Positioning

- **Formus sits above the solvers and feeds them.** The old solver section read as "we pick your solver for you", which puts us in the solver business. It now reads as "we emit into the flow you already run". Feeding an incumbent environment is a stronger commercial position than appearing to replace it.
- **No competitor is named.** Checking engines are named (z3, cvc5, lean, nuXmv, SPIN, soufflé) and emitted formats are named (SVA, ACSL, TLA+, C assertions). Commercial verification environments are referred to as "the formal environment you already own".
- The hero leads with the conformance gap, not with a capability: "Your tools prove the code does not crash. Formus proves it does what the requirement said." It states the gap and what we do in one breath.
- The GST worked example is gone. One Class C infusion pump requirement now runs end to end through all eight stages, with a VIOLATED and an UNPROVEN variant beside it.

### The fidelity report

- New section, and the most differentiated object on the site. Reports per requirement: IMPLEMENTED, VIOLATED with the file, line, cycle and cause, VACUOUS, or UNPROVEN with a stated reason. Summary counts plus a mutation-kill and vacuity line.
- `VerdictChip` gained those four statuses rather than getting a parallel component, so a verdict looks the same everywhere on the site. Colour semantics are unchanged: implemented is proof blue, violated is refute red, vacuous is hold amber, unproven is neutral like REFUSE.
- The "where it breaks" line is never truncated and never behind an interaction. It is the reason the section exists.

### Authority

- A three-actor section replaces the single confirmation-gate section: the advisory model has no authority and proposes, the named engineer decides what the requirement meant, the deterministic checker decides whether the system satisfies it. That division is the certifiability argument, so it is stated as a structure rather than as a sentence.
- The banned-claim phrasing is used: "the authoritative path contains no language model, verdicts come from a checker, not from a generation".

### Domains

- Three sections, each named: safety-critical software (medical, avionics, automotive, rail), sovereign defence and space (CEMILAC, DRDO, DDPMAS-2002), semiconductor and hardware. Continuous proof is its own section rather than a domain, because it is an expansion and not a market.
- The AI trust layer is deliberately absent from this page.

### Numbers that need sourcing before launch

- "nine-month" evidence assembly and "around month six" abandonment were supplied by the company and are stated plainly. Neither is attributed on the page. **Both should be sourced or softened before launch.**
- `mutation kill 47 of 52`, `38 requirements`, and the per-requirement rows are an illustrative worked example, consistent with the pump requirement used in the assurance object. They are not measured product output.

### Cross-page consequence

- The homepage Formus panel described the old product. Its eyebrow, body, hook, readout and gloss were updated to the requirement-to-proof framing, and the matrix row now names the deterministic checker rather than "the solver". No other homepage content was touched.
