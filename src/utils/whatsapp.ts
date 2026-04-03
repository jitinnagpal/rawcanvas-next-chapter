const WHATSAPP_NUMBER = '919908392200';
const DEFAULT_WHATSAPP_MESSAGE = 'Hi! I am interested in getting interior design work done.';

export const WHATSAPP_DEFAULT_MESSAGE = DEFAULT_WHATSAPP_MESSAGE;

export const getWhatsAppUrl = (message: string) => {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message || DEFAULT_WHATSAPP_MESSAGE)}`;
};

export const openWhatsApp = (message: string) => {
  window.open(getWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
};

// Track WhatsApp click — single unified event
export const trackWhatsAppClick = (location: string) => {
  console.log('[Analytics] WhatsApp clicked', { location });

  // Fire Google Ads whatsapp_click event (NOT a conversion)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'whatsapp_click', {
      'event_category': 'engagement',
      'event_label': 'whatsapp_chat',
      source: 'whatsapp_cta',
      cta: 'chat_whatsapp',
      location,
    });
  }

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
      event: 'whatsapp_click',
      source: 'whatsapp_cta',
      cta: 'chat_whatsapp',
      location,
    });
  }
};

export const handleWhatsAppClick = (message: string, location: string) => {
  trackWhatsAppClick(location);
  openWhatsApp(message || DEFAULT_WHATSAPP_MESSAGE);
};
