interface ZeroBounceResult {
  valid: boolean;
  reason?: string;
  status?: string;
}

interface ZeroBounceResponse {
  status: string;
  address?: string;
  sub_status?: string;
  free_email?: boolean;
  did_you_mean?: string;
  account?: string;
  domain?: string;
  domain_age_days?: string;
  smtp_provider?: string;
  mx_found?: string;
  mx_record?: string;
  firstname?: string;
  lastname?: string;
  gender?: string;
  country?: string;
  region?: string;
  city?: string;
  zipcode?: string;
  processed_at?: string;
}

/**
 * Validate email using ZeroBounce API
 */
export async function validateEmailWithZeroBounce(email: string): Promise<ZeroBounceResult> {
  try {
    // Skip ZeroBounce validation in development if no API key
    if (process.env.NODE_ENV === 'development' && !process.env.ZEROBOUNCE_API_KEY) {
      console.log('ZeroBounce: Skipping validation in development (no API key)');
      return { valid: true };
    }

    if (!process.env.ZEROBOUNCE_API_KEY) {
      console.log('ZeroBounce: No API key provided, skipping validation');
      return { valid: true };
    }

    console.log(`ZeroBounce: Validating email ${email}`);
    
    const apiKey = process.env.ZEROBOUNCE_API_KEY;
    const response = await fetch(`https://api.zerobounce.net/v2/validate?api_key=${apiKey}&email=${encodeURIComponent(email)}&ip_address=`);
    
    if (!response.ok) {
      throw new Error(`ZeroBounce API error: ${response.status}`);
    }
    
    const data: ZeroBounceResponse = await response.json();
    console.log('ZeroBounce response:', data);

    // Check if API returned an error (invalid API key, out of credits, etc.)
    if ('error' in data) {
      console.log('ZeroBounce API error:', (data as Record<string, unknown>).error);
      // Skip validation on API errors (invalid key, out of credits, etc.)
      return { 
        valid: true, 
        reason: 'Email validation service unavailable, allowing email'
      };
    }

    // Map ZeroBounce status to our validation result
    switch (data.status) {
      case 'valid':
        return { 
          valid: true, 
          status: data.status,
          reason: 'Email is valid and deliverable'
        };
      
      case 'invalid':
        return { 
          valid: false, 
          status: data.status,
          reason: 'Email address is invalid and cannot receive emails'
        };
      
      case 'catch-all':
        return { 
          valid: false, 
          status: data.status,
          reason: 'Email domain accepts all emails (catch-all), cannot verify deliverability'
        };
      
      case 'spam':
        return { 
          valid: false, 
          status: data.status,
          reason: 'Email address is flagged as spam'
        };
      
      case 'do_not_mail':
        return { 
          valid: false, 
          status: data.status,
          reason: 'Email address is on do-not-mail list'
        };
      
      case 'unknown':
        return { 
          valid: false, 
          status: data.status,
          reason: 'Unable to verify email address'
        };
      
      case 'toxic':
        return { 
          valid: false, 
          status: data.status,
          reason: 'Email address contains toxic words'
        };
      
      case 'disposable':
        return { 
          valid: false, 
          status: data.status,
          reason: 'Email address is from a disposable/temporary email service'
        };
      
      case 'role':
        return { 
          valid: false, 
          status: data.status,
          reason: 'Email address is a role-based address (e.g., admin@, info@)'
        };
      
      case 'global_suppression':
        return { 
          valid: false, 
          status: data.status,
          reason: 'Email address is globally suppressed'
        };
      
      case 'timeout':
        return { 
          valid: false, 
          status: data.status,
          reason: 'Email validation timed out'
        };
      
      default:
        return { 
          valid: false, 
          status: data.status || 'unknown',
          reason: `Email validation failed with status: ${data.status}`
        };
    }
  } catch (error) {
    console.error('ZeroBounce validation error:', error);
    
    // In case of API errors, we'll be more lenient and allow the email
    // This prevents service outages from blocking legitimate users
    return { 
      valid: true, 
      reason: 'Email validation service temporarily unavailable, allowing email'
    };
  }
}

/**
 * Get ZeroBounce account credits
 */
export async function getZeroBounceCredits(): Promise<number> {
  try {
    if (!process.env.ZEROBOUNCE_API_KEY) {
      return 0;
    }

    const apiKey = process.env.ZEROBOUNCE_API_KEY;
    const response = await fetch(`https://api.zerobounce.net/v2/getcredits?api_key=${apiKey}`);
    
    if (!response.ok) {
      throw new Error(`ZeroBounce API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.credits || 0;
  } catch (error) {
    console.error('Error getting ZeroBounce credits:', error);
    return 0;
  }
}

/**
 * Get ZeroBounce API usage statistics
 */
export async function getZeroBounceUsage(): Promise<Record<string, unknown> | null> {
  try {
    if (!process.env.ZEROBOUNCE_API_KEY) {
      return null;
    }

    const apiKey = process.env.ZEROBOUNCE_API_KEY;
    const response = await fetch(`https://api.zerobounce.net/v2/getapiusage?api_key=${apiKey}`);
    
    if (!response.ok) {
      throw new Error(`ZeroBounce API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting ZeroBounce usage:', error);
    return null;
  }
}
