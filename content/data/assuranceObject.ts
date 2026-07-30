/**
 * One real Assurance Object.
 *
 * `assuranceBody` is the signed payload. Its content hash is not written here:
 * it is computed from this object at build time and recomputed in the visitor's
 * browser when they press verify. If the two ever disagreed, the card would say
 * so rather than claiming a pass.
 */

export const assuranceBody = {
  kensara_assurance_object: '1.0',
  engine: 'formus',
  emitted_by: 'formus/2.4.1',
  determinism: {
    clock: 'injected',
    randomness: 'absent',
    serialization: 'canonical · sorted keys · NFC · integer money',
    ordering: 'total · ties broken by rule id',
    llm_on_authoritative_path: false,
  },
  requirement: {
    id: 'REQ-PMP-0114',
    source: 'SRS v4.2 §5.5.1',
    text: 'The pump shall not arm both infusion timers within the same control cycle.',
    captured_by: 'a.rege',
  },
  specification: {
    language: 'kvl',
    compiled_from: 'REQ-PMP-0114',
    formula: 'G !(arm(t1) & arm(t2))',
    confirmed_by: 'a.rege',
    confirmation_mode: 'human',
    drafted_by: 'advisory model · not authoritative',
  },
  verdict: {
    result: 'PROVEN',
    solver: 'z3',
    solver_version: '4.13.0',
    duration_ms: 41,
    rule_base_size: 412,
    unsat_core: ['R-0087', 'R-0141', 'R-0302', 'R-0398'],
  },
  regulatory_binding: [
    { standard: 'IEC 62304', clause: '5.5', satisfies: 'software unit verification' },
    { standard: 'IEC 62304', clause: '5.7.3', satisfies: 'software system testing evidence' },
    { standard: 'ISO 14971', clause: '7.1', satisfies: 'risk control verification' },
  ],
  ledger: {
    chain: 'kensara-ledger-v1',
    seq: '41907.2',
    prev: '8c14ef2a',
  },
  signature: {
    algorithm: 'sha-256',
    canonicalization: 'kensara-canonical-json/1',
  },
} as const;

export const assuranceMeta = {
  title: 'Assurance object',
  subject: 'REQ-PMP-0114 · infusion timer mutual exclusion',
  standardsLabel: 'IEC 62304 · CLASS C',
} as const;
