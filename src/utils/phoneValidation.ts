/**
 * Phone validation utility with India and Dubai specific rules
 */

// Indian cities that use India mobile validation rules
const INDIA_CITIES = ['hyderabad', 'delhi', 'mumbai', 'bengaluru', 'goa'];

/**
 * Normalize phone number to digits only
 * - Strips all non-digit characters
 * - For Indian cities: removes leading 91 country code and leading zeros
 */
export function normalizePhone(raw: string, city?: string): string {
  // Trim whitespace
  let digits = raw.trim();
  
  // Remove all non-digit characters
  digits = digits.replace(/\D/g, '');
  
  // For Indian cities, handle common user patterns
  const isIndianCity = city && INDIA_CITIES.includes(city.toLowerCase());
  
  if (isIndianCity) {
    // Remove leading 91 if present and length > 10
    if (digits.startsWith('91') && digits.length > 10) {
      digits = digits.slice(2);
    }
    
    // Remove leading zeros (users sometimes type 0xxxxxxxxxx)
    digits = digits.replace(/^0+/, '');
  }
  
  return digits;
}

/**
 * Check if all digits are identical (e.g., 0000000000, 1111111111)
 */
function isAllIdentical(digits: string): boolean {
  if (digits.length === 0) return false;
  const firstDigit = digits[0];
  return digits.split('').every(d => d === firstDigit);
}

/**
 * Check if digits form a strictly ascending sequence (e.g., 0123456789, 1234567890)
 */
function isAscendingSequence(digits: string): boolean {
  if (digits.length < 8) return false;
  
  // Check common ascending patterns
  const ascendingPatterns = [
    '0123456789',
    '1234567890',
    '12345678',
    '23456789',
    '34567890',
  ];
  
  for (const pattern of ascendingPatterns) {
    if (digits.includes(pattern) || digits === pattern.slice(0, digits.length)) {
      // Check if the entire string is sequential
      let isSequential = true;
      for (let i = 1; i < digits.length; i++) {
        const curr = parseInt(digits[i], 10);
        const prev = parseInt(digits[i - 1], 10);
        if (curr !== (prev + 1) % 10) {
          isSequential = false;
          break;
        }
      }
      if (isSequential) return true;
    }
  }
  
  // Direct check for strictly ascending
  let isSequential = true;
  for (let i = 1; i < digits.length; i++) {
    const curr = parseInt(digits[i], 10);
    const prev = parseInt(digits[i - 1], 10);
    if (curr !== (prev + 1) % 10) {
      isSequential = false;
      break;
    }
  }
  
  return isSequential;
}

/**
 * Check if digits form a strictly descending sequence (e.g., 9876543210, 0987654321)
 */
function isDescendingSequence(digits: string): boolean {
  if (digits.length < 8) return false;
  
  let isSequential = true;
  for (let i = 1; i < digits.length; i++) {
    const curr = parseInt(digits[i], 10);
    const prev = parseInt(digits[i - 1], 10);
    // Descending: prev should be curr + 1 (or wrap from 0 to 9)
    if (prev !== (curr + 1) % 10) {
      isSequential = false;
      break;
    }
  }
  
  return isSequential;
}

/**
 * Check for repeated 2-digit pattern (e.g., 1212121212, 9090909090)
 */
function isRepeated2DigitPattern(digits: string): boolean {
  if (digits.length < 6) return false;
  
  const pattern = digits.slice(0, 2);
  const expectedRepeats = Math.floor(digits.length / 2);
  const repeatedPattern = pattern.repeat(expectedRepeats);
  
  // Check if it matches (accounting for odd length)
  return digits.startsWith(repeatedPattern) && 
         (digits.length % 2 === 0 || digits === repeatedPattern + pattern[0]);
}

/**
 * Check if number is all zeros
 */
function isAllZeros(digits: string): boolean {
  return digits.length > 0 && digits.split('').every(d => d === '0');
}

/**
 * Validate phone number for Indian cities
 */
function validateIndiaPhone(digits: string): { valid: boolean; error?: string } {
  // Must be exactly 10 digits
  if (digits.length !== 10) {
    return { valid: false, error: 'Enter a valid 10-digit mobile number.' };
  }
  
  // Must start with 6, 7, 8, or 9
  const firstDigit = parseInt(digits[0], 10);
  if (firstDigit < 6) {
    return { valid: false, error: 'Enter a valid Indian mobile number (starts with 6–9).' };
  }
  
  // Check junk patterns
  if (isAllIdentical(digits)) {
    return { valid: false, error: 'Please enter a real phone number.' };
  }
  
  if (isAllZeros(digits)) {
    return { valid: false, error: 'Please enter a real phone number.' };
  }
  
  if (isAscendingSequence(digits)) {
    return { valid: false, error: 'Please enter a real phone number.' };
  }
  
  if (isDescendingSequence(digits)) {
    return { valid: false, error: 'Please enter a real phone number.' };
  }
  
  if (isRepeated2DigitPattern(digits)) {
    return { valid: false, error: 'Please enter a real phone number.' };
  }
  
  return { valid: true };
}

/**
 * Validate phone number for Dubai (generic international)
 */
function validateDubaiPhone(digits: string): { valid: boolean; error?: string } {
  // Must be between 8 and 15 digits
  if (digits.length < 8 || digits.length > 15) {
    return { valid: false, error: 'Enter a valid phone number (8–15 digits).' };
  }
  
  // Check junk patterns
  if (isAllIdentical(digits)) {
    return { valid: false, error: 'Enter a valid phone number (8–15 digits).' };
  }
  
  if (isAllZeros(digits)) {
    return { valid: false, error: 'Enter a valid phone number (8–15 digits).' };
  }
  
  if (isAscendingSequence(digits)) {
    return { valid: false, error: 'Enter a valid phone number (8–15 digits).' };
  }
  
  if (isDescendingSequence(digits)) {
    return { valid: false, error: 'Enter a valid phone number (8–15 digits).' };
  }
  
  return { valid: true };
}

/**
 * Main validation function - city-aware
 * Returns validation result with optional error message
 */
export function validatePhone(
  rawPhone: string,
  city?: string
): { valid: boolean; error?: string; normalizedDigits: string } {
  const trimmed = rawPhone.trim();
  
  // Check if empty
  if (!trimmed) {
    return { valid: false, error: 'Phone number is required.', normalizedDigits: '' };
  }
  
  // Normalize the phone number
  const digits = normalizePhone(trimmed, city);
  
  // Determine which validation rules to apply
  const isIndianCity = city && INDIA_CITIES.includes(city.toLowerCase());
  const isDubai = city?.toLowerCase() === 'dubai';
  
  let result: { valid: boolean; error?: string };
  
  if (isIndianCity) {
    result = validateIndiaPhone(digits);
  } else if (isDubai) {
    result = validateDubaiPhone(digits);
  } else {
    // Fallback: generic validation (same as Dubai rules)
    result = validateDubaiPhone(digits);
  }
  
  return {
    ...result,
    normalizedDigits: digits,
  };
}

/**
 * Check if we should show validation (after 4+ digits typed or on blur)
 */
export function shouldShowValidation(rawPhone: string): boolean {
  const digits = rawPhone.replace(/\D/g, '');
  return digits.length >= 4;
}
