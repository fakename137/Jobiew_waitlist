import { promises as dns } from 'dns';

// List of common disposable/temporary email domains
const DISPOSABLE_EMAIL_DOMAINS = [
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'tempmail.com',
  'throwaway.email',
  'temp-mail.org',
  'getnada.com',
  'maildrop.cc',
  'yopmail.com',
  'sharklasers.com',
  'trashmail.com',
  'fakeinbox.com',
  'dispostable.com',
  'burnermail.io',
  'getairmail.com',
  'emailondeck.com',
  'mohmal.com',
  'guerrillamailblock.com',
  'spam4.me',
  'mintemail.com',
  'mytemp.email',
  'temp-mail.io',
  'tmpmail.net',
  'harakirimail.com',
  'jetable.org',
  'throwawaymail.com',
  'spamgourmet.com',
  'mailnesia.com',
  '33mail.com',
  'mailcatch.com',
  'getonemail.com',
  'fakemail.net',
];

// Enhanced email regex pattern
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

interface EmailValidationResult {
  valid: boolean;
  reason?: string;
}

/**
 * Validate email format using RFC 5322 compliant regex
 */
export function validateEmailFormat(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  // Basic format check
  if (!EMAIL_REGEX.test(email)) {
    return false;
  }
  
  // Additional checks
  const [localPart, domain] = email.split('@');
  
  // Check local part length (max 64 characters)
  if (localPart.length > 64) {
    return false;
  }
  
  // Check domain length (max 253 characters)
  if (domain.length > 253) {
    return false;
  }
  
  // Check for consecutive dots
  if (email.includes('..')) {
    return false;
  }
  
  // Check if domain has at least one dot
  if (!domain.includes('.')) {
    return false;
  }
  
  // Check for valid TLD (at least 2 characters)
  const tld = domain.split('.').pop();
  if (!tld || tld.length < 2) {
    return false;
  }
  
  return true;
}

/**
 * Check if email is from a disposable/temporary email service
 */
export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) {
    return false;
  }
  
  return DISPOSABLE_EMAIL_DOMAINS.includes(domain);
}

/**
 * Check if domain has valid MX records (can receive emails)
 */
export async function hasValidMXRecords(email: string): Promise<boolean> {
  // Check if we're in a Node.js environment (not edge runtime)
  if (typeof process === 'undefined' || !dns) {
    console.warn('DNS module not available, skipping MX record check');
    return true; // Fallback to allowing the email
  }

  try {
    const domain = email.split('@')[1];
    if (!domain) {
      return false;
    }
    
    const mxRecords = await dns.resolveMx(domain);
    return mxRecords && mxRecords.length > 0;
  } catch (error) {
    // DNS lookup failed - domain might not exist or have no MX records
    console.error('MX record lookup failed:', error);
    return false;
  }
}

/**
 * Comprehensive email validation
 * @param email - The email address to validate
 * @param checkMX - Whether to perform DNS MX record lookup (slower but more thorough)
 */
export async function validateEmail(
  email: string,
  checkMX: boolean = true
): Promise<EmailValidationResult> {
  // Normalize email
  const normalizedEmail = email.trim().toLowerCase();
  
  // Check format
  if (!validateEmailFormat(normalizedEmail)) {
    return {
      valid: false,
      reason: 'Invalid email format. Please enter a valid email address.',
    };
  }
  
  // Check for disposable emails
  if (isDisposableEmail(normalizedEmail)) {
    return {
      valid: false,
      reason: 'Temporary or disposable email addresses are not allowed. Please use a permanent email address.',
    };
  }
  
  // Check for common typos in popular domains
  const domain = normalizedEmail.split('@')[1];
  const commonTypos: Record<string, string> = {
    'gmial.com': 'gmail.com',
    'gmai.com': 'gmail.com',
    'gnail.com': 'gmail.com',
    'yahooo.com': 'yahoo.com',
    'yaho.com': 'yahoo.com',
    'outlok.com': 'outlook.com',
    'hotmial.com': 'hotmail.com',
  };
  
  if (commonTypos[domain]) {
    return {
      valid: false,
      reason: `Did you mean ${normalizedEmail.replace(domain, commonTypos[domain])}?`,
    };
  }
  
  // Optionally check MX records
  if (checkMX) {
    const hasMX = await hasValidMXRecords(normalizedEmail);
    if (!hasMX) {
      return {
        valid: false,
        reason: 'This email domain cannot receive emails. Please check your email address.',
      };
    }
  }
  
  return { valid: true };
}

/**
 * Quick synchronous validation (without MX check)
 */
export function validateEmailQuick(email: string): EmailValidationResult {
  const normalizedEmail = email.trim().toLowerCase();
  
  if (!validateEmailFormat(normalizedEmail)) {
    return {
      valid: false,
      reason: 'Invalid email format. Please enter a valid email address.',
    };
  }
  
  if (isDisposableEmail(normalizedEmail)) {
    return {
      valid: false,
      reason: 'Temporary or disposable email addresses are not allowed.',
    };
  }
  
  return { valid: true };
}

