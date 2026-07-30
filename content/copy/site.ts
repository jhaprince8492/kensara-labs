/**
 * Site-level chrome copy.
 *
 * Nav only ever links to pages that exist. Routes arrive as their phase ships;
 * a nav item pointing at a placeholder undermines the thesis in public, so
 * unbuilt destinations are simply absent rather than disabled or marked soon.
 */

export interface NavItem {
  label: string;
  href: string;
}

export const site = {
  name: 'Kensara Labs',
  tagline: 'Provable AI governance',

  /** Blueprint nav: Formus · Sentinel · Platform · Industries · Governance · Company. */
  nav: [
    { label: 'Formus', href: '/formus/' },
    { label: 'Sentinel', href: '/sentinel/' },
    { label: 'Assurance object', href: '/assurance-object/' },
    { label: 'Company', href: '/company/' },
  ] satisfies NavItem[],

  cta: { label: 'Request access', href: '/demo/' },

  /** Utility links, top-right, small. Populated as those routes ship. */
  utility: [] satisfies NavItem[],

  footer: {
    positioning: 'Formus proves. Sentinel permits. Both emit the Assurance Object.',
    backing: ['MeitY-backed', 'Incubated at TIC, IIT Guwahati'],
    standardsLabel: 'STANDARDS ADDRESSED',
    standards: [
      'DO-178C',
      'DO-333',
      'IEC 62304',
      'ISO 13485',
      'ISO 26262',
      'DPDP',
      'GDPR',
      'RBI',
      'SEBI',
      'SOC 2',
    ],
    /** Replaced with the registered entity line when the company supplies it. */
    legal: 'Kensara Labs. Incubated at the Technology Incubation Centre, IIT Guwahati. Supported by MeitY.',
    columns: [
      {
        heading: 'PRODUCT',
        links: [
          { label: 'Formus', href: '/formus/' },
          { label: 'Sentinel', href: '/sentinel/' },
          { label: 'Assurance object', href: '/assurance-object/' },
        ] satisfies NavItem[],
      },
      {
        heading: 'COMPANY',
        links: [
          { label: 'Company', href: '/company/' },
          { label: 'Request access', href: '/demo/' },
        ] satisfies NavItem[],
      },
    ],
  },
} as const;
