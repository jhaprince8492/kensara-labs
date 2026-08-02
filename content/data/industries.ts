import type { VerdictKind } from '@/components/primitives/VerdictChip';

/**
 * Six sectors, one rigid template. Consistency here is worth more than
 * creativity: a buyer comparing two of these pages should find the same thing
 * in the same place.
 *
 * No competitor is named anywhere in this file. Where a category of tool needs
 * naming it is named as a category, because "we are better than X" is an
 * argument you can lose and "X starts after the assertion exists" is one you
 * cannot.
 *
 * No em dashes.
 */

export interface Workflow {
  name: string;
  engine: 'Formus' | 'Sentinel';
  detail: string;
  artifact: string;
}

/** Why the tools already on the bench do not close this gap. */
export interface BlindspotRow {
  approach: string;
  proves: string;
  misses: string;
}

export interface SectorPage {
  /** The specific failure mode. One sentence, no imagery. */
  failure: string;
  /** The pain as buyers state it. Not attributed to an invented person. */
  quote: { text: string; source: string };
  blindspot: { intro: string; rows: BlindspotRow[] };
  engines: { engine: 'Formus' | 'Sentinel'; lead: string; body: string }[];
  /** Optional, used where market position is itself the argument. */
  position?: { label: string; heading: string; body: string };
  regulation: {
    intro: string;
    clauses: { standard: string; clause: string; requires: string }[];
  };
  workflows: Workflow[];
  example: {
    eyebrow: string;
    question: string;
    lines: string[];
    result: string;
    chip: VerdictKind;
  };
  /** The artifact you leave the engagement holding. */
  walkaway: { label: string; detail: string };
  boundary: { intro: string; items: string[] };
  cta: { heading: string; body: string };
}

export interface Sector {
  slug: string;
  name: string;
  standards: string;
  summary: string;
  page?: SectorPage;
}

/** One sentence above the grid, so six pages read as one product. */
export const throughLine =
  'Every one of these fails the same way: a state nobody tested, a combination nobody enumerated, or evidence that was true a moment ago. Formus proves the system correct before it ships. Sentinel proves each action correct before it runs.';

