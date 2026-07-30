/** Inputs a visitor controls in the Sentinel demo. Money is integer paise. */
export type CustomerClaim = 'not delivered' | 'damaged' | 'wrong item';
export type OmsStatus = 'delivered' | 'in transit' | 'lost';
export type CrmAddressAge = 'current' | 'stale (3w)';

export interface GateInput {
  /** Refund amount in integer paise. 1_840_000 paise = Rs 18,400. */
  amount_inr: number;
  customer_claim: CustomerClaim;
  oms_status: OmsStatus;
  /** Minutes since the authoritative source last updated. Integer. */
  oms_updated_min: number;
  crm_address_age: CrmAddressAge;
}

/** A predicate outcome. `info` states a classification rather than testing one. */
export type PredicateStatus = 'pass' | 'fail' | 'obligation' | 'info';

export interface TraceLine {
  /** The evaluated expression, always rendered in mono. */
  expr: string;
  mark: '✓' | '✗' | '·';
  note: string;
  status: PredicateStatus;
}

export interface RuleTrace {
  /** Rule identifier, e.g. R-207. */
  id: string;
  /** Predicate name, e.g. evidence_freshness. */
  name: string;
  status: PredicateStatus;
  lines: TraceLine[];
}

export type Verdict = 'ALLOW' | 'DENY';

export interface Decision {
  verdict: Verdict;
  /** Content-addressed policy pack that produced this decision. */
  pack: string;
  /** The rule that decided it, e.g. "R-207 evidence_freshness". */
  decidingRule: string | null;
  rules: RuleTrace[];
  obligation: string | null;
  /** Full SHA-256 of the canonicalised input. */
  decisionId: string;
  /** The exact string that was hashed. Shown so a visitor can reproduce it. */
  canonicalInput: string;
  ledgerSeq: string;
  /** True when re-deriving the digest from the canonical form reproduced it. */
  replayOk: boolean;
  /** Formatted from the injected clock. Never read from an ambient clock. */
  evaluatedAt: string;
  /** Action class established by R-101. */
  actionClass: 'IRREVERSIBLE' | 'REVERSIBLE';
  failPosture: 'CLOSED' | 'OPEN';
}
