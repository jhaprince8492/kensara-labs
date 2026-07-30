# Kensara Labs

The public website. Next.js 15 App Router, TypeScript strict, Tailwind v4,
statically exported.

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm check          # typecheck, lint, build, bundle assertions
```

`pnpm check` is the gate. It fails if `three` reaches any route's initial
chunks, if initial JS passes 180KB gzipped, or if the home page passes 1.4MB.

## Where things live

| Path | What |
|---|---|
| `content/copy/` | Every page's text, as typed objects. Edit here, not in JSX. |
| `content/data/` | The assurance object, the team. |
| `lib/policy/` | The deterministic evaluator behind `SentinelGate`. |
| `lib/hash.ts` | Canonical serialization and SHA-256. |
| `lib/scenes/` | Seeded generators shared by each live scene and its still. |
| `components/primitives/` | `SectionRule`, `Eyebrow`, `VerdictChip`, `MonoLine`, `Prose`, `Reveal`, `WorkedExample`. |
| `DECISIONS.md` | Every judgement call, one line each. |

## The rules that are not negotiable

**Colour is data.** `--proof` means proven or allowed. `--gate` means the gate
is enforcing. `--hold` means a human is required. `--refute` means refuted or
denied and is used for nothing else. When something needs separation rather
than meaning, it gets `--hairline`.

**Prose is proportional, evidence is monospaced.** Every hash, rule id, verdict,
timestamp, pack name, latency and standards reference is set in mono.

**Numbering is for the two pipelines only.** Those stages are genuinely ordered.
Nothing else is.

**Reduced motion is a first-class path**, not a retrofit. Every scene has a
composed still and a text equivalent; every reveal becomes instant.

## Configuration

| Variable | Effect |
|---|---|
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Enables the Plausible stub. Unset means no analytics at all. |
| `NEXT_PUBLIC_FORM_ENDPOINT` | POST target for the access request form. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `mailto:` fallback for the form. |

## Status

Phase 1 complete: home (8 sections, Scene A live), `/formus`, `/sentinel`,
`/assurance-object`, `/company`, `/demo`. Scenes B and C ship as composed
stills. Phases 2 and 3 are listed in the build brief.
