/**
 * Website leads go straight into the Mokha Designs leads Google Sheet via an
 * Apps Script web app that lives inside that Sheet
 * (source: google-apps-script/lead-intake.gs).
 *
 * The URL is public by design: it can only append a row. Replace it if the
 * script is ever redeployed as a brand-new deployment (a "New version" of the
 * existing deployment keeps the same URL).
 */
export const LEADS_ENDPOINT =
  import.meta.env.VITE_LEADS_ENDPOINT ||
  'https://script.google.com/macros/s/AKfycbzz0o3ym29l3wQCOZXtEhLspKaqdF-mktrh2Xc_TvrOL1UL_Jhxpz0_udQoyhwEhDU/exec';

export async function submitLeadToSheet(data: Record<string, unknown>): Promise<void> {
  // text/plain keeps this a "simple" request: no CORS preflight, which Apps
  // Script cannot answer. The script parses the body as JSON.
  const res = await fetch(LEADS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(data),
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`Lead endpoint returned ${res.status}`);
  const json = await res.json().catch(() => null);
  if (!json || json.success !== true) {
    throw new Error(`Lead not recorded: ${json?.error ?? 'unexpected response'}`);
  }
}
