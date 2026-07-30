export const demo = {
  meta: {
    title: 'Request access',
    description:
      'Bring one real workflow to a 45 minute scoping call: an agent action you have stopped short of automating, or a requirement your certification body keeps sending back.',
  },

  /**
   * Delivery configuration.
   *
   * Set `formEndpoint` to a POST target, or `contactEmail` to open the
   * visitor's mail client with the request composed. With neither set, the form
   * still produces the request and offers it for copying, so the page is never
   * a dead end.
   */
  delivery: {
    formEndpoint: process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? '',
    contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? '',
  },

  hero: {
    eyebrow: 'SCOPING CALL · 45 MIN',
    h1: ['Bring one workflow.', 'We will tell you honestly if this fits.'],
    sub: 'Not a demo of features. Forty-five minutes on one decision you have stopped short of automating, or one requirement your certification body keeps returning.',
  },

  expect: {
    rule: { label: 'AGENDA', value: '45 min' },
    h2: 'What the call actually is.',
    items: [
      {
        name: 'You describe one workflow',
        detail:
          'The action, who currently approves it, what evidence exists at the moment of the decision, and what happens today when it goes wrong.',
      },
      {
        name: 'We map it to a gate or a proof',
        detail:
          'Which engine applies, what the policy pack would need to contain, and which of your systems would have to be the authoritative source.',
      },
      {
        name: 'We tell you where it does not fit',
        detail:
          'If your evidence is not available at decision time, or the rule you need is genuinely a judgement call rather than a rule, this is the wrong instrument and we will say so on the call.',
      },
    ],
  },

  form: {
    rule: { label: 'REQUEST', value: 'access' },
    h2: 'Send the workflow.',
    body: 'Five fields. The last one is the one that matters.',
    fields: {
      name: 'YOUR NAME',
      email: 'WORK EMAIL',
      organisation: 'ORGANISATION',
      sector: 'SECTOR',
      workflow: 'THE ONE WORKFLOW',
      workflowHint:
        'The action or requirement, in your own words. Specifics are more useful than context.',
    },
    sectors: [
      'Aerospace & defence',
      'Healthcare & life sciences',
      'Financial services',
      'Automotive',
      'Semiconductors',
      'Regulated SaaS',
      'Other',
    ],
    submit: 'Send this request to Kensara',
    sending: 'Sending…',
    sent: 'Request sent. We reply within two working days.',
    copied: 'Request copied to your clipboard. Paste it into an email to us to send it.',
    failed:
      'The request did not send. Copy it below and email it to us, or try again in a minute.',
    copy: 'Copy this request',
  },
} as const;
