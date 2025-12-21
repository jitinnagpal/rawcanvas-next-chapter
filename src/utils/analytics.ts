// Analytics event tracking utility

type AnalyticsEvent = {
  event: string;
  properties?: Record<string, unknown>;
};

export const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
  const event: AnalyticsEvent = {
    event: eventName,
    properties,
  };
  
  // Log to console for debugging
  console.log('[Analytics]', eventName, properties);
  
  // Push to dataLayer for GTM if available
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: eventName,
      ...properties,
    });
  }
  
  // Can be extended to send to other analytics services
};

// Specific event trackers
export const trackTopCtaClicked = (cta: 'estimate_cost' | 'free_consultation') => {
  trackEvent('top_cta_clicked', { cta });
};

export const trackEstimateGenerateClicked = () => {
  trackEvent('estimate_generate_clicked');
};

export const trackEstimateGenerated = (data: {
  scope: string;
  finish: string;
  storage: string;
  upgrades: string[];
  status: string;
  location: string;
  totalLow: number;
  totalHigh: number;
  entryMode: string;
}) => {
  trackEvent('estimate_generated', data);
};

export const trackDesignMySpaceClicked = (data: {
  entryMode: string;
  estimateWasGenerated: boolean;
}) => {
  trackEvent('design_my_space_clicked', data);
};
