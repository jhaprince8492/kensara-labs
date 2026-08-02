/**
 * Home page copy. Text lives here, not in JSX, so a non-engineer can edit the
 * site without opening a component.
 *
 * Blueprint copy is used as written, with one systematic change: em dashes are
 * removed sitewide per the build constraint. Where the blueprint used one, the
 * sentence is repunctuated (comma, colon, full stop, or a mono middot) and the
 * wording is otherwise untouched.
 */

export interface CostCard {
  eyebrow: string;
  line: string;
  /** The counterfactual, revealed on hover and focus. Always mono. */
  counterfactual: string;
}

export interface IndustryTile {
  name: string;
  standards: string;
  href: string | null;
}

export const home = {
  meta: {
    title: 'Kensara Labs · Provable AI governance',
    description:
      'Kensara proves what your systems claim and gates what your agents do, then emits a signed artifact your auditor can verify without trusting us.',
  },

  hero: {
    eyebrow: 'KENSARA LABS',
    h1: ['Agent that decides, intends any authorative action', 'needs to be Provably 100% correct.'],
    sub: 'Kensara builds the trust infrastructure for enterprise AI: engineering requirements, regulations, and safety rules turned into mathematics an AI cannot violate -so every system is proven correct, and every action it takes can be traced, challenged, and blocked..',
    primaryCta: { label: 'See a decision get gated', href: '#gate' },
    secondaryCta: { label: 'Request access', href: '/demo/' },
    sceneAlt:
      'A drifting cloud of roughly 14,400 reachable system states. Most resolve calm blue. A handful deep inside the cloud are marked as refuted. A thin scanning ray sweeps through and touches 128 of them.',
    counterLabel: 'states sampled',
  },

  shift: {
    rule: { label: 'PREMISE', value: 'assurance model' },
    h2: 'For forty years, we assured software by testing a sample of what it might do.',
    body: [
      'That worked while software did what it was told. It stopped working the moment software started choosing.',
      "An agent's behaviour isn't a fixed set of paths you can enumerate. It's a space you can only sample. And sampling has never been able to tell you what it missed.",
    ],
    diagram: {
      leftLabel: 'DETERMINISTIC · ENUMERABLE',
      rightLabel: 'AGENTIC · SAMPLED',
      alt: 'A linear flowchart of five sequential steps morphs into a branching decision tree whose leaves continue past the frame.',
    },
  },

  cost: {
    rule: { label: 'CONSEQUENCE', value: '4 failure modes' },
    h2: 'When a decision is wrong, there is nothing left to debug.',
    cards: [
      {
        eyebrow: 'AGENT ACTION',
        line: 'A refund is issued against an order the OMS says was delivered. The money is gone before the log is read.',
        counterfactual: 'Kensara: DENY · evidence staleness 22m > 5m threshold',
      },
      {
        eyebrow: 'MEDICAL DEVICE',
        line: "A closed-loop pump's timer logic passes every test in the suite and deadlocks on a state the suite never reached.",
        counterfactual: 'Kensara: REFUTED · counter-model at t=3, both timers armed',
      },
      {
        eyebrow: 'FLIGHT SOFTWARE',
        line: 'A mode transition is valid, and valid, and valid, and then unrecoverable, three inputs deep.',
        counterfactual: 'Kensara: REFUTED · trace depth 3 · no recovery edge',
      },
      {
        eyebrow: 'REGULATED ANSWER',
        line: 'A finance model states a tax position with total fluency and no derivation. Nobody can check it, so nobody can sign it.',
        counterfactual: 'Kensara: PROVEN · unsat core 4 of 412 · s.16, s.17(5)',
      },
    ] satisfies CostCard[],
  },

  turn: {
    rule: { label: 'ALTERNATIVE', value: 'formal verification' },
    h2: 'The alternative to more testing is proof.',
    body: [
      'Formal verification has certified avionics and silicon for thirty years. It was never the maths that was slow. It was the translation.',
      'Writing a specification a solver can accept has historically cost 20 to 30 person-years for a codebase built in 2 to 4. That is the bottleneck Kensara removes: our neurosymbolic translation layer turns engineering requirements and regulatory clauses into verifiable logic, and quarantines the language model off the authoritative path. It drafts the specification. It never decides the verdict.',
    ],
    diagram: {
      sourceLabel: 'REQUIREMENT · NATURAL LANGUAGE',
      sourceText: 'The pump shall not arm both timers in the same cycle.',
      targetLabel: 'SPECIFICATION · TEMPORAL LOGIC',
      targetText: 'G ¬(arm(t1) ∧ arm(t2))',
      boundaryLabel: 'advisory · not authoritative',
      trustedLabel: 'TRUSTED BOUNDARY',
      alt: 'A natural-language requirement on the left dissolves into a temporal-logic formula on the right. The language model sits in a dashed box outside the trusted boundary, labelled advisory, not authoritative.',
    },
  },

  system: {
    rule: { label: 'SYSTEM', value: 'formus · sentinel' },
    h2: 'Two engines. One artifact.',
    formus: {
      eyebrow: 'FORMUS · CLAIMS',
      title: 'Formus proves.',
      body: 'Give it a claim and the rules that govern it. It returns PROVEN with a minimal derivation, REFUTED with a concrete counter-example, or REFUSE with a stated reason. Never a confident guess.',
      readout: 'PROVEN · unsat core: 4 of 412 rules · 41ms',
      cta: { label: 'Explore Formus', href: '/formus/' },
    },
    sentinel: {
      eyebrow: 'SENTINEL · ACTIONS',
      title: 'Sentinel permits.',
      body: 'It sits between your agent and every consequential action. The agent holds no credentials; the gate does. Skipping the gate means having nothing to act with.',
      readout: 'DENY · evidence staleness · authoritative source disagrees',
      cta: { label: 'Explore Sentinel', href: '/sentinel/' },
    },
    demo: {
      title: 'Try it. Right here.',
      body: 'A support agent wants to refund an order. You set the conditions.',
    },
  },

  artifact: {
    rule: { label: 'ARTIFACT', value: 'assurance object' },
    h2: 'Every verdict leaves an object behind.',
    body: [
      'Not a log line. A signed, self-contained record binding four things that normally live in four different systems: the requirement in the engineer’s words, the formal specification it compiled to, the proof or decision that resulted, and the regulatory clause it satisfies.',
      'It replays byte-identically on any machine, forever. Your auditor verifies it without asking us anything.',
    ],
    clauses: ['DO-178C 6.3.1', 'IEC 62304 5.5', 'DPDP §8(5)'],
    cta: { label: 'Open a real Assurance Object', href: '/assurance-object/' },
  },

  industries: {
    rule: { label: 'DEPLOYMENT', value: '6 sectors' },
    h2: 'Where it runs.',
    tiles: [
      { name: 'Aerospace & defence', standards: 'DO-178C / DO-333', href: null },
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
      { name: 'Automotive', standards: 'ISO 26262', href: null },
      { name: 'Semiconductors', standards: 'firmware root-of-trust', href: null },
      {
        name: 'Regulated SaaS',
        standards: 'GDPR / DPDP / SOC 2',
        href: '/industries/regulated-saas/',
      },
    ] satisfies IndustryTile[],
  },

  close: {
    rule: { label: 'NEXT', value: '45 min' },
    h2: 'Bring us the decision you cannot afford to get wrong.',
    body: "A scoping call is 45 minutes. Bring one real workflow: an agent action you've stopped short of automating, or a requirement your certification body keeps sending back. We'll tell you honestly whether this is the right instrument for it.",
    ctas: [
      { label: 'Request access', href: '/demo/', kind: 'primary' as const },
      { label: 'Read the engineering journal', href: '/journal/', kind: 'secondary' as const },
    ],
  },
} as const;
