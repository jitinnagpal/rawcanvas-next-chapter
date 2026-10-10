/**
 * Lead source attribution.
 *
 * On page load, works out where this visitor came from (ad click, social link,
 * search, or direct) and remembers the most recent non-direct source in this
 * browser. The lead form sends that label with the lead, so the Sheet shows
 * which channel produced each enquiry.
 */
const KEY = 'md_lead_source';

const REFERRERS: [RegExp, string][] = [
  [/instagram\./, 'Instagram'],
  [/facebook\.|fb\.com|fb\.me/, 'Facebook'],
  [/google\./, 'Google search'],
  [/bing\.|duckduckgo\.|yahoo\./, 'Other search'],
  [/whatsapp\.|wa\.me/, 'WhatsApp'],
  [/linkedin\./, 'LinkedIn'],
  [/youtube\./, 'YouTube'],
];

function classify(): string | null {
  const q = new URLSearchParams(window.location.search);
  const utm = ['utm_source', 'utm_medium', 'utm_campaign'].map((k) => q.get(k)).filter(Boolean);
  if (utm.length) return utm.join(' / ');
  if (q.get('gclid') || q.get('gbraid') || q.get('wbraid')) return 'Google Ads';
  if (q.get('fbclid')) return 'Facebook/Instagram link';

  const ref = document.referrer;
  if (ref) {
    try {
      const host = new URL(ref).hostname;
      if (host && host !== window.location.hostname && !host.endsWith('mokhadesigns.com')) {
        const hit = REFERRERS.find(([re]) => re.test(host));
        return hit ? hit[1] : host.replace(/^www\./, '');
      }
    } catch {
      /* ignore malformed referrer */
    }
  }
  return null;
}

/** Call once on app start. Keeps the latest non-direct source; direct visits never overwrite it. */
export function captureAttribution(): void {
  try {
    const source = classify();
    if (source) {
      localStorage.setItem(KEY, `${source} | landed ${window.location.pathname}`);
    } else if (!localStorage.getItem(KEY)) {
      localStorage.setItem(KEY, `Direct | landed ${window.location.pathname}`);
    }
  } catch {
    /* storage blocked (private mode etc.) - getAttribution falls back */
  }
}

export function getAttribution(): string {
  try {
    return localStorage.getItem(KEY) || classify() || 'Direct';
  } catch {
    return classify() || 'Unknown';
  }
}
