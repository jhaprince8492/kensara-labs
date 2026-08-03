export const sentinel = {
  meta: {
    title: 'Sentinel',
    description:
      'Sentinel intercepts every consequential action before execution, evaluates it against compiled policy, and records an unforgeable decision.',
  },

  hero: {
    eyebrow: 'SENTINEL · ACTIONS · P1 ACTION PATH',
    h1: ['Your agent doesn’t hold the keys.', 'The gate does.'],
    sub: 'Sentinel intercepts every consequential action before execution, evaluates it against compiled policy, and records an unforgeable decision, in single-digit milliseconds.',
    readout: 'DENY · fin-in-v3.1 · evidence staleness · authoritative source disagrees',
  },

  bypass: {
    rule: { label: 'THREAT MODEL', value: 'bypass' },
    h2: 'An interceptor an agent can route around is theatre.',
    body: [
      'The design follows from that sentence. The proxy vaults the credentials. The agent’s runtime holds no key for the payment rail, no key for the OMS, no key for the CRM.',
      'Skipping the gate means having nothing to act with. That is a stronger property than a policy the agent is asked to respect, because it does not depend on the agent respecting anything.',
    ],
    diagram: {
      agent: 'AGENT RUNTIME',
      agentNote: 'no credentials',
      gate: 'SENTINEL',
      gateNote: 'holds credentials',
      tool: 'TOOL · PAYMENT RAIL · OMS · CRM',
    },
  },

  surfaces: {
    rule: { label: 'INTEGRATION', value: '4 surfaces' },
    h2: 'Four ways in. One of them is voluntary, and we say which.',
    items: [
      {
        name: 'MCP proxy',
        note: 'primary',
        body: 'One integration covers every MCP tool the agent can reach. The agent talks to the proxy and the proxy holds the credentials.',
        honesty: 'enforced · the agent has no path around it',
      },
      {
        name: 'SDK decorator',
        note: '@kensara.gate',
        body: 'Five minutes, anywhere in your own code. Wrap the function that performs the action.',
        honesty: 'voluntary · a developer who omits the decorator is not gated',
      },
      {
        name: 'Framework hooks',
        note: 'LangGraph · tool-call callbacks',
        body: 'Binds at the framework’s own tool-call boundary, so every tool the graph invokes crosses the gate.',
        honesty: 'enforced within the framework · direct calls outside it are not covered',
      },
      {
        name: 'Network sidecar',
        note: 'VPC tier',
        body: 'Egress from the agent’s subnet is routed through the sidecar. Nothing leaves without a decision.',
        honesty: 'enforced at the network layer',
      },
    ],
  },

  latency: {
    rule: { label: 'LATENCY', value: 'measured at the gate' },
    h2: 'Answer the latency question before it is asked.',
    body: 'Sensitivity is a property of the action, declared once. Most calls an agent makes are not consequential, and those are not gated at all.',
    rows: [
      { sensitivity: 'NONE', behaviour: 'passthrough, logged, never gated', latency: '~0ms' },
      { sensitivity: 'LOW', behaviour: 'manifest assembled, cached evidence', latency: '1 to 2ms' },
      { sensitivity: 'HIGH', behaviour: 'full evaluation against the compiled pack', latency: 'single-digit ms' },
    ],
  },

  failPosture: {
    rule: { label: 'FAIL POSTURE', value: 'closed by default' },
    h2: 'An unrecognised action is never a pass-through.',
    body: [
      'Fail-closed for irreversible actions. Fail-open is configurable, but only for reversible ones. Anything the registry does not recognise defaults to REVIEW.',
      'New tools appear faster than any registry updates. A gate that treats the unknown as permitted is a gate that gets weaker every time your platform team ships.',
    ],
    rows: [
      { klass: 'IRREVERSIBLE', posture: 'CLOSED', example: 'payments.refund · trades · deletions' },
      { klass: 'REVERSIBLE', posture: 'configurable', example: 'tickets.add_note · draft edits' },
      { klass: 'UNKNOWN', posture: 'REVIEW', example: 'any action not in the registry' },
    ],
  },

  demo: {
    rule: { label: 'WORKED EXAMPLE', value: 'refund · fin-in-v3.1' },
    h2: 'A support agent wants to refund an order. You set the conditions.',
    body: 'The manifest, the policy trace, the obligation and the ledger coordinates, all visible. Evaluated in this browser, with no backend and no randomness.',
  },

  obligations: {
    rule: { label: 'OBLIGATIONS', value: 'allow with conditions' },
    h2: 'A decision is not only allow or deny.',
    body: 'It can allow with conditions attached, and the conditions are enforced rather than suggested.',
    items: [
      { name: 'notify', detail: 'the named channel is told before the action lands' },
      { name: 'redact', detail: 'fields outside the declared scope are removed from the payload' },
      { name: 'cap', detail: 'the action executes at a bounded value, not the requested one' },
      { name: 'second approver', detail: 'a second named human must approve before execution' },
      { name: 'expire', detail: 'the permission is valid for a fixed window and then is not' },
    ],
    queueLabel: 'REVIEW QUEUE',
    queue: [
      { id: 'rq_4417', action: 'payments.refund', amount: '₹18,400', rule: 'R-207', age: '2m' },
      { id: 'rq_4416', action: 'crm.export_contacts', amount: '3,912 records', rule: 'R-118', age: '14m' },
      { id: 'rq_4412', action: 'payments.refund', amount: '₹41,000', rule: 'R-402', age: '41m' },
    ],
  },

  ledger: {
    rule: { label: 'LEDGER', value: 'append-only · hash-chained' },
    h2: 'Replay it, and get the same bytes.',
    body: 'Every decision is appended to a hash-chained log. Re-deriving a decision from its recorded inputs produces the same verdict, the same trace and the same digest, or the chain says it did not.',
  },

  packs: {
    rule: { label: 'POLICY PACKS', value: 'versioned · content-hashed' },
    h2: 'A decision names the exact pack version that produced it.',
    body: 'Packs are versioned and content-hashed, so a decision made in March can be re-evaluated in December against the pack that actually applied at the time.',
    items: ['fin-in · RBI, SEBI', 'dpdp · India', 'gdpr · EU', 'hipaa · US', 'internal risk thresholds'],
  },

  cta: {
    rule: { label: 'NEXT', value: 'technical' },
    eyebrow: 'SCOPING CALL · 45 MIN',
    heading: 'Point it at one workflow in your staging environment.',
    body: 'One agent, one consequential action, your own policy. We will run it in staging and show you the ledger at the end of the week.',
    actions: [
      { label: 'Request access', href: '/demo/', kind: 'primary' as const },
      { label: 'Open a real Assurance Object', href: '/assurance-object/', kind: 'secondary' as const },
    ],
  },
} as const;
