import type { PipelineStage } from '@/components/pipeline/PipelineStrip';

export const formus = {
  meta: {
    title: 'Formus',
    description:
      'Formus takes a claim and the rules that govern it, and returns a verdict with a minimal, replayable proof, or an honest refusal.',
  },

  hero: {
    eyebrow: 'FORMUS · CLAIMS · P2 PROOF PATH',
    h1: ['Prove the claim.', 'Show the derivation.', 'Ship the evidence.'],
    sub: 'Formus takes a claim and the rules that govern it, and returns a verdict with a minimal, replayable proof, or an honest refusal.',
    readout: 'PROVEN · unsat core: 4 of 412 rules · z3 4.13.0 · 41ms',
  },

  verdicts: {
    rule: { label: 'VERDICT SPACE', value: '3 outcomes' },
    h2: 'What a verdict actually is.',
    intro:
      'Three outcomes, and the one worth reading first is the one most systems cannot produce.',
    panels: [
      {
        chip: 'REFUSE' as const,
        title: 'It says so when it does not know.',
        body: 'Solver budget exceeded, a vocabulary gap, or an inconsistent slice of the rule base. Formus states which, and stops. A system that answers everything has told you nothing about the answers you should trust.',
        readout: 'REFUSE · vocabulary gap · works_contract undefined in pack gst-in-v2.2',
      },
      {
        chip: 'PROVEN' as const,
        title: 'The goal is entailed, and the core is the explanation.',
        body: 'Formus returns the minimal set of rules that were actually responsible. That set is the derivation an auditor reads, and it is small enough to read.',
        readout: 'PROVEN · unsat core: 4 of 412 rules · 41ms',
      },
      {
        chip: 'REFUTED' as const,
        title: 'The claim is false, and here is the input that breaks it.',
        body: 'Not a confidence score. A concrete counter-model: the exact assignment of values under which the claim fails, ready to become a test case.',
        readout: 'REFUTED · counter-model · category = club_membership',
      },
    ],
  },

  pipeline: {
    rule: { label: 'PIPELINE', value: '8 stages · ordered' },
    h2: 'Intake to rendered evidence.',
    body: 'Eight stages, genuinely ordered. The language model appears once, at stage two, and it is advisory there and nowhere else.',
    stages: [
      {
        name: 'Intake and claim cache',
        does: 'Normalises the question, resolves the governing rule set, and checks whether this exact claim has been proven before.',
        emits: 'claim_id · pack refs · cache verdict',
        worked: 'claim_id 4b1e9c · pack:gst-in-v2.2 · cache MISS',
      },
      {
        name: 'Formalizer (advisory model, gated)',
        does: 'Drafts a candidate specification in KVL from the requirement text. This is the only stage a language model touches, and its output is not authoritative.',
        emits: 'candidate spec · confidence · vocabulary gaps',
        worked: 'draft: eligible(itc, invoice) :- registered(supplier), used_in_business(good)',
      },
      {
        name: 'Confirmation gate',
        does: 'Renders the draft back in plain English and requires a human to approve or edit it before anything is proven.',
        emits: 'confirmed spec · approver identity',
        worked: 'confirmed_by a.rege · 2 edits · spec locked',
      },
      {
        name: 'Retrieval and closure',
        does: 'Pulls the clauses and facts the specification references, then closes over what those references pull in, so the slice is complete rather than convenient.',
        emits: 'fact set · clause set · closure proof',
        worked: 'closure: s.16, s.17(5), rule 42 · 412 rules in slice',
      },
      {
        name: 'Proof engine',
        does: 'Routes the claim to the solver whose shape it fits and runs it under a fixed budget.',
        emits: 'sat / unsat / unknown · certificate',
        worked: 'z3 4.13.0 · UNSAT in 41ms',
      },
      {
        name: 'Proof minimisation',
        does: 'Reduces the certificate to the minimal set of rules that were actually responsible for the result.',
        emits: 'unsat core',
        worked: 'core: R-0087, R-0141, R-0302, R-0398',
      },
      {
        name: 'Provenance resolution',
        does: 'Binds every rule in the core back to its source clause, version and effective date.',
        emits: 'clause citations · pack versions',
        worked: 'R-0141 → CGST s.17(5)(b) · effective 2023-10-01',
      },
      {
        name: 'Deterministic renderer',
        does: 'Renders the answer and the assurance object from the certificate. Same certificate in, same bytes out, on any machine.',
        emits: 'answer · assurance object · content hash',
        worked: 'render: canonical · sha-256 9f2c14a8…',
      },
    ] satisfies PipelineStage[],
  },

  confirmation: {
    rule: { label: 'CONTROL', value: 'human in the path' },
    h2: 'The model drafts the specification. A human confirms it. Only then does the solver run.',
    body: 'This is the step that makes AI-assisted formal methods credible rather than alarming. The draft is shown back in the engineer’s own vocabulary, not in logic notation, and nothing proceeds until someone with a name approves it. The approval is recorded in the assurance object.',
    claimLabel: 'CLAIM · AS WRITTEN',
    claim: 'Input tax credit is available on the office air-conditioning units purchased in March.',
    renderedLabel: 'SPECIFICATION · RENDERED BACK IN PLAIN ENGLISH',
    rendered:
      'Credit is available when the supplier is registered, the invoice is on record, the goods are used in the course of business, and the category is not one of the blocked categories in section 17(5).',
    actions: ['Approve this specification', 'Edit the specification'],
  },

  minimisation: {
    rule: { label: 'MINIMISATION', value: '412 → 4' },
    h2: '412 rules went in. Four came out.',
    body: 'The proof is not the whole rule base. It is the minimal set that was actually responsible, which is also, conveniently, the explanation. An auditor reads four rules, not four hundred.',
    readout: 'unsat core · R-0087 · R-0141 · R-0302 · R-0398',
  },

  worked: {
    rule: { label: 'WORKED EXAMPLE', value: '3 outcomes · 1 claim' },
    h2: 'One claim, all three outcomes.',
    body: 'The same question, asked three ways. Showing where a system stops is more convincing than three happy paths.',
    cases: [
      {
        chip: 'PROVEN' as const,
        eyebrow: 'CGST · s.16, s.17(5)',
        question: 'Is input tax credit available on the office air-conditioning units?',
        lines: [
          'registered(supplier)              ✓ GSTIN on record',
          'invoice_on_record(inv_88214)      ✓ matched in GSTR-2B',
          'used_in_business(goods)           ✓ declared use: office',
          'blocked_category(air_conditioner) ✗ not in s.17(5) list',
          'z3 4.13.0                         UNSAT in 41ms',
        ],
        result: 'PROVEN · unsat core: 4 of 412 rules · cited s.16(2), s.17(5)(d)',
      },
      {
        chip: 'REFUTED' as const,
        eyebrow: 'CGST · s.17(5)(b)',
        question: 'Is input tax credit available on the club membership renewed in March?',
        lines: [
          'registered(supplier)              ✓ GSTIN on record',
          'invoice_on_record(inv_88907)      ✓ matched in GSTR-2B',
          'blocked_category(club_membership) ✓ listed in s.17(5)(b)',
          'z3 4.13.0                         SAT in 12ms',
        ],
        result: 'REFUTED · counter-model: category = club_membership · cited s.17(5)(b)',
      },
      {
        chip: 'REFUSE' as const,
        eyebrow: 'CGST · vocabulary gap',
        question: 'Is input tax credit available on the works contract for the new warehouse?',
        lines: [
          'registered(supplier)              ✓ GSTIN on record',
          'works_contract(subject)           ? not defined in pack gst-in-v2.2',
          'closure                           incomplete',
          'z3 4.13.0                         not invoked',
        ],
        result: 'REFUSE · vocabulary gap · works_contract undefined · no verdict issued',
      },
    ],
  },

  solvers: {
    rule: { label: 'ROUTING', value: 'by claim shape' },
    h2: 'Solver selection is an optimisation problem, not your problem.',
    body: 'Claims are routed by shape, deterministically, and the routing is recorded. You do not pick a solver, and the same claim never lands on a different one.',
    rows: [
      { engine: 'z3', shape: 'SMT · arithmetic, arrays, quantifier-light slices' },
      { engine: 'cvc5', shape: 'SMT · strings and datatypes' },
      { engine: 'soufflé', shape: 'datalog · large fact closures' },
      { engine: 'lean', shape: 'proof terms · results that must be checked independently' },
    ],
    outputsLabel: 'OUTPUT FORMATS AUDITORS ALREADY ACCEPT',
    outputs: ['SVA', 'ACSL', 'TLA+'],
  },

  kvl: {
    rule: { label: 'IR', value: 'kvl' },
    h2: 'You never write KVL. That’s the point.',
    body: 'KVL is the intermediate representation every requirement compiles into, the way a compiler has an IR. It exists so that one specification can target four solvers and three certification output formats without being rewritten three times. Engineers read it during confirmation. Nobody authors it.',
  },

  applies: {
    rule: { label: 'DEPLOYMENT', value: 'where formus applies' },
    h2: 'Where Formus applies.',
    items: [
      { sector: 'Aerospace & defence', use: 'DO-178C and DO-333 credit, mode logic, FDIR' },
      { sector: 'Healthcare & life sciences', use: 'IEC 62304 class C timing and interlock logic' },
      { sector: 'Automotive', use: 'ISO 26262 arbitration and battery state safety' },
      { sector: 'Semiconductors', use: 'firmware root-of-trust, cross-die interoperability' },
      { sector: 'Financial services', use: 'regulated answers with a citable derivation' },
    ],
  },

  cta: {
    rule: { label: 'NEXT', value: 'technical' },
    eyebrow: 'SCOPING CALL · 45 MIN',
    heading: 'Send us a requirement your certification body rejected.',
    body: 'One requirement, in the words it was written in, plus the standard clause it has to satisfy. We will tell you whether Formus can carry it, and if it cannot, which part it cannot carry.',
    actions: [
      { label: 'Request access', href: '/demo/', kind: 'primary' as const },
      { label: 'Open a real Assurance Object', href: '/assurance-object/', kind: 'secondary' as const },
    ],
  },
} as const;