export const sectors: Sector[] = [
  // ------------------------------------------------------------- healthcare
  {
    slug: 'healthcare-lifesciences',
    name: 'Healthcare & life sciences',
    standards: 'IEC 62304 / ISO 13485',
    summary:
      'Timing and interlock logic that passes every test in the suite and fails on a state the suite never reached.',
    page: {
      failure:
        'A closed-loop pump passes the full verification suite and deadlocks on a state three transitions deep that no test case ever constructed.',
      quote: {
        text: 'We pass every test in our suite and still ship a timer or interlock bug, because the failing state is one the suite never reached. And assembling the IEC 62304 evidence takes three contractors nine months. Then someone changes the dosing logic six weeks before submission and the traceability matrix is quietly fiction.',
        source: 'what we hear in scoping calls with Class C device teams',
      },
      blindspot: {
        intro:
          'Nothing on a device team’s bench is doing a bad job. They are answering different questions, and the question your recall came from is not among them.',
        rows: [
          {
            approach: 'Test suites',
            proves: 'the execution paths you enumerated behave correctly',
            misses: 'the state you did not enumerate, which is where the interlock bug lives',
          },
          {
            approach: 'Static analysers',
            proves: 'the code will not crash: no overflow, no null dereference, no fault state',
            misses: 'whether the code does what the requirement actually meant',
          },
          {
            approach: 'Traceability matrices',
            proves: 'a requirement has a test against its name',
            misses: 'that the test constrains anything, and that it survived the last logic change',
          },
          {
            approach: 'Nothing on the bench',
            proves: 'no tool answers this today',
            misses: 'whether the property you verified was meaningful in the first place',
          },
        ],
      },
      engines: [
        {
          engine: 'Formus',
          lead: 'Proved across every reachable state, not sampled.',
          body: 'Each clinical and safety requirement becomes a formal property and is checked across the full reachable state space rather than a set of paths. Where a property fails you get the exact sequence that reaches the failure, not a coverage percentage. The evidence is emitted as it is produced, signed and bound to the clause. When the dosing logic changes, Formus names precisely which properties are now unproven, so the traceability matrix stops being a document somebody maintains by hand.',
        },
        {
          engine: 'Sentinel',
          lead: 'Patient data stays inside its declared scope.',
          body: 'For AI-assisted clinical workflows and patient-data agents, every retrieval, summarisation and export crosses the gate. No action can move regulated data outside its declared scope without an explicit, recorded override, and the policy is enforced at the moment of execution rather than reviewed after the fact.',
        },
      ],
      regulation: {
        intro:
          'Class C software has to show verification, not describe it. The assessor is looking for evidence tied to a specific requirement, produced by a stated method.',
        clauses: [
          {
            standard: 'IEC 62304',
            clause: '5.5',
            requires: 'software unit verification against the unit requirements',
          },
          {
            standard: 'IEC 62304',
            clause: '5.7.3',
            requires: 'software system testing evidence, with recorded results',
          },
          {
            standard: 'ISO 14971',
            clause: '7.1',
            requires: 'verification that each risk control is implemented and effective',
          },
          {
            standard: 'ISO 13485',
            clause: '7.3.6',
            requires: 'design verification records retained in the design history file',
          },
        ],
      },
      workflows: [
        {
          name: 'Interlock and timing logic in closed-loop devices',
          engine: 'Formus',
          detail:
            'Mutual exclusion, timing bounds and mode transitions are proven exhaustively over the state space rather than sampled by test. A violated property returns the concrete state that breaks it, which becomes a test case you did not have.',
          artifact: 'assurance object with the unsat core, bound to IEC 62304 5.5',
        },
        {
          name: 'Risk control verification for the design history file',
          engine: 'Formus',
          detail:
            'Each risk control from the ISO 14971 analysis is stated as a property and proven against the design, so the file carries derivations rather than assertions that the control was implemented.',
          artifact: 'assurance object per control, bound to ISO 14971 7.1',
        },
        {
          name: 'Agents touching patient data',
          engine: 'Sentinel',
          detail:
            'Retrieval, summarisation and export actions are gated on the declared scope of the record and the purpose on file. Actions that would widen the scope are held, not silently redacted.',
          artifact: 'decision record naming the scope, the purpose and the obligation applied',
        },
      ],
      example: {
        eyebrow: 'INFUSION PUMP · IEC 62304 CLASS C',
        question: 'Can both infusion timers be armed within the same control cycle?',
        lines: [
          'requirement   REQ-PMP-0114 · SRS v4.2 §5.5.1',
          'property      G !(arm(t1) & arm(t2))',
          'confirmed_by  a.rege · human confirmation · 2 edits',
          'check         exhaustive over the reachable space · 41ms',
          'fidelity      mutation kill 12 of 12 · not vacuous',
          'evidence      bound to IEC 62304 5.5 · replay ✓',
        ],
        result: 'IMPLEMENTED · proven in every reachable state',
        chip: 'PROVEN',
      },
      walkaway: {
        label: 'WHAT YOU LEAVE HOLDING',
        detail:
          'A signed verification record per requirement, already mapped to IEC 62304 5.5, with the fidelity report that says which properties actually constrained the design and which ones would have shipped as an empty pass.',
      },
      boundary: {
        intro: 'What we do not do here.',
        items: [
          'We do not certify your device, and we are not a notified body. We produce evidence an assessor evaluates.',
          'We do not prove properties of the compiled binary or the hardware. We work at the level of the design and the requirements, and the toolchain qualification argument is still yours to make.',
          'We do not replace your static analysis. It answers a different question, it answers it well, and you should keep it.',
          'We do not write your requirements. If a requirement is ambiguous, the confirmation gate surfaces the ambiguity and stops, which is correct behaviour and is also more work for you.',
          'We do not replace clinical evaluation or usability engineering.',
        ],
      },
      cta: {
        heading: 'Send us a requirement your notified body sent back.',
        body: 'Preferably one about timing or an interlock, in the words it was written in, with the clause it has to satisfy. We will tell you whether it is provable as written, and if it is not, which part is underspecified.',
      },
    },
  },

  // -------------------------------------------------------- aerospace
  {
    slug: 'aerospace-defence',
    name: 'Aerospace & defence',
    standards: 'DO-178C / DO-333',
    summary:
      'Mode transitions that are valid, and valid, and valid, and then unrecoverable, three inputs deep.',
    page: {
      failure:
        'Mode transitions that are valid, and valid, and valid, and then unrecoverable, three inputs deep.',
      quote: {
        text: 'Getting DO-178C credit for the mode logic by formal proof means twenty to thirty person-years of manual work. So we simulate instead, we sample the transition graph, and we sign off knowing the sequence that breaks it is one we never generated.',
        source: 'what we hear from certification leads on airborne programmes',
      },
      blindspot: {
        intro:
          'The transition that kills you is not an invalid one. Every step in the sequence is individually legal, which is exactly why sampling never finds it and why review cannot rule it out.',
        rows: [
          {
            approach: 'Simulation',
            proves: 'the transition sequences you generated are safe',
            misses:
              'a three-deep sequence of individually valid transitions, unlikely to be sampled and certain to occur eventually in the field',
          },
          {
            approach: 'Review and analysis',
            proves: 'a competent human read the design and found nothing',
            misses: 'exhaustiveness, which is the only thing that actually closes this objective',
          },
          {
            approach: 'Manual formal proof',
            proves: 'the property, correctly, with full certification credit',
            misses: 'nothing, and it costs 20 to 30 person-years, so it is scoped out',
          },
        ],
      },
      engines: [
        {
          engine: 'Formus',
          lead: 'Every sequence, or the exact one that breaks it.',
          body: 'Formus proves exhaustively that the flight-mode logic cannot reach an unrecoverable state through any sequence of transitions. If it can, you get the input sequence that gets there, in order, as a concrete trace. The output is structured for DO-178C objectives and for DO-333 formal methods credit, so the artifact goes into the certification package rather than into a report about the certification package.',
        },
      ],
      position: {
        label: 'SOVEREIGN ACCESS',
        heading: 'Allowed in the building.',
        body: 'For CEMILAC, DRDO and DDPMAS-2002 work, foreign verification tooling carries export-control and trust friction that makes it awkward or impossible to place inside a programme. Formus is a domestic option: deployable on-premises, air-gapped, with no outbound network path, and policy packs and toolchain versions arriving as signed bundles that are content-hash verified before they load. That is not a claim about capability. It is a claim about access.',
      },
      regulation: {
        intro:
          'DO-333 exists precisely so that formal analysis can substitute for review and test against specific objectives. The difficulty has never been whether it is allowed. It is what it costs to produce.',
        clauses: [
          {
            standard: 'DO-178C',
            clause: 'Table A-4',
            requires: 'verification of the low-level requirements and software architecture',
          },
          {
            standard: 'DO-178C',
            clause: 'Table A-7',
            requires: 'verification of the verification process results',
          },
          {
            standard: 'DO-333',
            clause: 'FM.6.3.1',
            requires: 'formal analysis in place of review, with the method stated and justified',
          },
          {
            standard: 'DDPMAS',
            clause: '2002',
            requires: 'design and airworthiness evidence for Indian military programmes',
          },
        ],
      },
      workflows: [
        {
          name: 'Flight mode and reconfiguration logic',
          engine: 'Formus',
          detail:
            'The mode graph is proven to have no reachable unrecoverable state under any sequence of individually valid transitions. Where one exists, the trace is the deliverable.',
          artifact: 'assurance object with the trace, bound to DO-333 FM.6.3.1',
        },
        {
          name: 'Fault detection, isolation and recovery',
          engine: 'Formus',
          detail:
            'FDIR properties are proven against the fault model rather than exercised against a fault injection campaign, so coverage is a property of the proof and not of the campaign.',
          artifact: 'assurance object per FDIR requirement, bound to DO-178C Table A-4',
        },
        {
          name: 'Requirement to property, for the whole package',
          engine: 'Formus',
          detail:
            'Low-level requirements are translated to formal properties with a named engineer confirming each one, which is the step that turns a twenty person-year exercise into a reviewable one.',
          artifact: 'confirmed property set with approver identity and edit history',
        },
      ],
      example: {
        eyebrow: 'FLIGHT MODE LOGIC · DO-333',
        question:
          'Can the aircraft reach a mode from which no recovery transition exists, through any sequence of valid transitions?',
        lines: [
          'requirement   REQ-FCS-0207 · mode logic, recoverability',
          'property      AG (EF mode_nominal)',
          'confirmed_by  s.iyer · 1 edit · "recovery" bound to pilot-commandable modes',
          'check         VIOLATED · depth 3',
          'trace         NAV → DEGRADED(sensor_a) → DEGRADED(sensor_b) → LOCKOUT',
          'recovery      no outgoing transition from LOCKOUT to any nominal mode',
        ],
        result: 'VIOLATED · three individually valid transitions, no way back',
        chip: 'VIOLATED',
      },
      walkaway: {
        label: 'WHAT YOU LEAVE HOLDING',
        detail:
          'DO-333 formal methods evidence for airborne software, bound to the objective it satisfies, with the confirmed property, the approver, the checker version and a trace where one exists.',
      },
      boundary: {
        intro: 'What we do not do here.',
        items: [
          'We are not a certification authority and we do not grant credit. The applicant makes the argument; we produce the evidence it rests on.',
          'We do not qualify the toolchain for you. DO-330 tool qualification is a separate exercise and we will tell you honestly where our output sits in it.',
          'We do not verify the object code or the hardware. We work at the level of the requirements and the design.',
          'We do not do the systems safety assessment. ARP4761 is upstream of us.',
        ],
      },
      cta: {
        heading: 'Bring us the mode logic you signed off on simulation alone.',
        body: 'One state machine and the recoverability requirement it has to satisfy. We will tell you whether an unrecoverable state is reachable, and if it is, we will hand you the sequence.',
      },
    },
  },

  // --------------------------------------------------------- automotive
  {
    slug: 'automotive-mobility',
    name: 'Automotive & mobility',
    standards: 'ISO 26262',
    summary:
      'ADAS arbitration and battery management logic where the failing case is a combination nobody enumerated.',
    page: {
      failure:
        'ADAS arbitration and battery management logic where the failing case is a combination nobody enumerated.',
      quote: {
        text: 'Coverage tells us what we tested. It does not tell us anything about the combination we never thought of, and arbitration bugs live exactly there: two subsystems that both believe they hold priority, in a state nobody wrote a test for.',
        source: 'what we hear from functional safety leads on ASIL D programmes',
      },
      blindspot: {
        intro:
          'ASIL D asks for evidence that the safety logic holds under all input combinations. Every measurement on the bench reports on the combinations you reached.',
        rows: [
          {
            approach: 'Coverage metrics',
            proves: 'what you did test, precisely',
            misses: 'the combinatorial space you did not, which is where arbitration failures sit',
          },
          {
            approach: 'Runtime error analysis',
            proves: 'no crash, no overflow, no undefined behaviour',
            misses:
              'two subsystems both holding priority, which is a perfectly well-formed program doing exactly what it was written to do',
          },
          {
            approach: 'Hardware-in-the-loop and fleet data',
            proves: 'behaviour under the conditions you actually drove',
            misses: 'the corner that needs four independent inputs to align',
          },
        ],
      },
      engines: [
        {
          engine: 'Formus',
          lead: 'The full combinatorial space, not a sampled subset.',
          body: 'Formus proves that the arbitration and battery-management state logic has no reachable state that violates the safety property, across every combination of inputs rather than the ones a campaign produced. Where a violating state exists you get the combination that reaches it. Evidence is emitted clause-mapped so it drops into the safety case instead of being transcribed into it.',
        },
      ],
      regulation: {
        intro:
          'The ISO 26262 objectives here are about showing that the software unit design and its implementation satisfy the safety requirements, at an integrity level that does not accept sampling as sufficient on its own.',
        clauses: [
          {
            standard: 'ISO 26262',
            clause: '6-7',
            requires: 'software architectural design that supports the required integrity level',
          },
          {
            standard: 'ISO 26262',
            clause: '6-9',
            requires: 'verification of software unit design and implementation',
          },
          {
            standard: 'ISO 26262',
            clause: '6-10',
            requires: 'software integration and verification evidence',
          },
          {
            standard: 'ISO 26262',
            clause: '8-11',
            requires: 'confidence in the use of software tools',
          },
        ],
      },
      workflows: [
        {
          name: 'ADAS arbitration between competing subsystems',
          engine: 'Formus',
          detail:
            'Mutual exclusion of actuation authority is proven across every combination of subsystem states, rather than exercised against a scenario catalogue.',
          artifact: 'assurance object with the violating combination, bound to ISO 26262 6-9',
        },
        {
          name: 'Battery management state safety',
          engine: 'Formus',
          detail:
            'Cell balancing, thermal and contactor state logic is proven to have no reachable state that violates the safety goal, including during fault transitions.',
          artifact: 'ASIL-mapped assurance object per safety requirement',
        },
        {
          name: 'Requirement to property for the safety case',
          engine: 'Formus',
          detail:
            'Safety requirements become formal properties with a named engineer confirming each translation, so the safety case carries derivations rather than a claim that the requirement was implemented.',
          artifact: 'confirmed property set with approver identity',
        },
      ],
      example: {
        eyebrow: 'ADAS ARBITRATION · ASIL D',
        question:
          'Can two subsystems hold actuation authority for the same axis at the same time?',
        lines: [
          'requirement   REQ-ARB-0044 · exclusive actuation authority',
          'property      G !(auth[aeb] & auth[lka])',
          'confirmed_by  m.das · 3 edits · authority bound to the arbitration tick',
          'check         VIOLATED · 4 inputs aligned',
          'combination   aeb_request & lka_active & driver_override & bus_degraded',
          'coverage      this combination was not present in 41,000 scenario runs',
        ],
        result: 'VIOLATED · the combination, and the fact that no test reached it',
        chip: 'VIOLATED',
      },
      walkaway: {
        label: 'WHAT YOU LEAVE HOLDING',
        detail:
          'An ASIL-mapped assurance object you can drop directly into the safety case, carrying the property, the approver, and the exact combination where the logic fails if it does.',
      },
      boundary: {
        intro: 'What we do not do here.',
        items: [
          'We do not replace your runtime error analysis. It answers a different question, it is entrenched for good reason, and you should keep it. We sit above it, at the requirement-to-property step it does not attempt.',
          'We do not do the hazard analysis or set the ASIL. That decision is upstream of anything we touch.',
          'We do not verify the perception stack. Statistical components are outside what a deterministic checker can settle, and we will say so rather than imply otherwise.',
          'We are not a tool qualification package. ISO 26262 8-11 confidence is a separate argument and we will tell you where our output sits in it.',
        ],
      },
      cta: {
        heading: 'Send us the arbitration logic that has never failed in testing.',
        body: 'One state machine, the exclusivity requirement, and the scenario count you have run against it. We will tell you whether a violating combination exists outside that set.',
      },
    },
  },

  // ------------------------------------------------------- semiconductors
  {
    slug: 'semiconductors',
    name: 'Semiconductors',
    standards: 'SVA / firmware root-of-trust',
    summary:
      'You already own the formal environment. What you do not own is somebody free to write four hundred assertions.',
    page: {
      failure:
        'Assertion authoring is still manual, even inside the formal environment you already own.',
      quote: {
        text: 'We have the formal environment and we have the licences. What we do not have is somebody free to turn four hundred pages of firmware requirements into assertions, one at a time, and then keep them current when the spec moves.',
        source: 'what we hear from verification leads who already run formal sign-off',
      },
      blindspot: {
        intro:
          'This is the one sector where the tooling is genuinely excellent and the gap is somewhere else entirely. Nothing here is a criticism of your flow. It is an observation about where your flow begins.',
        rows: [
          {
            approach: 'Your formal environment',
            proves: 'the assertion you hand it, thoroughly and at scale',
            misses: 'nothing at all, and it starts after the assertion already exists',
          },
          {
            approach: 'Linting and simulation',
            proves: 'structural issues and dynamic behaviour on the stimulus you wrote',
            misses: 'conformance to the requirement document the stimulus came from',
          },
          {
            approach: 'The requirement document',
            proves: 'nothing, it is prose',
            misses: 'any mechanical link to the assertion set, so drift is invisible',
          },
        ],
      },
      engines: [
        {
          engine: 'Formus',
          lead: 'We generate the properties your existing formal tools prove.',
          body: 'From the requirement, in SVA, with a fidelity report attached. A named engineer confirms each property before it is emitted, and the assertion goes into the sign-off flow you already run. The assertion-authoring bottleneck is the thing that disappears. Nothing else about your flow changes, and we are not asking you to move a proof off a tool that is already doing it well.',
        },
      ],
      position: {
        label: 'POSITION',
        heading: 'We feed your flow. We do not replace it.',
        body: 'Formal verification in silicon is a mature, well-served market and we are not entering it. The gap we close sits above the solver: turning the firmware or interoperability requirement into the assertion, keeping the assertion tied to the requirement when either moves, and reporting whether the assertion constrained anything. Your sign-off flow, your licences and your methodology stay exactly where they are.',
      },
      regulation: {
        intro:
          'Governance here is contractual and internal rather than regulatory, so the clauses that matter are your own sign-off criteria and the interface contracts you owe the other side of the die.',
        clauses: [
          {
            standard: 'IEEE 1800',
            clause: '§16',
            requires: 'SystemVerilog assertion syntax your sign-off flow consumes',
          },
          {
            standard: 'Internal sign-off',
            clause: 'assertion coverage',
            requires: 'every requirement has a corresponding, current assertion',
          },
          {
            standard: 'Root of trust',
            clause: 'secure boot chain',
            requires: 'the property holds for every reachable boot state, not the tested ones',
          },
          {
            standard: 'Interface contract',
            clause: 'cross-die',
            requires: 'both sides agree in every state, including error and retry paths',
          },
        ],
      },
      workflows: [
        {
          name: 'Firmware requirement to SVA assertion',
          engine: 'Formus',
          detail:
            'The requirement becomes a property, a named engineer confirms it reads correctly, and it is emitted as SVA into your existing environment. The link between requirement and assertion survives, so drift becomes visible instead of silent.',
          artifact: 'assertion set with requirement bindings and approver identity',
        },
        {
          name: 'Root-of-trust and secure boot properties',
          engine: 'Formus',
          detail:
            'Boot chain properties are stated over every reachable boot state rather than the ones the test bench constructs, and the fidelity report says whether each property constrained the design.',
          artifact: 'assertion set plus fidelity score per property',
        },
        {
          name: 'Cross-die interoperability contracts',
          engine: 'Formus',
          detail:
            'The interface contract is expressed once and emitted to both sides, so the two teams are proving the same property rather than two compatible readings of the same paragraph.',
          artifact: 'shared property set, content-hashed, one per interface',
        },
      ],
      example: {
        eyebrow: 'SECURE BOOT · ROOT OF TRUST',
        question:
          'Can the boot chain reach an execution state where an unverified image has control?',
        lines: [
          'requirement   REQ-SB-0031 · no execution before signature verification',
          'property      assert property (@(posedge clk) exec |-> sig_verified);',
          'confirmed_by  r.nair · 1 edit · exec bound to the fetch enable, not the PC write',
          'emitted       SVA · into your existing sign-off flow',
          'fidelity      mutation kill 18 of 19 · not vacuous',
          'drift         requirement moved at rev 4.1 · assertion flagged, not silently stale',
        ],
        result: 'ASSERTION EMITTED · with the requirement binding that keeps it honest',
        chip: 'PROVEN',
      },
      walkaway: {
        label: 'WHAT YOU LEAVE HOLDING',
        detail:
          'A verified assertion set plus its fidelity score, portable into the sign-off flow you already run, with each assertion still bound to the requirement it came from.',
      },
      boundary: {
        intro: 'What we do not do here.',
        items: [
          'We do not replace your formal environment. We feed it. If you already have one, keeping it is the correct decision and our output is designed for it.',
          'We do not do the proof engineering. Convergence tuning, abstraction strategy and sign-off methodology stay with your team.',
          'We do not verify silicon. We work at the level of the requirement and the RTL or firmware described by it.',
          'We do not claim coverage closure. The fidelity report tells you how strong each assertion is; it does not tell you the assertion set is complete.',
        ],
      },
      cta: {
        heading: 'Send us ten requirements and the assertions somebody hand-wrote for them.',
        body: 'We will emit our own, show you where they differ, and score both. If yours are stronger we will tell you that, which is a useful answer either way.',
      },
    },
  },

  // ---------------------------------------------------- financial services
  {
    slug: 'financial-services',
    name: 'Financial services',
    standards: 'RBI / SEBI / DPDP',
    summary:
      'Agents that move money act on evidence that was true a few minutes ago. The gate checks how old it is.',
    page: {
      failure:
        'A support agent refunds an order the order system already recorded as delivered, and the money is irrecoverable before anyone reads the log.',
      quote: {
        text: 'Agents that move money act on evidence that was true a few minutes ago. Our policy engine said the action was permitted, and it was right. It simply had no opinion about whether the fact underneath the decision was still true.',
        source: 'what we hear from platform and risk teams running agentic workflows',
      },
      blindspot: {
        intro:
          'The gap here is not authorisation. Authorisation is a solved problem and you have already solved it. The gap is that a permitted action and a currently-true fact are two different things, and only one of them is being checked.',
        rows: [
          {
            approach: 'Policy engines',
            proves: 'the action is permitted by the rules as written',
            misses:
              'whether the evidence the rules were applied to is still current at the moment of execution',
          },
          {
            approach: 'Audit logging',
            proves: 'what happened, afterwards',
            misses: 'why, in a form anyone can re-derive without trusting the log',
          },
          {
            approach: 'Four-eyes approval',
            proves: 'a second human clicked approve',
            misses: 'whether either human noticed the field that had gone stale',
          },
          {
            approach: 'Hand-written policy',
            proves: 'the rules exist',
            misses: 'that the rules are internally consistent, and that nothing can route around them',
          },
        ],
      },
      engines: [
        {
          engine: 'Sentinel',
          lead: 'The gate checks how old the evidence is, and rules on absence.',
          body: 'Sentinel intercepts the money-moving action before execution, reconstructs the evidence the decision relied on, and checks that evidence against the authoritative source for freshness. Absence is a verdict, not a gap: no current order status means review, never proceed. RBI and SEBI limits and internal risk thresholds are enforced at the gate rather than asserted in a policy document, and every decision produces a signed, replayable record.',
        },
        {
          engine: 'Formus',
          lead: 'Your policies come with a proof they are internally consistent.',
          body: 'This is the part a hand-written policy engine cannot offer. The pack is proven consistent before it is compiled, so a rule that contradicts another rule is a finding at compile time rather than a surprise at two in the morning. Combined with credential vaulting, which means the agent holds no key for the payment rail, the claim is not that the policy is followed. It is that there is no path that skips it.',
        },
      ],
      regulation: {
        intro:
          'The obligations here are about being able to show, afterwards, who authorised what and on what basis. That is an evidence problem before it is a controls problem.',
        clauses: [
          {
            standard: 'RBI',
            clause: 'Master Direction on IT Governance',
            requires: 'auditable authorisation trail for customer-impacting transactions',
          },
          {
            standard: 'SEBI',
            clause: 'CSCRF',
            requires: 'access control and logging for systems that place or amend orders',
          },
          {
            standard: 'DPDP',
            clause: '§8(5)',
            requires: 'demonstrable safeguards over personal data, with recorded purpose',
          },
          {
            standard: 'DPDP',
            clause: '§8(7)',
            requires: 'erasure on withdrawal of consent, evidenced',
          },
        ],
      },
      workflows: [
        {
          name: 'Refunds and chargebacks issued by an agent',
          engine: 'Sentinel',
          detail:
            'Every refund is gated on evidence freshness against the order system and on agreement between the customer claim and the authoritative source. Above the approval threshold the allow carries a second-approver obligation that is enforced, not suggested.',
          artifact: 'decision record with the evidence manifest and the deciding rule',
        },
        {
          name: 'Loan and limit decisions with a stated basis',
          engine: 'Formus',
          detail:
            'The policy is compiled from the circular text rather than restated by hand, and each decision returns the minimal set of clauses that produced it. When the policy version changes, past decisions can be re-evaluated against the pack that applied at the time.',
          artifact: 'assurance object binding the decision to the clauses it satisfies',
        },
        {
          name: 'Customer data leaving its declared scope',
          engine: 'Sentinel',
          detail:
            'Exports and third-party shares are gated on the declared purpose and the consent state on record. No action can move regulated data outside its declared scope without an explicit, recorded override.',
          artifact: 'decision record naming the purpose, the consent state and any override',
        },
      ],
      example: {
        eyebrow: 'RETAIL BANKING · REFUND ESCALATION',
        question:
          'A ₹18,400 refund, claimed as not delivered, on an order the order system says was delivered 22 minutes ago.',
        lines: [
          'action_class(payments.refund)     IRREVERSIBLE · fail posture CLOSED',
          'evidence_age = 22m                ✗ exceeds 5m for IRREVERSIBLE',
          'authoritative source             ✗ "delivered" conflicts with the claim',
          'amount = ₹18,400                  · above the ₹10,000 threshold',
          'obligation                        route to human review',
          'ledger                            seq 88231.4 · replay ✓',
        ],
        result: 'DENY · fin-in-v3.1 · rule R-207 evidence_freshness',
        chip: 'DENY',
      },
      walkaway: {
        label: 'WHAT YOU LEAVE HOLDING',
        detail:
          'A tamper-evident, replayable decision record per transaction: the evidence the decision used, how old each piece of it was, the rule that decided, and a hash chain that makes any later alteration visible.',
      },
      boundary: {
        intro: 'What we do not do here.',
        items: [
          'We do not score credit risk, price products, or make any judgement the policy does not already contain.',
          'We do not detect fraud. If a claim is a lie and every authoritative source agrees with it, the gate will allow the action.',
          'We are not a system of record. Your order system, CRM and core banking stay authoritative. We read them and record what they said at decision time.',
          'We do not file your regulatory returns. We produce the evidence they rest on.',
        ],
      },
      cta: {
        heading: 'Bring us the refund workflow you have not automated.',
        body: 'The one where the reversal is the problem, not the decision. Forty-five minutes, one workflow, and an honest answer about whether the evidence you need is even available at the moment the decision is made.',
      },
    },
  },

  // -------------------------------------------------------- regulated saas
  {
    slug: 'regulated-saas',
    name: 'Regulated SaaS',
    standards: 'GDPR / DPDP / SOC 2',
    summary:
      'When the security review asks how your agents are governed, you hand them a proof, not a promise.',
    page: {
      failure:
        'Your buyer’s security review asks what your autonomous agents are allowed to do inside their tenant, and the honest answer is a policy document.',
      quote: {
        text: 'Every question on the review had an answer except one. They asked what our agents are actually allowed to do inside a customer tenant, and what stops them from doing anything else. We had a paragraph. They wanted a record.',
        source: 'what we hear from founders whose enterprise deal stalled in security review',
      },
      blindspot: {
        intro:
          'Compliance tooling in this market is mature and largely does what it says. The narrow thing it cannot do is the thing your buyer is now asking about, because autonomous agents postdate the control frameworks being attested against.',
        rows: [
          {
            approach: 'Compliance automation platforms',
            proves: 'controls are configured and monitoring is switched on',
            misses:
              'what an autonomous agent did inside a tenant, and what would have stopped it',
          },
          {
            approach: 'Your SOC 2 report',
            proves: 'controls operated over the period, sampled by an auditor',
            misses: 'per-action authority for a system that acts on its own between samples',
          },
          {
            approach: 'Your policy document',
            proves: 'you wrote the rules down',
            misses: 'that they were enforced at the moment an action executed',
          },
        ],
      },
      engines: [
        {
          engine: 'Sentinel',
          lead: 'A proof, not a promise.',
          body: 'Every action an agent takes on tenant data crosses the gate. A cross-tenant read is not a violation to detect afterwards; it is an action that does not execute, because the agent has no credential that would let it. Exports carry obligations that are enforced rather than approved: redact fields outside the declared scope, cap volume, expire the permission. What you hand the security review is the record of what was permitted and what actually happened, not a description of your intentions.',
        },
      ],
      position: {
        label: 'SCOPE',
        heading: 'This is one artifact, not a compliance platform.',
        body: 'We are not competing with the tools that track your controls, your policies and your vendor reviews. Those tools are cheaper, broader and further along, and if you have one you should keep it. We produce a single artifact none of them can generate: a signed, replayable record of what your autonomous agents were permitted to do and what they did. Buy us for the one question they cannot answer.',
      },
      regulation: {
        intro:
          'Nothing here is exotic. The difficulty is that the answers have to be evidenced continuously, and the evidence usually lives in a spreadsheet somebody updates before the audit.',
        clauses: [
          {
            standard: 'GDPR',
            clause: 'Art. 5(2)',
            requires: 'accountability: demonstrate compliance, not merely achieve it',
          },
          {
            standard: 'GDPR',
            clause: 'Art. 30',
            requires: 'records of processing activities, kept current',
          },
          {
            standard: 'DPDP',
            clause: '§8(5)',
            requires: 'reasonable security safeguards, demonstrable',
          },
          {
            standard: 'SOC 2',
            clause: 'CC6.1',
            requires: 'logical access controls with evidence of operation over the period',
          },
        ],
      },
      workflows: [
        {
          name: 'Agent actions inside customer tenants',
          engine: 'Sentinel',
          detail:
            'Every action an agent takes on tenant data is gated on the tenant boundary and the purpose declared for it. The agent holds no credential that reaches another tenant, so the boundary is a capability rather than a rule.',
          artifact: 'decision record per action, with the tenant and purpose named',
        },
        {
          name: 'Data exports and third-party shares',
          engine: 'Sentinel',
          detail:
            'Exports carry obligations rather than approvals: redact fields outside the declared scope, cap volume, expire the permission in minutes. The export that happens is the export that was permitted.',
          artifact: 'decision record listing the obligations applied and their expiry',
        },
        {
          name: 'The security questionnaire itself',
          engine: 'Formus',
          detail:
            'Control claims about agent behaviour are stated as properties over the recorded decisions and proven against the ledger for the period in question, rather than attested by someone who was not watching.',
          artifact: 'assurance object per control claim, bound to the SOC 2 criterion',
        },
      ],
      example: {
        eyebrow: 'B2B SAAS · TENANT BOUNDARY',
        question:
          'An agent asks to export 3,912 contact records from a tenant to an external enrichment service.',
        lines: [
          'action          crm.export_contacts · pack:dpdp-v2.0',
          'tenant          acme-eu · purpose on file: support triage',
          'declared scope  contact.name, contact.email',
          'requested       contact.name, contact.email, contact.phone',
          'obligation      redact contact.phone · expire in 15m',
          'ledger          seq 41908.1 · replay ✓',
        ],
        result: 'ALLOW · with obligations enforced at the gate · 31ms',
        chip: 'ALLOW',
      },
      walkaway: {
        label: 'WHAT YOU LEAVE HOLDING',
        detail:
          'An agent-governance attestation for the procurement review: a signed, replayable record of what your agents were permitted to do inside a tenant and what they actually did, verifiable by your buyer without calling us.',
      },
      boundary: {
        intro: 'What we do not do here.',
        items: [
          'We are not a compliance platform and we do not track your controls, policies or vendor reviews. If you already run one of those, keep it.',
          'We are not your SOC 2 auditor and we do not issue the report. We produce evidence the auditor tests.',
          'We do not monitor your infrastructure, scan dependencies or manage vulnerabilities.',
          'We do not gate actions we are not in front of. If your agent can reach a tool without crossing the proxy, that tool is outside the record, and we will enumerate those during scoping.',
          'We do not write your privacy policy or decide your lawful basis.',
        ],
      },
      cta: {
        heading: 'Send us the security review question that stalled your last deal.',
        body: 'The one you could only answer with a document. We will show you what the record would look like instead, using your own agent and one workflow.',
      },
    },
  },
];

export const publishedSectors = sectors.filter((sector) => sector.page !== undefined);

export function findSector(slug: string): Sector | undefined {
  return sectors.find((sector) => sector.slug === slug);
}
