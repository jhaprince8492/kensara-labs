/**
 * Home page copy. Text lives here, not in JSX, so a non-engineer can edit the
 * site without opening a component.
 *
 * No em dashes anywhere on this site. Where a sentence wants one it gets a
 * comma, a colon, a full stop, or a mono middot.
 */

export interface IndustryTile {
  name: string;
  standards: string;
  href: string;
}

export const home = {
  meta: {
    title: 'Kensara Labs · Provable AI governance',
    description:
      'Kensara proves what your systems claim and gates what your agents do. Every consequential action is checked against compiled policy before it executes.',
  },

  // ---------------------------------------------------------------- H1 hero
  hero: {
    eyebrow: 'KENSARA LABS · PROVABLE AI GOVERNANCE',
    h1: [
      'Software that decides and acts on its own authority',
      'has to be provably correct, not probably correct.',
    ],
    /** Set at display size. This is the line that says what the company sells. */
    sub: 'Kensara proves what your systems claim and gates what your agents do.',
    subDetail:
      'Every consequential action is checked against compiled policy before it executes. No exceptions, no sampling.',
    chips: [
      { text: 'PROVEN · unsat core 4 of 412 · 41ms', tone: 'proof' as const },
      { text: 'DENY · R-207 evidence_freshness', tone: 'refute' as const },
      { text: 'ALLOW · fin-in-v3.1 · 31ms', tone: 'proof' as const },
    ],
    primaryCta: { label: 'Explore the Sentinel engine', href: '/sentinel/' },
    secondaryCta: { label: 'Read the engineering journal', href: '/journal/' },
    sceneAlt:
      'A drifting cloud of roughly 14,400 reachable system states. Most resolve calm blue. A handful deep inside the cloud are marked as refuted. A thin scanning ray sweeps through and touches 128 of them.',
    counterLabel: 'states sampled',
  },

  // --------------------------------------------------------------- H2 shift
  shift: {
    rule: { label: 'PREMISE', value: 'assurance model' },
    h2: ['For forty years we tested a sample.', 'Then software started choosing.'],
    body: [
      'That worked while software did what it was told. It stopped working the moment software started making the call itself.',
      "An agent's behaviour is not a fixed set of paths you can enumerate. It is a space you can only sample, and sampling has never been able to tell you what it missed.",
    ],
    diagram: {
      leftLabel: 'DETERMINISTIC · ENUMERABLE',
      rightLabel: 'AGENTIC · SAMPLED',
      caption: 'Five paths you can list. A space you cannot.',
      alt: 'A linear flowchart of five sequential steps morphs into a branching decision tree whose leaves continue past the frame.',
    },
  },

  // ----------------------------------------------------------------- H4 turn
  turn: {
    rule: { label: 'ALTERNATIVE', value: 'formal verification' },
    h2: 'The alternative to more testing is proof.',
    body: [
      'Formal verification has certified avionics and silicon for thirty years. The bottleneck was never the mathematics. It was writing the specification, which cost more than writing the software it described, so it stayed where a regulator forced it and nowhere else.',
      'That is the bottleneck we remove. And the language model that helps remove it sits outside the trusted boundary, where it belongs. It drafts the specification. It never decides the verdict.',
    ],
    diagram: {
      sourceLabel: 'REQUIREMENT · NATURAL LANGUAGE',
      targetLabel: 'SPECIFICATION · TEMPORAL LOGIC',
      targetText: 'G ¬(arm(t1) ∧ arm(t2))',
      boundaryLabel: 'advisory · not authoritative',
      trustedLabel: 'TRUSTED BOUNDARY',
      caption: 'The model drafts. A human confirms. The solver decides.',
      alt: 'A natural-language requirement on the left compiles into a temporal-logic formula on the right. The language model sits in a dashed box outside the trusted boundary, labelled advisory, not authoritative.',
    },
  },

  // --------------------------------------------------------------- H5 system
  system: {
    rule: { label: 'SYSTEM', value: 'formus · sentinel' },
    h2: 'Two engines. One artifact.',
    formus: {
      eyebrow: 'FORMUS · REQUIREMENTS',
      title: 'Formus proves.',
      body: 'Give it a requirement written in English. It proposes the formal property, a named engineer confirms it, and a deterministic checker decides whether your system satisfies it. Your existing tools prove the code does not crash. This proves it does what the requirement said.',
      hook: 'Not pass or fail. Which requirement, and the line it breaks on.',
      readout: 'FIDELITY · 32 implemented · 3 violated · 2 unproven · 1 vacuous',
      gloss:
        'A proof that passes can still be worthless. The fidelity report says which properties actually constrained the design, and where the rest break.',
      cta: { label: 'Explore Formus', href: '/formus/' },
    },
    sentinel: {
      eyebrow: 'SENTINEL · ACTIONS',
      title: 'Sentinel permits.',
      body: 'It sits between your agent and every consequential action. The agent holds no credentials; the gate does. A decision is allow, deny, or allow with conditions attached and enforced.',
      hook: 'Checked before it executes, every time.',
      readout: 'DENY · evidence staleness · authoritative source disagrees',
      gloss:
        'Sensitivity NONE passes through in about 0ms and is logged. HIGH gets full evaluation in single-digit milliseconds.',
      cta: { label: 'Explore Sentinel', href: '/sentinel/' },
    },
  },

  // ----------------------------------------------------------------- H6 demo
  demo: {
    rule: { label: 'LIVE', value: 'client-side · deterministic' },
    h2: 'A support agent wants to refund an order. You set the conditions.',
    body: 'Runs entirely in your browser. No backend, no randomness, no simulated latency. The decision id is a real SHA-256 of the inputs, so the same conditions always produce the same verdict, the same trace and the same hash. Open devtools and check.',
    footnote:
      'Change the evidence age. Change what the order system says. The verdict is a function of the evidence, not of judgement.',
  },

  // ------------------------------------------------------------- H7 artifact
  artifact: {
    rule: { label: 'ARTIFACT', value: 'assurance object' },
    h2: 'Every verdict leaves a signed record your auditor can check without us.',
    lead: 'An Assurance Object is a single signed file binding four things that normally live in four different systems:',
    binds: [
      'the requirement in the engineer’s words',
      'the formal specification it compiled to',
      'the verdict and its certificate',
      'the regulatory clause it satisfies',
    ],
    body: 'It replays byte-identically on any machine, forever. Verification is a local check. There is no service to call and nothing of ours to trust.',
    clauses: ['DO-178C 6.3.1', 'IEC 62304 5.5', 'DPDP §8(5)'],
    cta: { label: 'Open a real Assurance Object', href: '/assurance-object/' },
  },

  // ----------------------------------------------------------- H8 industries
  industries: {
    rule: { label: 'DEPLOYMENT', value: '6 sectors' },
    h2: 'Where it runs.',
    tiles: [
      {
        name: 'Aerospace & defence',
        standards: 'DO-178C / DO-333',
        href: '/industries/aerospace-defence/',
      },
      {
        name: 'Healthcare',
        standards: 'IEC 62304 / ISO 13485',
        href: '/industries/healthcare-lifesciences/',
      },
      {
        name: 'Financial services',
        standards: 'RBI / SEBI / DPDP',
        href: '/industries/financial-services/',
      },
      {
        name: 'Automotive',
        standards: 'ISO 26262',
        href: '/industries/automotive-mobility/',
      },
      {
        name: 'Semiconductors',
        standards: 'firmware root-of-trust',
        href: '/industries/semiconductors/',
      },
      {
        name: 'Regulated SaaS',
        standards: 'GDPR / DPDP / SOC 2',
        href: '/industries/regulated-saas/',
      },
    ] satisfies IndustryTile[],
  },

  // ---------------------------------------------------------------- H9 close
  close: {
    rule: { label: 'NEXT', value: '45 min' },
    h2: 'Bring us the decision you cannot afford to get wrong.',
    body: 'A scoping call is 45 minutes. Bring one real workflow: an agent action you have stopped short of automating, or a requirement your certification body keeps sending back. We will tell you honestly whether this is the right instrument for it.',
    ctas: [
      { label: 'Request access', href: '/demo/', kind: 'primary' as const },
      { label: 'Read the engineering journal', href: '/journal/', kind: 'secondary' as const },
    ],
  },
} as const;
