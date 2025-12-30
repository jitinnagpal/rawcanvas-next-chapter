// Email validation utility for lead quality

export interface EmailValidationResult {
  isValid: boolean;
  error?: string;
  warning?: {
    message: string;
    suggestedValue?: string;
  };
  normalizedValue: string;
}

// Common disposable/junk email local parts
const JUNK_LOCAL_PARTS = [
  'test',
  'demo',
  'admin',
  'no-reply',
  'noreply',
  'sample',
  'example',
  'user',
  'guest',
];

// Exact junk emails to reject
const JUNK_EMAILS = [
  'a@a.com',
  'b@b.com',
  'test@test.com',
  'test@testing.com',
  'demo@demo.com',
  'admin@admin.com',
  'user@user.com',
  'a@b.com',
  'abc@abc.com',
  'xyz@xyz.com',
  '123@123.com',
  'asd@asd.com',
  'asdf@asdf.com',
  'qwerty@qwerty.com',
];

// Common typo corrections for popular email domains
const DOMAIN_TYPO_MAP: Record<string, string> = {
  'gmal.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gmali.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.om': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmil.com': 'gmail.com',
  'hotmial.com': 'hotmail.com',
  'hotmal.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'hotmail.co': 'hotmail.com',
  'hotmail.con': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outloo.com': 'outlook.com',
  'outlook.co': 'outlook.com',
  'outlook.con': 'outlook.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yahoo.co': 'yahoo.com',
  'yahoo.con': 'yahoo.com',
  'yahoomail.com': 'yahoo.com',
  'rediffmal.com': 'rediffmail.com',
  'redifmail.com': 'rediffmail.com',
  'rediff.com': 'rediffmail.com',
};

/**
 * Normalize email value:
 * - Trim spaces
 * - Convert to lowercase
 * - Remove internal spaces
 */
function normalizeEmail(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s/g, '');
}

/**
 * Basic email format validation
 * More robust than simple regex
 */
function isValidEmailFormat(email: string): boolean {
  // Must have exactly one @
  const atCount = (email.match(/@/g) || []).length;
  if (atCount !== 1) return false;
  
  const [localPart, domain] = email.split('@');
  
  // Local part checks
  if (!localPart || localPart.length === 0) return false;
  if (localPart.length > 64) return false;
  if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
  if (localPart.includes('..')) return false;
  
  // Domain checks
  if (!domain || domain.length === 0) return false;
  if (domain.length > 255) return false;
  if (domain.startsWith('.') || domain.endsWith('.')) return false;
  if (domain.startsWith('-') || domain.endsWith('-')) return false;
  if (domain.includes('..')) return false;
  
  // Must have at least one dot in domain (for TLD)
  if (!domain.includes('.')) return false;
  
  // TLD must be at least 2 characters
  const tld = domain.split('.').pop();
  if (!tld || tld.length < 2) return false;
  
  // Basic format check - allowed characters
  const emailRegex = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Check if email is a known junk email
 */
function isJunkEmail(email: string): boolean {
  return JUNK_EMAILS.includes(email);
}

/**
 * Check if local part is a junk pattern
 */
function hasJunkLocalPart(email: string): boolean {
  const [localPart] = email.split('@');
  // Check exact match for local part (without +alias)
  const baseLocalPart = localPart.split('+')[0];
  return JUNK_LOCAL_PARTS.includes(baseLocalPart);
}

/**
 * Check for domain typos and suggest correction
 */
function getDomainTypoSuggestion(email: string): string | null {
  const [localPart, domain] = email.split('@');
  if (domain && DOMAIN_TYPO_MAP[domain]) {
    return `${localPart}@${DOMAIN_TYPO_MAP[domain]}`;
  }
  return null;
}

/**
 * Validate an email address for lead quality
 */
export function validateEmail(value: string): EmailValidationResult {
  const normalizedValue = normalizeEmail(value);
  
  // If empty, it's valid (email is optional)
  if (!normalizedValue) {
    return {
      isValid: true,
      normalizedValue: '',
    };
  }
  
  // Rule 1: Check basic format
  if (!isValidEmailFormat(normalizedValue)) {
    return {
      isValid: false,
      error: 'Please enter a valid email (e.g., name@gmail.com).',
      normalizedValue,
    };
  }
  
  // Rule 2: Check for exact junk emails
  if (isJunkEmail(normalizedValue)) {
    return {
      isValid: false,
      error: 'Please enter your real email so we can share the estimate.',
      normalizedValue,
    };
  }
  
  // Rule 3: Check for junk local parts (only on generic domains)
  const [, domain] = normalizedValue.split('@');
  const genericDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'mail.com'];
  if (genericDomains.includes(domain) && hasJunkLocalPart(normalizedValue)) {
    return {
      isValid: false,
      error: 'Please enter your real email so we can share the estimate.',
      normalizedValue,
    };
  }
  
  // Soft rule: Check for domain typos
  const suggestedEmail = getDomainTypoSuggestion(normalizedValue);
  if (suggestedEmail) {
    return {
      isValid: true,
      warning: {
        message: `Did you mean ${suggestedEmail.split('@')[1]}?`,
        suggestedValue: suggestedEmail,
      },
      normalizedValue,
    };
  }
  
  return {
    isValid: true,
    normalizedValue,
  };
}
