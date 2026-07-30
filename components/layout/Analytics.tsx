import Script from 'next/script';

/**
 * Plausible stub. Cookieless, no cross-site identifiers, no Google Analytics:
 * a privacy-and-governance company running surveillance analytics is a
 * contradiction visitors notice.
 *
 * Renders nothing until NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set at build time, so
 * development and preview builds ship zero analytics bytes.
 */
export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;

  return (
    <Script
      defer
      strategy="afterInteractive"
      data-domain={domain}
      src="https://plausible.io/js/script.js"
    />
  );
}
