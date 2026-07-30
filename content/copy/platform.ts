export const platform = {
  meta: {
    title: 'Platform',
    description:
      'The determinism contract, the Assurance Object, replay, and the architecture both engines share.',
  },

  hero: {
    eyebrow: 'PLATFORM · SHARED SUBSTRATE',
    h1: ['One system.', 'Two engines. One artifact.'],
    sub: 'Formus and Sentinel answer different questions, and they answer them on the same substrate: the same determinism contract, the same artifact, the same ledger. This page is what they share.',
  },

  determinism: {
    rule: { label: 'DETERMINISM CONTRACT', value: '6 invariants' },
    h2: 'Six invariants, held on every authoritative path.',
    invariants: [
      { name: 'no ambient clock', detail: 'now is injected, never read' },
      { name: 'no randomness', detail: 'seeded or absent' },
      { name: 'canonical serialization', detail: 'sorted keys · NFC · exact integer money' },
      { name: 'pinned versions', detail: 'every artifact addressed by content hash' },
      { name: 'LLMs quarantined', detail: 'off the authoritative path, always' },
      { name: 'total ordering', detail: 'ties broken by fixed rule, never by arrival' },
    ],
    footnote:
      'These hold on every authoritative path in both engines. If any one of them fails, replay fails, and you’d know.',
    cost: {
      h3: 'What each one costs us.',
      body: 'None of these are free. An injected clock means every caller has to supply one. Canonical serialization means money is an integer everywhere, including in the places where a float would have been convenient. Pinned versions mean a solver upgrade is a migration, not an install. We pay all of it because replay is the only property that still matters after an incident.',
    },
  },

  artifact: {
    rule: { label: 'ARTIFACT', value: 'shared output' },
    h2: 'Both engines emit the same object.',
    body: 'A proof and a gate decision are different events, and they leave the same kind of record: what was asked, what it compiled to, what was decided, and which clause that satisfies. One format means one integration for your evidence pipeline rather than two.',
    anatomy: [
      { part: 'requirement', from: 'the engineer’s words, verbatim, with its source' },
      { part: 'specification', from: 'what it compiled to, and who confirmed it' },
      { part: 'verdict + certificate', from: 'the result, the solver, and the minimal core' },
      { part: 'regulatory binding', from: 'the standard and clause it is submitted against' },
      { part: 'signature', from: 'the content hash over the canonical bytes' },
    ],
  },

  replay: {
    rule: { label: 'REPLAY', value: 'two machines · one result' },
    h2: 'Same input. Byte-identical output.',
    body: 'Two independent derivations of the same object, run side by side in your browser. They share no state: each canonicalises from scratch and digests its own bytes. If the determinism contract were not being held, these two columns would disagree, and the panel would say so rather than quietly showing a tick.',
    machineA: 'MACHINE A',
    machineB: 'MACHINE B',
    run: 'Replay on both machines',
    running: 'Deriving…',
  },

  architecture: {
    rule: { label: 'ARCHITECTURE', value: 'what crosses the boundary' },
    h2: 'Where things run, and what never leaves.',
    body: 'The authoritative path is small on purpose. The parts that are allowed to be clever sit outside it.',
    rows: [
      {
        component: 'Interceptor and policy engine',
        runs: 'your perimeter',
        crosses: 'nothing',
        note: 'evaluates locally; the decision is made where the action is',
      },
      {
        component: 'Credential vault',
        runs: 'your perimeter',
        crosses: 'nothing',
        note: 'the keys never reach the agent runtime or us',
      },
      {
        component: 'Proof engine and solvers',
        runs: 'your perimeter or our VPC tier',
        crosses: 'the specification and the rule slice',
        note: 'no source, no customer records',
      },
      {
        component: 'Formalizer (advisory model)',
        runs: 'outside the trusted boundary',
        crosses: 'the requirement text you send it',
        note: 'drafts only; its output is confirmed by a human before use',
      },
      {
        component: 'Audit ledger',
        runs: 'your perimeter',
        crosses: 'nothing',
        note: 'hash-chained locally; verification needs no call to us',
      },
    ],
  },

  corpus: {
    rule: { label: 'CORPUS', value: 'intent → correction' },
    h2: 'Every correction is recorded as a correction.',
    body: 'When an engineer edits a drafted specification at the confirmation gate, the edit is logged as a structured record: the intent, the specification we proposed, the correction that was made, and the result it produced. That corpus improves the translator for the vertical it came from. It is also, deliberately, yours: the records are exportable, and nothing in the assurance objects you have already been issued depends on it.',
  },

  cta: {
    rule: { label: 'NEXT', value: 'technical' },
    eyebrow: 'SCOPING CALL · 45 MIN',
    heading: 'Ask us which invariant is hardest to hold.',
    body: 'It is total ordering. Racing two solvers gives you the same verdict and two different certificates, and the certificate is the thing an auditor reads. We wrote up how we resolved it.',
    actions: [
      { label: 'Request access', href: '/demo/', kind: 'primary' as const },
      {
        label: 'Read: race the verdict, standardise the certificate',
        href: '/journal/race-the-verdict-standardise-the-certificate/',
        kind: 'secondary' as const,
      },
    ],
  },
} as const;
