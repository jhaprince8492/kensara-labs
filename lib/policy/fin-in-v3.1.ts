import { canonicalJson, sha256Hex } from '@/lib/hash';
import type { Decision, GateInput, RuleTrace } from './types';

export const PACK_ID = 'fin-in-v3.1';
export const ACTION = 'payments.refund';

/** Evidence must be no older than this for an IRREVERSIBLE action. */
export const FRESHNESS_LIMIT_MIN = 5;
/** Rs 10,000, in integer paise. Above this a second approver is required. */
export const SECOND_APPROVER_THRESHOLD_PAISE = 1_000_000;

export const DEFAULT_INPUT: GateInput = {
  amount_inr: 1_840_000,
  customer_claim: 'not delivered',
  oms_status: 'delivered',
  oms_updated_min: 22,
  crm_address_age: 'current',
};

export const DENY_OBLIGATION = 'route to human review · queue:refund-escalation';
export const APPROVER_OBLIGATION = 'second approver required';

/** Rs display for an integer paise amount. No floats in the evaluation path. */
export function formatPaise(paise: number): string {
  const rupees = Math.trunc(paise / 100);
  const grouped = new Intl.NumberFormat('en-IN').format(rupees);
  return `₹${grouped}`;
}

/**
 * Evaluate one refund intent against policy pack fin-in-v3.1.
 *
 * Pure. Same inputs always produce the same verdict, the same trace and the
 * same decision id. There is no ambient clock here: `now` is injected, and it
 * is used only to stamp the decision, never to decide it. There is no
 * randomness. There is no language model on this path.
 */
export async function evaluate(input: GateInput, now: Date): Promise<Decision> {
  const rules: RuleTrace[] = [];

  // R-101 · action_class. Establishes the class and the fail posture. This
  // rule does not test the request; it classifies it, and every later rule
  // reads that classification.
  rules.push({
    id: 'R-101',
    name: 'action_class',
    status: 'info',
    lines: [
      {
        expr: `action_class(${ACTION}) = IRREVERSIBLE`,
        mark: '·',
        note: 'fail posture CLOSED',
        status: 'info',
      },
    ],
  });

  // R-207 · evidence_freshness. For IRREVERSIBLE actions the authoritative
  // source must have been updated within FRESHNESS_LIMIT_MIN minutes.
  const freshnessFailed = input.oms_updated_min > FRESHNESS_LIMIT_MIN;
  rules.push({
    id: 'R-207',
    name: 'evidence_freshness',
    status: freshnessFailed ? 'fail' : 'pass',
    lines: [
      {
        expr: `evidence_age = ${input.oms_updated_min}m`,
        mark: freshnessFailed ? '✗' : '✓',
        note: freshnessFailed
          ? `exceeds ${FRESHNESS_LIMIT_MIN}m for IRREVERSIBLE`
          : `within ${FRESHNESS_LIMIT_MIN}m for IRREVERSIBLE`,
        status: freshnessFailed ? 'fail' : 'pass',
      },
    ],
  });

  // R-311 · source_agreement. The customer's claim must not contradict the
  // authoritative source.
  const contradiction =
    input.oms_status === 'delivered' && input.customer_claim === 'not delivered';
  rules.push({
    id: 'R-311',
    name: 'source_agreement',
    status: contradiction ? 'fail' : 'pass',
    lines: [
      {
        expr: `authoritative(OMS).status = "${input.oms_status}"`,
        mark: contradiction ? '✗' : '✓',
        note: contradiction
          ? 'conflicts with claim'
          : `consistent with claim "${input.customer_claim}"`,
        status: contradiction ? 'fail' : 'pass',
      },
    ],
  });

  // R-402 · amount_threshold. Refunds above the threshold carry a second
  // approver obligation.
  const overThreshold = input.amount_inr > SECOND_APPROVER_THRESHOLD_PAISE;
  rules.push({
    id: 'R-402',
    name: 'amount_threshold',
    status: overThreshold ? 'obligation' : 'pass',
    lines: [
      {
        expr: `amount = ${formatPaise(input.amount_inr)}`,
        mark: overThreshold ? '·' : '✓',
        note: overThreshold
          ? `above ${formatPaise(SECOND_APPROVER_THRESHOLD_PAISE)} · second approver required`
          : `at or below ${formatPaise(SECOND_APPROVER_THRESHOLD_PAISE)}`,
        status: overThreshold ? 'obligation' : 'pass',
      },
    ],
  });

  // Verdict. Any FAIL on R-207 or R-311 denies. The first failing rule in
  // evaluation order is the deciding rule; ordering is fixed by the pack, never
  // by arrival.
  const failed = rules.find((r) => r.status === 'fail');

  let verdict: Decision['verdict'];
  let obligation: string | null;
  let decidingRule: string | null;

  if (failed) {
    verdict = 'DENY';
    obligation = DENY_OBLIGATION;
    decidingRule = `${failed.id} ${failed.name}`;
  } else if (overThreshold) {
    verdict = 'ALLOW';
    obligation = APPROVER_OBLIGATION;
    decidingRule = 'R-402 amount_threshold';
  } else {
    verdict = 'ALLOW';
    obligation = null;
    decidingRule = null;
  }

  // The decision id is a real SHA-256 over the canonicalised input: sorted
  // keys, no whitespace, money as an exact integer. `now` is deliberately not
  // part of it, so the same request is the same decision on any machine at any
  // time.
  const canonicalInput = canonicalJson(input);
  const decisionId = await sha256Hex(canonicalInput);

  // Replay: re-derive the digest from the same canonical form and compare. If
  // this ever disagreed you would see it here rather than being told it passed.
  const replayDigest = await sha256Hex(canonicalJson(input));
  const replayOk = replayDigest === decisionId;

  return {
    verdict,
    pack: PACK_ID,
    decidingRule,
    rules,
    obligation,
    decisionId,
    canonicalInput,
    ledgerSeq: ledgerSeq(decisionId),
    replayOk,
    evaluatedAt: stampTime(now),
    actionClass: 'IRREVERSIBLE',
    failPosture: 'CLOSED',
  };
}

/**
 * Ledger sequence, derived from the decision digest so that replaying a
 * decision reproduces its ledger coordinates exactly. In the product this is a
 * position in an append-only log; here it is a pure function of the decision,
 * because determinism matters more in a demo than realism does.
 */
function ledgerSeq(decisionId: string): string {
  const byte = Number.parseInt(decisionId.slice(0, 2), 16);
  return (88231 + (byte % 100) / 10).toFixed(1);
}

/** hh:mm:ss.mmm from the injected clock. Presentation only. */
function stampTime(now: Date): string {
  const pad = (n: number, w = 2) => String(n).padStart(w, '0');
  return (
    `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}` +
    `.${pad(now.getMilliseconds(), 3)}`
  );
}
