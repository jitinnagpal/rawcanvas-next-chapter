/**
 * Detects device type from user agent
 */
export const detectDeviceType = (): string => {
  const ua = navigator.userAgent;
  
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'Tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'Mobile';
  }
  return 'Desktop';
};

/**
 * Detects browser from user agent
 */
export const detectBrowser = (): string => {
  const ua = navigator.userAgent;
  
  // Edge (Chromium-based)
  if (ua.indexOf('Edg') > -1) return 'Edge';
  
  // Chrome
  if (ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1) return 'Chrome';
  
  // Safari
  if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) return 'Safari';
  
  // Firefox
  if (ua.indexOf('Firefox') > -1) return 'Firefox';
  
  // Opera
  if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) return 'Opera';
  
  // Internet Explorer
  if (ua.indexOf('Trident') > -1) return 'Internet Explorer';
  
  return 'Unknown';
};

/**
 * Gets visitor location from IP address using free geolocation API
 */
export const getVisitorLocation = async (): Promise<string> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    
    if (!response.ok) {
      console.warn('Failed to fetch location data');
      return 'Unknown';
    }
    
    const data = await response.json();
    
    // Return city and country if available
    if (data.city && data.country_name) {
      return `${data.city}, ${data.country_name}`;
    } else if (data.country_name) {
      return data.country_name;
    }
    
    return 'Unknown';
  } catch (error) {
    console.error('Error fetching visitor location:', error);
    return 'Unknown';
  }
};
