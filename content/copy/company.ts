export const company = {
  meta: {
    title: 'Company',
    description:
      'Why Kensara exists, who builds it, how we work, and the research posture behind it.',
  },

  hero: {
    eyebrow: 'COMPANY · KENSARA LABS',
    h1: ['We build instruments,', 'not assurances.'],
  },

  why: {
    rule: { label: 'PREMISE', value: 'why we exist' },
    h2: 'Why we exist.',
    body: [
      'We spent years on either side of the same conversation. One of us was writing formal specifications for systems where being wrong is not recoverable. The other was sitting in compliance reviews where the honest answer to “how do you know” was a spreadsheet and a promise.',
      'Both sides knew the maths that would settle it existed. Formal verification has certified avionics and silicon for three decades. It was never the maths that was slow. It was writing the specification, which cost more than writing the software it described, so it stayed where the regulator forced it and nowhere else.',
      'Then software started making decisions on its own, and the gap stopped being an aerospace problem. An agent that issues a refund, moves money, or changes a patient record is making a consequential decision with no derivation behind it and nothing left to inspect afterwards.',
      'So we built the translation layer, and we put the language model outside the trusted boundary where it belongs. It drafts. A human confirms. A solver decides. What comes out is an object your auditor can check without asking us anything, which is the only kind of trust that survives us being wrong about something.',
    ],
  },

  team: {
    rule: { label: 'TEAM', value: 'who owns what' },
    h2: 'Who builds it.',
    body: 'One line each on what they actually own.',
  },

  research: {
    rule: { label: 'RESEARCH POSTURE', value: 'IIT-G · MeitY' },
    h2: 'Where the work sits.',
    items: [
      {
        name: 'IIT Guwahati',
        detail:
          'The formal methods work is anchored to an active academic group rather than to a single hire, which is what makes the verification core reviewable by people who are not us.',
      },
      {
        name: 'Technology Incubation Centre, IIT Guwahati',
        detail: 'Incubated at TIC, with access to the institute’s research and lab infrastructure.',
      },
      {
        name: 'MeitY',
        detail: 'Backed by the Ministry of Electronics and Information Technology.',
      },
    ],
  },

  principles: {
    rule: { label: 'ENGINEERING COMMITMENTS', value: '4' },
    h2: 'How we work.',
    items: [
      {
        name: 'We name our limits.',
        detail:
          'REFUSE is a first-class verdict. A system that answers everything has told you nothing about which answers to trust, and a vendor that claims everything has told you the same.',
      },
      {
        name: 'Determinism over cleverness.',
        detail:
          'No ambient clock, no randomness, canonical serialization, pinned versions. Every one of those costs us something in convenience and buys replay, which is the only property that matters after an incident.',
      },
      {
        name: 'The evidence must outlive us.',
        detail:
          'An assurance object verifies without calling our servers. If this company disappears, the objects it emitted still check out. Anything else is a dependency dressed as a guarantee.',
      },
      {
        name: 'No verdict without a derivation.',
        detail:
          'If we cannot show which rules were responsible, we do not ship the answer. That constraint decides more of the architecture than any other.',
      },
    ],
  },

  careers: {
    rule: { label: 'CAREERS', value: 'open' },
    h2: 'What we are looking for.',
    body: 'Formal methods engineers who have shipped, platform engineers who have run something that could not go down, and compliance people who have been on the receiving end of an assessment. If that is you, tell us which of the four commitments above you would argue with, and why.',
  },
} as const;
