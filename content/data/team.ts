/**
 * Team.
 *
 * Only people the company has actually confirmed appear here. Nothing on this
 * site is invented, and a team page is the worst place to start. Add the
 * remaining members here and the page picks them up; `billing: 'lead'` gives a
 * person the wider cell rather than an equal-sized grid tile.
 */

export interface Person {
  name: string;
  role: string;
  /** One line on what they actually own. Not a biography. */
  owns: string;
  credential: string;
  billing: 'lead' | 'standard';
  /** Path under /public. Photos are added by the company; no stock imagery. */
  photo?: string;
}

export const team: Person[] = [
  {
    name: 'Chandan Karfa',
    role: 'Formal methods',
    owns: 'The verification core: what Formus can prove, and what it must refuse to.',
    credential: 'Formal methods, IIT Guwahati',
    billing: 'lead',
  },
  {
    name: 'Tanouj',
    role: 'Governance, risk and compliance',
    owns: 'Policy packs and the clause mappings that make an assurance object count as evidence.',
    credential: '12 years in GRC',
    billing: 'lead',
  },
];
