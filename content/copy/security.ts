export const security = {
  meta: {
    title: 'Security',
    description:
      'Deployment models, data handling, key management, ledger integrity, and what never leaves your perimeter.',
  },

  hero: {
    eyebrow: 'SECURITY · DEPLOYMENT AND DATA HANDLING',
    h1: ['What leaves your perimeter,', 'and what never does.'],
    sub: 'This page is boring on purpose. It is the one your security reviewer will read first, so it says what is true and marks what is not yet true.',
  },

  deployment: {
    rule: { label: 'DEPLOYMENT', value: '3 models' },
    h2: 'Three deployment models.',
    body: 'The gate has to sit where the action is. That constrains where everything else can sit.',
    models: [
      {
        name: 'SaaS',
        note: 'fastest to run',
        body: 'Control plane and policy compilation hosted by us. The interceptor and the credential vault still run inside your perimeter, because a gate that holds your keys somewhere else is not a gate you control.',
        leaves: 'evidence manifests for gated actions, policy pack metadata',
        stays: 'credentials, source, customer records',
      },
      {
        name: 'VPC',
        note: 'single tenant',
        body: 'The whole stack runs in your cloud account, in your region. We ship the images; you hold the infrastructure and the keys.',
        leaves: 'telemetry you opt into, nothing else',
        stays: 'credentials, source, customer records, evidence manifests, the ledger',
      },
      {
        name: 'On-premises, air-gapped',
        note: 'defence and regulated manufacturing',
        body: 'No outbound network path. Policy packs and solver versions arrive as signed bundles and are content-hash verified before they load.',
        leaves: 'nothing',
        stays: 'everything',
      },
    ],
  },

  data: {
    rule: { label: 'DATA HANDLING', value: 'explicit' },
    h2: 'No training on your data.',
    body: [
      'We do not train models on customer data. Not on your requirements, not on your policies, not on the contents of your evidence manifests, not in aggregate, not de-identified.',
      'The corpus described on the platform page is built from structured correction records, and it is opt-in per deployment and exportable. If you never enable it, nothing about your data reaches it, and every assurance object you have been issued still verifies.',
    ],
    residency:
      'Data residency follows the deployment: in VPC and on-premises models nothing leaves the region you deploy into, because nothing leaves at all.',
    rows: [
      { item: 'Credentials for gated tools', handling: 'vaulted inside your perimeter · never transit to us' },
      { item: 'Source code', handling: 'never ingested · Formus works from requirements and rule bases' },
      { item: 'Evidence manifests', handling: 'assembled and evaluated locally · retained per your policy' },
      { item: 'Requirement text sent to the formalizer', handling: 'crosses to the advisory model · excluded in air-gapped deployments' },
      { item: 'Audit ledger', handling: 'written and verified locally · verification needs no call to us' },
    ],
  },

  keys: {
    rule: { label: 'KEY MANAGEMENT', value: 'yours' },
    h2: 'You hold the keys the gate holds.',
    body: 'The credential vault is backed by your KMS. Sentinel requests a short-lived credential per gated action, scoped to that action, and the grant is recorded in the ledger alongside the decision that authorised it. Revoking at your KMS revokes at the gate, immediately, with no cooperation needed from us.',
    points: [
      'per-action, short-lived credentials rather than a standing token',
      'ledger signing keys separate from action credentials',
      'key rotation is a configuration change, not a migration',
      'no Kensara-held key can authorise an action in your environment',
    ],
  },

  ledger: {
    rule: { label: 'LEDGER INTEGRITY', value: 'hash-chained' },
    h2: 'The ledger is checkable without us.',
    body: 'Each entry carries the digest of the entry before it, so removing or altering one breaks every entry after it. Verification is a local walk of the chain against the recorded digests. There is no service to call and no attestation to trust, which is the property that makes the record worth keeping.',
  },

  certifications: {
    rule: { label: 'CERTIFICATION STATUS', value: 'stated honestly' },
    h2: 'Where each audit actually stands.',
    empty:
      'Certification status is published here as each audit reaches a stated position, and not before. Ask us directly and we will tell you exactly where each one stands, including the ones we have not started.',
  },

  subProcessors: {
    rule: { label: 'SUB-PROCESSORS', value: 'per deployment' },
    h2: 'Who else touches anything.',
    empty:
      'The current sub-processor list is provided under the deployment model you choose, because it differs between them, and it is nil for air-gapped deployments. Ask us for the list that applies to you before you sign anything.',
  },

  disclosure: {
    rule: { label: 'DISCLOSURE', value: 'coordinated' },
    h2: 'Reporting something you found.',
    body: 'Send us the finding with enough detail to reproduce it. We acknowledge within two working days, we will tell you honestly whether we already knew, and we will not threaten you. If a fix affects issued assurance objects we will say which ones and why.',
    fallbackCta: 'Send us a security finding',
  },
} as const;
