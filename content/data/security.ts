/**
 * Factual security attestations.
 *
 * These are claims about the world, not about the architecture, so they are
 * kept in data and left empty until the company confirms them. A security page
 * that overstates a certification is worse than one that says "ask us".
 *
 * Fill `certifications` and `subProcessors` as each is confirmed; the page
 * renders whatever is here and states the honest fallback when a list is empty.
 */

export interface Certification {
  name: string;
  /** e.g. 'certified', 'audit in progress', 'scoped, not started' */
  status: string;
  detail: string;
}

export interface SubProcessor {
  name: string;
  purpose: string;
  region: string;
  dataTouched: string;
}

export const certifications: Certification[] = [];

export const subProcessors: SubProcessor[] = [];

/** Published disclosure address. Falls back to the access request route. */
export const securityContact = process.env.NEXT_PUBLIC_SECURITY_EMAIL ?? '';
