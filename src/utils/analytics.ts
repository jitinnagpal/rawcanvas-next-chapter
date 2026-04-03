// Analytics event tracking utility

type AnalyticsEvent = {
  event: string;
  properties?: Record<string, unknown>;
};

export const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
  // Log to console for debugging
  console.log('[Analytics]', eventName, properties);

  // Fire ONLY via gtag to avoid duplicate events and dataLayer state leakage
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, properties);
  }
};

// Specific event trackers
export const trackEstimateCostClicked = () => {
  trackEvent('estimate_cost_clicked', { source: 'hero' });
};

export const trackEstimateGenerateClicked = () => {
  trackEvent('estimate_generate_clicked');
};

export const trackEstimateGenerated = (data: {
  scope: string;
  status: string;
  location: string;
  totalLow: number | null;
  totalHigh: number | null;
  entryMode: string;
  bhkSize: string;
}) => {
  trackEvent('estimate_generated', data);
};

export const trackDesignMySpaceClicked = (data: {
  entryMode: string;
  estimateWasGenerated: boolean;
}) => {
  trackEvent('design_my_space_clicked', {
    ...data,
    source: 'quote_cta',
    cta: 'request_detailed_quote',
  });
};

export const trackLeadValidationFailed = (data: {
  field: 'full_name' | 'email';
  reason: string;
}) => {
  trackEvent('lead_validation_failed', data);
};
