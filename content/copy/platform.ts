/**
 * Platform page copy.
 *
 * This page is a sandbox, and a sandbox shows behaviour rather than
 * construction. Every claim here is about what the engines emit, what they
 * refuse to emit, and what a visitor can check for themselves. Nothing
 * describes how either engine is built, and the page says so out loud rather
 * than leaving the omission to be noticed.
 *
 * No em dashes.
 */

export const platform = {
  meta: {
    title: 'Live engine sandbox',
    description:
      'Both engines running in your browser. Change the design, change the conditions, and watch the verdict change with them. Real checks, real hashes, no backend.',
  },

  // ------------------------------------------------------------------- hero
  hero: {
    eyebrow: 'PLATFORM · LIVE ENGINE SANDBOX',
    h1: ['Both engines.', 'Running in this page.'],
    sub: 'Not a video and not a recording. Change the design and the proof re-runs. Change the evidence and the gate rules again. Every verdict below is computed in your browser, on your machine, while you watch.',
    chips: [
      { text: 'no backend', tone: 'muted' as const },
      { text: 'no randomness', tone: 'muted' as const },
      { text: 'same inputs, same output, every time', tone: 'proof' as const },
    ],
  },

  // ------------------------------------------------------------ the framing
  framing: {
    rule: { label: 'WHAT THIS IS', value: 'outputs, not internals' },
    h2: 'A sandbox shows you what comes out.',
    body: [
      'The two panels below are the real output formats: the verdict Formus returns on a property, and the decision Sentinel returns on an action. Both are computed here rather than fetched, so you can change the inputs and watch the answer move.',
      'What the sandbox runs on is deliberately small. A twelve-state controller and a four-rule policy pack are things a laptop can settle instantly. Your systems are not, and the engines exist for that gap.',
    ],
    shows: {
      label: 'WHAT YOU CAN CHECK HERE',
      items: [
        'the verdict, and the exact sequence of events that breaks a property',
        'whether a property that passed was strong enough to be worth passing',
        'how a gate rules on an action, and on the absence of current evidence',
        'the artifact both engines emit, and its hash, recomputed in front of you',
      ],
    },
    hides: {
      label: 'WHAT IT DELIBERATELY DOES NOT SHOW',
      items: [
        'how requirements in English become formal properties',
        'how proofs survive a change to the design they were written against',
        'how a state space too large to enumerate is made tractable',
        'how environmental assumptions are inferred and validated',
      ],
      note: 'Those are the engines. This page is the instrument panel in front of them, and it is the part you should be allowed to test before you trust anything.',
    },
  },

  // --------------------------------------------------------------- formus
  formus: {
    rule: { label: 'FORMUS · SANDBOX', value: 'exhaustive check' },
    h2: 'Change the design. Watch the proof follow.',
    body: [
      'A small device controller with three design decisions and three requirements taken from a real specification. Flip a decision and every state the system can reach is enumerated again, and the requirement is re-checked against all of them.',
      'This is the difference the whole company rests on. A test suite would exercise the paths somebody thought to write. This settles every path there is, and where the requirement fails it returns the shortest sequence of events that gets there rather than a coverage percentage.',
    ],
    tryThis: {
      label: 'TRY THIS',
      items: [
        'It opens on a failure. Lockout has no exit, and the check hands back the four events that strand the controller.',
        'Turn on "lockout has an exit" and it passes. Then read the line underneath: the requirement caught one of six seeded design faults.',
        'Now turn off sensor recovery as well. It fails again two events in, for a reason that has nothing to do with lockout, and the controller is already doomed before it ever reaches it.',
        'Select the maintenance requirement. It passes on every design, and the check tells you the pass was empty.',
      ],
    },
  },

  // -------------------------------------------------------------- sentinel
  sentinel: {
    rule: { label: 'SENTINEL · SANDBOX', value: 'live decision' },
    h2: 'Change the evidence. Watch the gate follow.',
    body: [
      'A support agent asking to refund an order, evaluated against a sample policy pack. Set the amount, what the customer claims, what the order system says, and how long ago it said it.',
      'The decision id is a real SHA-256 of the canonicalised inputs, computed here. Open devtools, hash the same inputs yourself, and you will get the same value. That is the property the whole product is sold on, so it would be strange to fake it on the page where we demonstrate it.',
    ],
    tryThis: {
      label: 'TRY THIS',
      items: [
        'Set the order system to "in transit" and the source contradiction clears, but the verdict does not, because the evidence is still twenty-two minutes old.',
        'Bring the evidence inside five minutes as well and the action is permitted, with a second approver attached above the threshold.',
        'Drop the amount below ten thousand and the obligation disappears with it.',
      ],
    },
  },

  // -------------------------------------------------------------- artifact
  artifact: {
    rule: { label: 'ONE ARTIFACT', value: 'from both engines' },
    h2: 'A proof and a gate decision leave the same kind of record.',
    body: 'Different events, one format. What was asked, what it compiled to, what was decided, and which clause that satisfies. One integration for your evidence pipeline instead of two, and a single thing for an assessor to learn how to read.',
    anatomy: [
      { part: 'requirement', from: 'the engineer’s words, verbatim, with its source' },
      { part: 'specification', from: 'what it compiled to, and who confirmed it' },
      { part: 'verdict + certificate', from: 'the result, and what was responsible for it' },
      { part: 'regulatory binding', from: 'the standard and clause it is submitted against' },
      { part: 'signature', from: 'the content hash over the canonical bytes' },
    ],
  },

  // ---------------------------------------------------------------- replay
  replay: {
    rule: { label: 'REPLAY', value: 'two machines · one result' },
    h2: 'Same input. Byte-identical output.',
    body: 'Two independent derivations of the object above, run side by side, sharing no state. Each canonicalises from scratch and digests its own bytes. If the determinism contract were not holding, these two columns would disagree, and the panel would say so rather than quietly showing a tick.',
    machineA: 'MACHINE A',
    machineB: 'MACHINE B',
    run: 'Replay on both machines',
    running: 'Deriving…',
  },

  // ------------------------------------------------------------ invariants
  determinism: {
    rule: { label: 'DETERMINISM CONTRACT', value: '6 invariants' },
    h2: 'Six invariants, held on every authoritative path.',
    body: 'These are commitments rather than implementation, which is why we can state them plainly. Each one is checkable from the outside: if any of them failed, replay would fail, and you would be the one who noticed.',
    invariants: [
      { name: 'no ambient clock', detail: 'now is injected, never read' },
      { name: 'no randomness', detail: 'seeded or absent' },
      { name: 'canonical serialization', detail: 'sorted keys · NFC · exact integer money' },
      { name: 'pinned versions', detail: 'every artifact addressed by content hash' },
      { name: 'LLMs quarantined', detail: 'off the authoritative path, always' },
      { name: 'total ordering', detail: 'ties broken by fixed rule, never by arrival' },
    ],
    cost: {
      h3: 'What each one costs us.',
      body: 'None of these are free. An injected clock means every caller has to supply one. Canonical serialization means money is an integer everywhere, including where a float would have been convenient. Pinned versions mean a solver upgrade is a migration rather than an install. We pay all of it because replay is the only property that still matters after an incident.',
    },
  },

  // ------------------------------------------------------------ the limits
  limits: {
    rule: { label: 'LIMITS', value: 'what a sandbox cannot prove' },
    h2: 'What this page does not establish.',
    body: 'A demonstration you cannot break is not evidence of much. Here is what you should still be sceptical about after using it.',
    items: [
      {
        name: 'Twelve states is not a real system',
        detail:
          'Everything here settles instantly because the space is trivial. Whether the engine closes your state space is a question about your design, and the honest answer is that we find out together during scoping.',
      },
      {
        name: 'The policy pack here is ours',
        detail:
          'Four rules we wrote, on a workflow we chose. Your policy will have more rules, more sources, and disagreements between them. That is the real work.',
      },
      {
        name: 'Nothing here proves the translation step',
        detail:
          'The requirements in this sandbox were already formal when they arrived. Turning a requirements document into properties is the part that is hard, and it is not something a page can demonstrate.',
      },
      {
        name: 'Verifying an object is not verifying us',
        detail:
          'The hash check below confirms that these bytes are these bytes. It says nothing about whether the verdict inside them was correct, which is what the assurance object exists to let an assessor examine.',
      },
    ],
  },

  // ------------------------------------------------------------------- cta
  cta: {
    rule: { label: 'NEXT', value: 'technical' },
    eyebrow: 'SCOPING CALL · 45 MIN',
    heading: 'Bring a system this sandbox would choke on.',
    body: 'One state machine you have signed off on testing alone, or one workflow where the evidence is not available at the moment the decision is made. Forty-five minutes and an honest answer about whether the engine closes it.',
    actions: [
      { label: 'Request access', href: '/demo/', kind: 'primary' as const },
      { label: 'Open a real Assurance Object', href: '/assurance-object/', kind: 'secondary' as const },
    ],
  },
} as const;
