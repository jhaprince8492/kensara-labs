export const assuranceObjectPage = {
  meta: {
    title: 'The Assurance Object',
    description:
      'A signed, self-contained record binding a requirement, its formal specification, the verdict that resulted, and the regulatory clause it satisfies.',
  },

  hero: {
    eyebrow: 'ARTIFACT · IEC 62304 · CLASS C',
    h1: ['Open it.', 'Verify it without trusting us.'],
    sub: 'One object binds four things that normally live in four different systems. It replays byte-identically on any machine, and the check runs in your browser, not on ours.',
  },

  binds: {
    rule: { label: 'ANATOMY', value: '4 bindings' },
    h2: 'What it binds, and why those four.',
    body: 'Each of these already exists somewhere in your organisation. The problem was never that they were missing. It was that nothing tied them together in a form an auditor could check on their own.',
    items: [
      {
        name: 'The requirement, in the engineer’s words',
        detail:
          'Verbatim, with its source document and section. Not a paraphrase, because the paraphrase is where the ambiguity enters.',
      },
      {
        name: 'The specification it compiled to',
        detail:
          'The formal statement a solver accepted, plus who confirmed it. The model that drafted it is recorded as advisory and is not part of the authoritative path.',
      },
      {
        name: 'The verdict and its certificate',
        detail:
          'The result, the solver and version, the elapsed time, and the minimal set of rules actually responsible for it.',
      },
      {
        name: 'The regulatory clause it satisfies',
        detail:
          'The standard and clause the evidence is being submitted against, so the object arrives already mapped to the thing the assessor is looking for.',
      },
    ],
  },

  tools: {
    rule: { label: 'CHECKS', value: 'in your browser' },
    h2: 'Both checks run client-side.',
    body: 'Nothing here calls our servers. The digest is recomputed from the bytes on this page, and the replay re-derives the object from the same inputs and compares the two results.',
  },

  payload: {
    rule: { label: 'PAYLOAD', value: 'canonical json' },
    h2: 'The object itself.',
    body: 'Sorted keys, no insignificant whitespace, money as exact integers, versions pinned by content hash. The determinism block at the top is not documentation: those are the invariants the emitting engine held while producing this object, and replay fails if any one of them did not.',
  },

  clauses: {
    rule: { label: 'CLAUSE MAPPING', value: '5 standards' },
    h2: 'Which field satisfies which evidence requirement.',
    body: 'The mapping is the reason an assessor can accept the object as evidence rather than as a report about evidence.',
    rows: [
      {
        standard: 'DO-178C',
        clause: '6.3.1',
        requirement: 'Reviews and analyses of high-level requirements',
        field: 'requirement · specification.confirmed_by',
      },
      {
        standard: 'DO-333',
        clause: 'FM.6.3.1',
        requirement: 'Formal analysis in place of review, with a stated method',
        field: 'verdict.solver · verdict.unsat_core',
      },
      {
        standard: 'IEC 62304',
        clause: '5.5',
        requirement: 'Software unit verification',
        field: 'verdict.result · verdict.unsat_core',
      },
      {
        standard: 'ISO 26262',
        clause: '6-9',
        requirement: 'Verification of software unit design and implementation',
        field: 'specification.formula · verdict',
      },
      {
        standard: 'DPDP',
        clause: '§8(5)',
        requirement: 'Reasonable security safeguards, demonstrable',
        field: 'ledger · signature.content_hash',
      },
    ],
  },

  cta: {
    rule: { label: 'NEXT', value: 'technical' },
    eyebrow: 'SCOPING CALL · 45 MIN',
    heading: 'Bring this object to your next assessment and see what they ask for.',
    body: 'If your assessor needs a field this object does not carry, tell us which one. That is the most useful thing anyone can send us.',
    actions: [
      { label: 'Request access', href: '/demo/', kind: 'primary' as const },
      { label: 'Explore Formus', href: '/formus/', kind: 'secondary' as const },
    ],
  },
} as const;
