// Full Name validation utility for lead quality

export interface NameValidationResult {
  isValid: boolean;
  error?: string;
  warning?: string;
  normalizedValue: string;
}

// Common junk/fake name patterns (case-insensitive)
const JUNK_PATTERNS = [
  /^test$/i,
  /^testing$/i,
  /^asdf$/i,
  /^qwerty$/i,
  /^admin$/i,
  /^demo$/i,
  /^na$/i,
  /^n\/a$/i,
  /^none$/i,
  /^unknown$/i,
  /^xx+$/i,
  /^user$/i,
  /^sample$/i,
  /^abc$/i,
  /^xyz$/i,
  /^aaa+$/i,
  /^bbb+$/i,
  /^111+$/i,
  /^123$/i,
  /^guest$/i,
  /^anonymous$/i,
];

// Pattern for junk repeated names like "asdf asdf", "test test"
const REPEATED_JUNK_PATTERNS = [
  /^asdf\s+asdf$/i,
  /^test\s+test$/i,
  /^abc\s+abc$/i,
  /^xyz\s+xyz$/i,
  /^demo\s+demo$/i,
  /^user\s+user$/i,
  /^name\s+name$/i,
  /^first\s+last$/i,
  /^john\s+doe$/i,
  /^jane\s+doe$/i,
];

// Allowed characters: letters (including unicode), spaces, hyphen, apostrophe, dot
const VALID_NAME_PATTERN = /^[\p{L}\s\-'.]+$/u;

// Check if string has digits
const HAS_DIGITS = /\d/;

// Check for excessive symbols
const EXCESSIVE_SYMBOLS = /[!@#$%^&*()+=\[\]{}|\\:;"<>,?\/~`]/;

/**
 * Normalize a name value:
 * - Trim leading/trailing spaces
 * - Convert multiple spaces to single spaces
 * - Preserve user's casing
 */
function normalizeName(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Check if 70%+ characters are the same (keyboard mash detection)
 */
function isKeyboardMash(value: string): boolean {
  const cleanValue = value.replace(/\s/g, '').toLowerCase();
  if (cleanValue.length < 4) return false;
  
  const charCounts: Record<string, number> = {};
  for (const char of cleanValue) {
    charCounts[char] = (charCounts[char] || 0) + 1;
  }
  
  const maxCount = Math.max(...Object.values(charCounts));
  return maxCount / cleanValue.length >= 0.7;
}

/**
 * Check if name matches repeated short pattern like "ababab", "abcabc"
 */
function isRepeatedPattern(value: string): boolean {
  const cleanValue = value.replace(/\s/g, '').toLowerCase();
  if (cleanValue.length < 4) return false;
  
  // Check for 2-3 char patterns repeated
  for (let patternLen = 2; patternLen <= 3; patternLen++) {
    if (cleanValue.length % patternLen === 0) {
      const pattern = cleanValue.slice(0, patternLen);
      const repeated = pattern.repeat(cleanValue.length / patternLen);
      if (repeated === cleanValue) return true;
    }
  }
  
  return false;
}

/**
 * Count words in a name (tokens separated by spaces)
 */
function countWords(value: string): number {
  return value.split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Validate a full name for lead quality
 */
export function validateFullName(value: string): NameValidationResult {
  const normalizedValue = normalizeName(value);
  
  // Rule 1: Required - check if empty after normalization
  if (!normalizedValue) {
    return {
      isValid: false,
      error: 'Please enter your full name.',
      normalizedValue: '',
    };
  }
  
  // Rule 2: Check for digits
  if (HAS_DIGITS.test(normalizedValue)) {
    return {
      isValid: false,
      error: 'Use letters only (spaces, hyphen, apostrophe are okay).',
      normalizedValue,
    };
  }
  
  // Rule 3: Check for excessive symbols
  if (EXCESSIVE_SYMBOLS.test(normalizedValue)) {
    return {
      isValid: false,
      error: 'Use letters only (spaces, hyphen, apostrophe are okay).',
      normalizedValue,
    };
  }
  
  // Rule 4: Check allowed characters pattern
  if (!VALID_NAME_PATTERN.test(normalizedValue)) {
    return {
      isValid: false,
      error: 'Use letters only (spaces, hyphen, apostrophe are okay).',
      normalizedValue,
    };
  }
  
  // Rule 5: Check for junk patterns
  for (const pattern of JUNK_PATTERNS) {
    if (pattern.test(normalizedValue)) {
      return {
        isValid: false,
        error: 'Please enter a real name so we can reach you.',
        normalizedValue,
      };
    }
  }
  
  // Rule 6: Check for repeated junk patterns like "asdf asdf"
  for (const pattern of REPEATED_JUNK_PATTERNS) {
    if (pattern.test(normalizedValue)) {
      return {
        isValid: false,
        error: 'Please enter a real name so we can reach you.',
        normalizedValue,
      };
    }
  }
  
  // Rule 7: Check for keyboard mash
  if (isKeyboardMash(normalizedValue)) {
    return {
      isValid: false,
      error: 'Please enter a real name so we can reach you.',
      normalizedValue,
    };
  }
  
  // Rule 8: Check for repeated patterns
  if (isRepeatedPattern(normalizedValue)) {
    return {
      isValid: false,
      error: 'Please enter a real name so we can reach you.',
      normalizedValue,
    };
  }
  
  // Rule 9: Check minimum 2 words (first + last name)
  const wordCount = countWords(normalizedValue);
  if (wordCount < 2) {
    // Allow single word if 6+ characters (some cultures have single names)
    if (normalizedValue.length < 6) {
      return {
        isValid: false,
        error: 'Please enter your first and last name.',
        normalizedValue,
      };
    }
    // Single word but 6+ chars - pass with warning
    return {
      isValid: true,
      warning: 'Please enter your full name (first + last) for a faster callback.',
      normalizedValue,
    };
  }
  
  // Soft check: All lowercase or all uppercase
  let warning: string | undefined;
  const isAllLower = normalizedValue === normalizedValue.toLowerCase() && /[a-z]/.test(normalizedValue);
  const isAllUpper = normalizedValue === normalizedValue.toUpperCase() && /[A-Z]/.test(normalizedValue);
  
  if (isAllLower || isAllUpper) {
    // This is a soft warning, not blocking
    warning = undefined; // Decided not to show this as it may be annoying
  }
  
  return {
    isValid: true,
    warning,
    normalizedValue,
  };
}
