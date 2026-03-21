const WHATSAPP_NUMBER = '919908392200';
const DEFAULT_WHATSAPP_MESSAGE = 'Hi! I am interested in getting interior design work done.';

export const getWhatsAppUrl = (message: string) => {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message || DEFAULT_WHATSAPP_MESSAGE)}`;
};

export const openWhatsApp = (message: string) => {
  window.open(getWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
};

// Track WhatsApp click with Meta Pixel
export const trackWhatsAppClick = (location: string) => {
  console.log('[Analytics] WhatsApp CTA clicked', { location });

  // Fire Meta Pixel Lead event
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'Lead', {
      source: 'whatsapp_cta',
      location,
    });
  }

  // Push to dataLayer for GTM
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: 'whatsapp_cta_clicked',
      source: 'whatsapp_cta',
      location,
    });
  }
};

export const handleWhatsAppClick = (message: string, location: string) => {
  trackWhatsAppClick(location);
  openWhatsApp(message || DEFAULT_WHATSAPP_MESSAGE);
};
