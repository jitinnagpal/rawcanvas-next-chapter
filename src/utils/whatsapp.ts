const WHATSAPP_NUMBER = '919908392200';
const DEFAULT_WHATSAPP_MESSAGE = 'Hi! I am interested in getting interior design work done.';

export const WHATSAPP_DEFAULT_MESSAGE = DEFAULT_WHATSAPP_MESSAGE;

export const getWhatsAppUrl = (message: string) => {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message || DEFAULT_WHATSAPP_MESSAGE)}`;
};

export const openWhatsApp = (message: string) => {
  window.open(getWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
};

// WhatsApp clicks are intent, not a lead: nobody has given their details yet.
// Meta gets the standard "Contact" event (form submissions remain "Lead").
// Google Ads gets its own WhatsApp conversion action, set to Secondary in the Ads
// account so it is reported but does not drive bidding the way form leads do.
export const trackWhatsAppClick = (location: string) => {
  const w = typeof window !== 'undefined' ? (window as any) : null;
  if (!w) return;

  if (w.gtag) {
    w.gtag('event', 'whatsapp_click', { event_category: 'engagement', location });
    w.gtag('event', 'conversion', { send_to: 'AW-18053594263/ZVdUCKfp6ZQcEJf5z6BD' });
  }

  if (w.fbq) {
    w.fbq('track', 'Contact', { content_name: 'whatsapp', location });
  }
};

export const handleWhatsAppClick = (message: string, location: string) => {
  trackWhatsAppClick(location);
  openWhatsApp(message || DEFAULT_WHATSAPP_MESSAGE);
};
