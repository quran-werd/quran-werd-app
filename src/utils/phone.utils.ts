/**
 * Phone number formatting utilities
 */

/**
 * Formats a phone number string with appropriate formatting based on country code
 * Supports US/Canada (+1), Jordan (+962), Egypt (+20), and generic international format
 * 
 * @param text - The phone number string (digits only or with formatting)
 * @returns Formatted phone number string
 */
export const formatPhoneNumber = (text: string): string => {
  // Remove all non-digits
  const cleaned = text.replace(/\D/g, '');

  if (cleaned.length === 0) return '';

  // Handle different country code lengths
  // Try to detect country code (1-3 digits)
  let countryCode = '';
  let number = cleaned;

  // Common country codes: 1 (US/Canada), 20 (Egypt), 212 (Morocco), 962 (Jordan), etc.
  if (cleaned.startsWith('1') && cleaned.length > 1) {
    // US/Canada format: +1 (234) 567-8900
    countryCode = cleaned.slice(0, 1);
    number = cleaned.slice(1);
    if (number.length === 0) return `+${countryCode}`;
    if (number.length <= 3) return `+${countryCode} (${number}`;
    if (number.length <= 6)
      return `+${countryCode} (${number.slice(0, 3)}) ${number.slice(3)}`;
    return `+${countryCode} (${number.slice(0, 3)}) ${number.slice(
      3,
      6,
    )}-${number.slice(6, 10)}`;
  } else if (cleaned.startsWith('962') && cleaned.length > 3) {
    // Jordan format: +962 7 8535 2060
    countryCode = cleaned.slice(0, 3);
    number = cleaned.slice(3);
    if (number.length === 0) return `+${countryCode}`;
    if (number.length <= 1) return `+${countryCode} ${number}`;
    if (number.length <= 5)
      return `+${countryCode} ${number.slice(0, 1)} ${number.slice(1)}`;
    return `+${countryCode} ${number.slice(0, 1)} ${number.slice(
      1,
      5,
    )} ${number.slice(5, 9)}`;
  } else if (cleaned.startsWith('20') && cleaned.length > 2) {
    // Egypt format: +20 123 456 7890
    countryCode = cleaned.slice(0, 2);
    number = cleaned.slice(2);
    if (number.length === 0) return `+${countryCode}`;
    if (number.length <= 3) return `+${countryCode} ${number}`;
    if (number.length <= 6)
      return `+${countryCode} ${number.slice(0, 3)} ${number.slice(3)}`;
    return `+${countryCode} ${number.slice(0, 3)} ${number.slice(
      3,
      6,
    )} ${number.slice(6, 10)}`;
  } else if (cleaned.length <= 3) {
    // Generic format for short numbers (likely country code only)
    return `+${cleaned}`;
  } else {
    // Generic international format: +XXX XXX XXX XXXX
    // Try to detect country code (1-3 digits)
    if (cleaned.length <= 4) {
      return `+${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    } else if (cleaned.length <= 7) {
      return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(
        6,
      )}`;
    } else if (cleaned.length <= 10) {
      return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(
        6,
        9,
      )} ${cleaned.slice(9)}`;
    } else {
      return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(
        6,
        9,
      )} ${cleaned.slice(9, 13)}`;
    }
  }
};

