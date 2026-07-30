/**
 * Scene B · The Gate.
 *
 * Three seeded scenarios on a loop. They are fixed, not random: the gate that
 * demonstrates itself differently on every visit is demonstrating the wrong
 * property.
 */

export interface GateScenario {
  action: string;
  pack: string;
  rule: string;
  outcome: 'ALLOW' | 'REVIEW';
  note: string;
  latency: string;
}

export const GATE_SCENARIOS: readonly GateScenario[] = [
  {
    action: 'tickets.add_note',
    pack: 'passthrough',
    rule: 'sensitivity NONE',
    outcome: 'ALLOW',
    note: 'not a consequential action · logged, never gated',
    latency: '0ms',
  },
  {
    action: 'payments.refund',
    pack: 'pack:fin-in-v3.1',
    rule: 'R-207 evidence_freshness',
    outcome: 'REVIEW',
    note: 'evidence age 22m exceeds 5m for IRREVERSIBLE',
    latency: 'held',
  },
  {
    action: 'crm.export_contacts',
    pack: 'pack:dpdp-v2.0',
    rule: 'R-118 scope_boundary',
    outcome: 'ALLOW',
    note: 'within declared scope · 3,912 records · redact obligation',
    latency: '31ms',
  },
];

/** One scenario occupies this many seconds of the loop. */
export const SCENARIO_SECONDS = 5.2;

/** Policy tokens shown orbiting the plane while the packet is examined. */
export const POLICY_TOKENS = ['R-207', 'R-311', 'R-402'] as const;
