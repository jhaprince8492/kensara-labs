import type { VerdictKind } from '@/components/primitives/VerdictChip';

/**
 * Formus page copy.
 *
 * Formus automates the step every other verification tool assumes has already
 * happened: getting a requirement written in English into a formal property.
 * It sits above the solvers and feeds them. Nothing on this page should read as
 * a claim to replace a formal environment a team already owns.
 *
 * No em dashes.
 */

export interface FidelityRow {
  id: string;
  requirement: string;
  status: Extract<VerdictKind, 'IMPLEMENTED' | 'VIOLATED' | 'UNPROVEN' | 'VACUOUS'>;
  /** Where it breaks. Empty when it holds. */
  location: string;
}

export interface ChainStep {
  actor: string;
  authority: string;
  action: string;
  output: string;
}

export const formus = {
  meta: {
    title: 'Formus',
    description:
      'Formus turns a requirement written in English into a formal property, checks your system against it deterministically, and emits signed evidence mapped to the clause.',
  },

  // ------------------------------------------------------------------- hero
  hero: {
    eyebrow: 'FORMUS · REQUIREMENT TO PROOF · SAFETY-CRITICAL',
    h1: [
      'Your tools prove the code does not crash.',
      'Formus proves it does what the requirement said.',
    ],
    sub: 'A requirement written in English becomes a formal property, your system is checked against it deterministically, and the evidence comes out signed and mapped to the clause your assessor is looking for.',
    readout: '38 requirements · 32 implemented · 3 violated · 2 unproven · 1 vacuous',
  },

  // -------------------------------------------------------------- the gap
  gap: {
    rule: { label: 'THE GAP', value: 'conformance' },
    h2: 'Crash-free is not correct.',
    body: [
      'Static analysers and formal tools answer one question well: does this code have a runtime error. No overflow, no null dereference, no division by zero, no state that faults. That is a real property and it is worth having.',
      'It is not the property your requirement was about. A pump that never crashes and arms both timers in the same cycle has passed every one of those checks. The distance between "does not fault" and "does what was specified" is where recalls live, and nothing in the standard toolchain closes it.',
    ],
    panels: [
      {
        label: 'WHAT THE TOOLS PROVE',
        title: 'Absence of runtime errors',
        items: [
          'no arithmetic overflow',
          'no null or out-of-bounds access',
          'no division by zero',
          'no reachable fault state',
        ],
        tone: 'muted' as const,
      },
      {
        label: 'WHAT NOBODY PROVES',
        title: 'Conformance to the requirement',
        items: [
          'the interlock actually holds, in every reachable state',
          'the timing bound is met, not merely tested',
          'the mode transition is recoverable three inputs deep',
          'the requirement was implemented at all',
        ],
        tone: 'proof' as const,
      },
    ],
  },

  // --------------------------------------------------------- the bottleneck
  bottleneck: {
    rule: { label: 'THE BOTTLENECK', value: 'authoring' },
    h2: 'Every verification tool starts after the property already exists.',
    body: [
      'Point any of them at your system and the first thing they need is a formal property. Somebody writes that by hand: a person fluent in temporal logic, reading a requirements document and translating it one line at a time, deciding as they go what the sentence actually meant.',
      'That step has never been automated. It is why formal verification stayed inside aerospace and silicon for fifty years, and it is not a solver problem. It is an authoring problem, and it is the layer Formus owns.',
    ],
    readout: 'requirement → property · still manual in every tool on the market',
  },

  // ----------------------------------------------------------- who decides
  authority: {
    rule: { label: 'AUTHORITY', value: 'who decides what' },
    h2: 'The model proposes. A deterministic checker and a named human decide.',
    body: 'That division is the whole certifiability argument, so it is worth being exact about it. Three actors touch a property, and only two of them have any authority.',
    steps: [
      {
        actor: 'Advisory model',
        authority: 'none',
        action: 'Reads the requirement and proposes a formal property.',
        output: 'a proposal, discarded if the human rejects it',
      },
      {
        actor: 'Named engineer',
        authority: 'decides what the requirement meant',
        action: 'Reads the proposal rendered in plain English and approves or edits it.',
        output: 'a confirmed property, and their name on it',
      },
      {
        actor: 'Deterministic checker',
        authority: 'decides whether the system satisfies it',
        action: 'Checks the system against the compiled logic. Same inputs, same verdict, every time.',
        output: 'the verdict, and the state that breaks it',
      },
    ] satisfies ChainStep[],
    closing:
      'The authoritative path contains no language model. Verdicts come from a checker, not from a generation, and the engineer who confirmed the property is recorded in the object alongside it.',
  },

  // -------------------------------------------------------- fidelity report
  fidelity: {
    rule: { label: 'FIDELITY', value: 'was the proof worth having' },
    h2: 'A proof that passes can still be worthless. We tell you which ones.',
    body: [
      'Every other tool in this market reports pass or fail. None of them report whether the property you proved was strong enough to be worth proving. A property whose antecedent is never true in the reachable space passes instantly and constrains nothing, and it will sit in your evidence pack looking exactly like a real result.',
      'Formus mutates the design and re-checks to see how much the property actually catches, and tests each property for vacuity. The output is a requirement-by-requirement statement of what is implemented, what is not, and exactly where it breaks.',
    ],
    summaryLabel: 'FIDELITY REPORT · SRS v4.2 · 38 REQUIREMENTS',
    summary: [
      { status: 'IMPLEMENTED' as const, count: 32, note: 'holds in every reachable state' },
      { status: 'VIOLATED' as const, count: 3, note: 'counter-example located' },
      { status: 'UNPROVEN' as const, count: 2, note: 'budget or vocabulary, reason stated' },
      { status: 'VACUOUS' as const, count: 1, note: 'passed without constraining anything' },
    ],
    score: 'mutation kill 47 of 52 · vacuity 1 flagged · coverage 38 of 38 requirements attempted',
    rowsLabel: 'PER REQUIREMENT',
    rows: [
      {
        id: 'REQ-PMP-0114',
        requirement: 'The pump shall not arm both infusion timers within the same control cycle.',
        status: 'IMPLEMENTED' as const,
        location: '',
      },
      {
        id: 'REQ-PMP-0119',
        requirement: 'A bolus request during occlusion shall be rejected before the valve opens.',
        status: 'VIOLATED' as const,
        location: 'pump_ctl.c:214 · cycle 3 · valve opens before occlusion flag is read',
      },
      {
        id: 'REQ-PMP-0122',
        requirement: 'On battery fault the pump shall enter safe hold within 200ms.',
        status: 'VACUOUS' as const,
        location: 'antecedent never true in the reachable space · property needs rewriting',
      },
      {
        id: 'REQ-PMP-0130',
        requirement: 'Cumulative delivered volume shall never exceed the prescribed limit.',
        status: 'UNPROVEN' as const,
        location: 'budget 120s exceeded at depth 14 · no verdict issued',
      },
    ] satisfies FidelityRow[],
    footnote:
      'Two of those four are things no other tool on your bench would have told you. The vacuous one would have shipped as a pass.',
  },

  // -------------------------------------------------------- worked example
  worked: {
    rule: { label: 'WORKED EXAMPLE', value: 'one requirement · end to end' },
    h2: 'One requirement, all the way through.',
    body: 'A Class C infusion pump, the requirement as it was written in the specification document, and every artifact the chain produced from it.',
    steps: [
      {
        label: 'REQUIREMENT · AS WRITTEN',
        actor: 'SRS v4.2 §5.5.1',
        content: 'The pump shall not arm both infusion timers within the same control cycle.',
        mono: false,
      },
      {
        label: 'PROPOSAL · ADVISORY MODEL',
        actor: 'not authoritative',
        content: 'G !(arm(t1) & arm(t2))',
        mono: true,
      },
      {
        label: 'CONFIRMATION · RENDERED BACK IN PLAIN ENGLISH',
        actor: 'a.rege',
        content:
          'At no point in the run are both timers armed at the same time. Approved after two edits: "control cycle" was bound to the scheduler tick, not to the ISR.',
        mono: false,
      },
      {
        label: 'COMPILED LOGIC · KVL',
        actor: 'kvl/1.4',
        content: 'always !(arm[t1] && arm[t2]) @ tick',
        mono: true,
      },
      {
        label: 'ASSUMPTIONS · INFERRED AND VALIDATED',
        actor: 'environment',
        content: 'tick monotonic · ISR cannot preempt tick · 14 inferred · 14 validated',
        mono: true,
      },
      {
        label: 'CHECK · DETERMINISTIC',
        actor: 'no model on this path',
        content: 'PROVEN · exhaustive over the reachable space · 41ms · core 4 of 412',
        mono: true,
      },
      {
        label: 'FIDELITY',
        actor: 'was it worth proving',
        content: 'mutation kill 12 of 12 · not vacuous · property constrains the design',
        mono: true,
      },
      {
        label: 'EVIDENCE · SIGNED AND BOUND',
        actor: 'IEC 62304 5.5',
        content: 'assurance object · sha-256 9f2c14a8… · replay ✓',
        mono: true,
      },
    ],
    variants: [
      {
        chip: 'VIOLATED' as const,
        eyebrow: 'SAME PUMP · REQ-PMP-0119',
        question:
          'A bolus request arriving during an occlusion shall be rejected before the valve opens.',
        lines: [
          'property      G (occlusion -> !valve_open U bolus_rejected)',
          'confirmed_by  a.rege · 0 edits',
          'check         VIOLATED in 96ms',
          'counter-example  cycle 3 · occlusion set at t=2, valve opens at t=3',
          'location      pump_ctl.c:214 · flag read after the actuation call',
          'fidelity      mutation kill 9 of 11 · not vacuous',
        ],
        result: 'VIOLATED · the state that reaches it, and the line that causes it',
      },
      {
        chip: 'UNPROVEN' as const,
        eyebrow: 'SAME PUMP · REQ-PMP-0130',
        question: 'Cumulative delivered volume shall never exceed the prescribed limit.',
        lines: [
          'property      G (delivered <= prescribed)',
          'confirmed_by  a.rege · 1 edit',
          'check         budget 120s exceeded at depth 14',
          'reason        unbounded accumulator · needs an inductive invariant',
          'verdict       none issued',
          'next          the invariant is a two-line addition, and we will say so',
        ],
        result: 'UNPROVEN · stated reason, no verdict, nothing filed as evidence',
      },
    ],
  },

  // ---------------------------------------------------------- the evidence
  evidence: {
    rule: { label: 'EVIDENCE', value: 'mapped to the clause' },
    h2: 'The evidence pack stops being a nine-month project.',
    body: [
      'Certification evidence today is assembled by hand, usually by contractors, in documents and spreadsheets, after the engineering is finished. It takes months, it costs more than the verification did, and the artifact it produces is a description of work rather than the work itself.',
      'Formus emits the evidence as the check runs. Each object binds the requirement, the confirmed property, the verdict and its certificate, and the exact clause it is being submitted against. Your assessor verifies it locally. There is nothing of ours to trust and no service to call.',
    ],
    clauses: [
      { standard: 'IEC 62304', clause: '5.5', satisfies: 'software unit verification' },
      { standard: 'IEC 62304', clause: '5.7.3', satisfies: 'software system testing evidence' },
      { standard: 'DO-178C', clause: 'Table A-4', satisfies: 'verification of low-level requirements' },
      { standard: 'DO-333', clause: 'FM.6.3.1', satisfies: 'formal analysis in place of review' },
      { standard: 'ISO 26262', clause: '6-9', satisfies: 'verification of software unit design' },
      { standard: 'ISO 14971', clause: '7.1', satisfies: 'risk control verification' },
    ],
  },

  // ------------------------------------------------------- continuous proof
  continuous: {
    rule: { label: 'CONTINUOUS PROOF', value: 'during development' },
    h2: 'A proof is not a milestone. It is a thing that decays.',
    body: [
      'Formal verification is usually run once, near submission. The first meaningful code change after that breaks the proofs, re-establishing them costs more each time, and teams that adopted it as an event tend to stop somewhere around month six.',
      'Formus repairs proofs on every change, during development, not at freeze. A commit arrives, the affected properties are re-derived against the recorded intent, and the ones that genuinely need a human are the only ones that reach one.',
    ],
    readout:
      'commit 8c14ef2a · 34 properties re-derived · 2 require confirmation · 41s',
    note: 'Adopt it before submission, not after the code freeze. A proof that arrives at the end is a document. A proof that survives every commit is a control.',
  },

  // -------------------------------------------------------------- domains
  domains: {
    rule: { label: 'WHERE FORMUS RUNS', value: '3 domains' },
    h2: 'Where Formus runs.',
    items: [
      {
        name: 'Safety-critical software',
        eyebrow: 'MEDICAL · AVIONICS · AUTOMOTIVE · RAIL',
        body: 'The requirement-to-property step here is entirely manual today, and the evidence pack behind it is assembled by hand. Both are what Formus produces. Interlocks, timing bounds, mode logic and state machines are exactly the shape of property a deterministic checker closes well.',
        standards: ['IEC 62304', 'ISO 13485', 'DO-178C', 'DO-333', 'ISO 26262', 'EN 50128'],
        readout: 'PROVEN · REQ-PMP-0114 · bound to IEC 62304 5.5',
      },
      {
        name: 'Sovereign defence and space',
        eyebrow: 'CEMILAC · DRDO · DDPMAS-2002',
        body: 'The verification pain is the same, and the procurement position is not. Foreign verification tooling carries export-control and trust friction that makes it awkward or impossible to place inside a programme. Formus is a domestic option that is allowed in the building, with the same evidence output.',
        standards: ['DDPMAS-2002', 'DO-178C', 'DO-333'],
        readout: 'on-premises · air-gapped · no outbound path',
      },
      {
        name: 'Semiconductor and hardware',
        eyebrow: 'RTL · FIRMWARE · ROOT OF TRUST',
        body: 'This is not a market we are entering. It is a flow we sit above. Assertion authoring is still manual inside every hardware verification environment on the bench, so Formus takes the requirement and emits the assertion into the environment you already run.',
        standards: ['SVA', 'firmware root-of-trust', 'cross-die interoperability'],
        readout: 'emitted: 214 assertions · into your existing flow',
      },
    ],
  },

  // ------------------------------------------------------- any solver + kvl
  compatibility: {
    rule: { label: 'COMPATIBILITY', value: 'emits, does not compete' },
    h2: 'Formus emits. It does not compete for your solver budget.',
    body: 'The property that comes out of the confirmation gate compiles to whatever your flow already consumes. If you have a formal environment, Formus feeds it. If you do not, the deterministic checker runs the check itself. Either way the evidence object is identical, because the object is rendered from the certificate and not from the tool.',
    solversLabel: 'CHECKING ENGINES',
    solvers: ['z3', 'cvc5', 'lean', 'nuXmv', 'SPIN', 'soufflé'],
    formatsLabel: 'EMITTED FORMATS',
    formats: ['SVA', 'ACSL', 'TLA+', 'C assertions', 'native'],
    note: 'And the formal environment you already own. Routing is a pure function of the property shape, it is recorded in the object, and the same property never lands on a different engine.',
    kvl: {
      h3: 'You never write KVL. That is the point.',
      body: 'KVL is the intermediate representation every requirement compiles into, the way a compiler has an IR. It exists so that one confirmed property can target several engines and several certification output formats without being written several times. Engineers read it during confirmation. Nobody authors it.',
    },
  },

  // ------------------------------------------------------------------- cta
  cta: {
    rule: { label: 'NEXT', value: 'technical' },
    eyebrow: 'SCOPING CALL · 45 MIN',
    heading: 'Send us a requirement your certification body sent back.',
    body: 'One requirement, in the words it was written in, plus the clause it has to satisfy. We will tell you whether it is provable as written, and if it is not, which part of it is underspecified. That answer is useful to you whether or not you buy anything.',
    actions: [
      { label: 'Request access', href: '/demo/', kind: 'primary' as const },
      { label: 'Open a real Assurance Object', href: '/assurance-object/', kind: 'secondary' as const },
    ],
  },
} as const;
