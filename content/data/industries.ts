import type { VerdictKind } from '@/components/primitives/VerdictChip';

/**
 * Six sectors, one rigid template. Consistency here is worth more than
 * creativity: a buyer comparing two of these pages should be able to find the
 * same thing in the same place.
 *
 * Sectors without a `page` are listed on the hub with their governing standards
 * and are not linked, because a card that leads nowhere is worse than a card
 * that leads nowhere and admits it.
 */

export interface Workflow {
  name: string;
  engine: 'Formus' | 'Sentinel';
  detail: string;
  artifact: string;
}

export interface SectorPage {
  /** The specific failure mode. One sentence, no imagery. */
  failure: string;
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
  boundary: {
    intro: string;
    items: string[];
  };
  cta: { heading: string; body: string };
}

export interface Sector {
  slug: string;
  name: string;
  standards: string;
  summary: string;
  page?: SectorPage;
}

export const sectors: Sector[] = [
  {
    slug: 'financial-services',
    name: 'Financial services',
    standards: 'RBI / SEBI / DPDP',
    summary:
      'Agents that move money act on evidence that was true a few minutes ago. The gate checks how old it is.',
    page: {
      failure:
        'A support agent refunds an order the OMS already recorded as delivered, and the money is irrecoverable before anyone reads the log.',
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
            'Every refund is gated on evidence freshness against the order system and on agreement between the customer claim and the authoritative source. Above the approval threshold the allow carries a second-approver obligation.',
          artifact: 'decision record with the evidence manifest and the deciding rule',
        },
        {
          name: 'Loan and limit decisions with a stated basis',
          engine: 'Formus',
          detail:
            'The policy is compiled from the circular text rather than restated by hand, and each decision returns the minimal set of clauses that produced it. When the policy changes, past decisions can be re-evaluated against the version that applied at the time.',
          artifact: 'assurance object binding the decision to the clauses it satisfies',
        },
        {
          name: 'Customer data leaving its declared scope',
          engine: 'Sentinel',
          detail:
            'Exports and third-party shares are gated on the declared purpose and the consent state on record. No action can move regulated data outside its declared scope without an explicit, recorded override.',
          artifact: 'decision record naming the purpose, the consent state and the override if any',
        },
      ],
      example: {
        eyebrow: 'RETAIL BANKING · REFUND ESCALATION',
        question: 'A ₹18,400 refund, claimed as not delivered, on an order the OMS says was delivered 22 minutes ago.',
        lines: [
          'action_class(payments.refund)     IRREVERSIBLE · fail posture CLOSED',
          'evidence_age = 22m                ✗ exceeds 5m for IRREVERSIBLE',
          'authoritative(OMS).status         ✗ "delivered" conflicts with claim',
          'amount = ₹18,400                  · above ₹10,000 threshold',
          'obligation                        route to human review',
          'ledger                            seq 88231.4 · replay ✓',
        ],
        result: 'DENY · fin-in-v3.1 · rule R-207 evidence_freshness',
        chip: 'DENY',
      },
      boundary: {
        intro: 'What we do not do here.',
        items: [
          'We do not score credit risk, price products, or make any judgement the policy does not already contain.',
          'We do not detect fraud. If a claim is a lie and every source agrees with it, the gate will allow the action.',
          'We are not a system of record. The OMS, the CRM and the core banking system stay authoritative; we read them and record what they said at decision time.',
          'We do not file your regulatory returns. We produce the evidence they rest on.',
        ],
      },
      cta: {
        heading: 'Bring us the refund workflow you have not automated.',
        body: 'The one where the reversal is the problem, not the decision. Forty-five minutes, one workflow, and an honest answer about whether the evidence you need is available at the moment the decision is made.',
      },
    },
  },
  {
    slug: 'healthcare-lifesciences',
    name: 'Healthcare & life sciences',
    standards: 'IEC 62304 / ISO 13485',
    summary:
      'Timing and interlock logic that passes every test in the suite can still deadlock on a state the suite never reached.',
    page: {
      failure:
        'A closed-loop pump’s timer logic passes the full verification suite and deadlocks on a state three transitions deep that no test case ever constructed.',
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
            'Mutual exclusion, timing bounds and mode transitions are proven exhaustively over the state space rather than sampled by test. A refuted property returns the concrete state that breaks it, which becomes a test case.',
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
            'Retrieval, summarisation and export actions are gated on the declared scope of the record and the purpose on file. Actions that would widen the scope are held rather than redacted silently.',
          artifact: 'decision record naming the scope, the purpose and the obligation applied',
        },
      ],
      example: {
        eyebrow: 'INFUSION PUMP · IEC 62304 CLASS C',
        question: 'Can both infusion timers be armed within the same control cycle?',
        lines: [
          'requirement  REQ-PMP-0114 · SRS v4.2 §5.5.1',
          'specification G !(arm(t1) & arm(t2))',
          'confirmed_by  a.rege · human confirmation · 2 edits',
          'rule base     412 rules in slice',
          'z3 4.13.0     UNSAT in 41ms',
          'unsat core    R-0087 · R-0141 · R-0302 · R-0398',
        ],
        result: 'PROVEN · bound to IEC 62304 5.5 · replay ✓',
        chip: 'PROVEN',
      },
      boundary: {
        intro: 'What we do not do here.',
        items: [
          'We do not certify your device, and we are not a notified body. We produce evidence that an assessor evaluates.',
          'We do not prove properties of the compiled binary or the hardware. We work at the level of the design and the requirements, and the toolchain qualification argument is still yours to make.',
          'We do not write your requirements. If a requirement is ambiguous, the confirmation gate will surface the ambiguity and stop, which is the correct behaviour and is also more work for you.',
          'We do not replace clinical evaluation or usability engineering.',
        ],
      },
      cta: {
        heading: 'Send us a requirement your notified body sent back.',
        body: 'Preferably one about timing or an interlock, in the words it was written in, with the clause it has to satisfy. We will tell you whether it is provable as written, and if it is not, which part is underspecified.',
      },
    },
  },
  {
    slug: 'regulated-saas',
    name: 'Regulated SaaS',
    standards: 'GDPR / DPDP / SOC 2',
    summary:
      'The evidence your customer’s security review is asking for, produced by the system rather than assembled for the questionnaire.',
    page: {
      failure:
        'An enterprise deal stalls for eleven weeks because your customer’s security review asks what your agent is allowed to do, and the honest answer is a policy document rather than a record.',
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
            'Every action an agent takes on tenant data is gated on the tenant boundary and the purpose declared for it. Cross-tenant reads are not a policy violation to be detected afterwards; they are an action that does not execute.',
          artifact: 'decision record per action, with the tenant and purpose named',
        },
        {
          name: 'Data exports and third-party shares',
          engine: 'Sentinel',
          detail:
            'Exports carry obligations rather than approvals: redact fields outside the declared scope, cap volume, expire the permission. The obligation is enforced at the gate, so the export that happens is the export that was permitted.',
          artifact: 'decision record listing the obligations applied and their expiry',
        },
        {
          name: 'The security questionnaire itself',
          engine: 'Formus',
          detail:
            'Control claims are stated as properties over the recorded decisions and proven against the ledger for the period in question, rather than attested by a person who was not watching.',
          artifact: 'assurance object per control claim, bound to the SOC 2 criterion',
        },
      ],
      example: {
        eyebrow: 'B2B SAAS · TENANT BOUNDARY',
        question: 'An agent asks to export 3,912 contact records from a tenant to an external enrichment service.',
        lines: [
          'action        crm.export_contacts · pack:dpdp-v2.0',
          'tenant        acme-eu · purpose on file: support triage',
          'declared scope  contact.name, contact.email',
          'requested       contact.name, contact.email, contact.phone',
          'obligation      redact contact.phone · expire in 15m',
          'ledger          seq 41908.1 · replay ✓',
        ],
        result: 'ALLOW · with obligations · 31ms',
        chip: 'ALLOW',
      },
      boundary: {
        intro: 'What we do not do here.',
        items: [
          'We are not your SOC 2 auditor and we do not issue the report. We produce evidence the auditor tests.',
          'We do not monitor your infrastructure, scan your dependencies, or manage vulnerabilities.',
          'We do not gate actions we are not in front of. If your agent can reach a tool without crossing the proxy, that tool is outside the record, and we will tell you which ones those are during scoping.',
          'We do not write your privacy policy or decide your lawful basis.',
        ],
      },
      cta: {
        heading: 'Send us the question that stalled your last enterprise deal.',
        body: 'The one from the security review that you could only answer with a document. We will show you what the record would look like instead.',
      },
    },
  },
  {
    slug: 'aerospace-defence',
    name: 'Aerospace & defence',
    standards: 'DO-178C / DO-333',
    summary:
      'Mode transitions that are valid, and valid, and valid, and then unrecoverable, three inputs deep.',
  },
  {
    slug: 'automotive-mobility',
    name: 'Automotive & mobility',
    standards: 'ISO 26262',
    summary:
      'ADAS arbitration and battery state logic, where the failing case is a combination nobody enumerated.',
  },
  {
    slug: 'semiconductors',
    name: 'Semiconductors',
    standards: 'firmware root-of-trust',
    summary:
      'Root-of-trust firmware and cross-die interoperability, where the property has to hold for every reachable state.',
  },
];

export const publishedSectors = sectors.filter((sector) => sector.page !== undefined);

export function findSector(slug: string): Sector | undefined {
  return sectors.find((sector) => sector.slug === slug);
}
