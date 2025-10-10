# ZeroBounce Email Validation Setup

## Overview
ZeroBounce has been integrated into the email validation system to provide comprehensive email verification before users join the waitlist.

## Setup Instructions

### 1. Get ZeroBounce API Key
1. Sign up at [ZeroBounce](https://www.zerobounce.net/)
2. Get your API key from the dashboard
3. Add it to your environment variables

### 2. Environment Variables
Add the following to your `.env.local` file:

```bash
# Email Validation Service
ZEROBOUNCE_API_KEY=your_zerobounce_api_key
```

### 3. ZeroBounce Validation Features

The integration provides comprehensive email validation including:

- **Valid**: Email is valid and deliverable
- **Invalid**: Email address is invalid and cannot receive emails
- **Catch-all**: Email domain accepts all emails (not deliverable)
- **Spam**: Email address is flagged as spam
- **Do Not Mail**: Email address is on do-not-mail list
- **Unknown**: Unable to verify email address
- **Toxic**: Email address contains toxic words
- **Disposable**: Email address is from a disposable/temporary email service
- **Role**: Email address is a role-based address (e.g., admin@, info@)
- **Global Suppression**: Email address is globally suppressed
- **Timeout**: Email validation timed out

### 4. Fallback Behavior

- In development mode without API key: Validation is skipped
- On API errors: Email is allowed (prevents service outages from blocking users)
- ZeroBounce validation runs after basic format and MX record checks

### 5. Usage

The ZeroBounce validation is automatically integrated into the existing email validation flow:

```typescript
// In join-waitlist API route
const validationResult = await validateEmail(email, true);
// This now includes ZeroBounce validation
```

### 6. Monitoring

You can check ZeroBounce usage and credits:

```typescript
import { getZeroBounceCredits, getZeroBounceUsage } from '@/lib/zerobounce';

const credits = await getZeroBounceCredits();
const usage = await getZeroBounceUsage();
```

### 7. Cost Considerations

- ZeroBounce charges per email validation
- Consider implementing caching for repeated validations
- Monitor usage to avoid unexpected charges

### 8. Testing

- Test with various email types (valid, invalid, disposable, etc.)
- Verify error messages are user-friendly
- Ensure fallback behavior works correctly

## Benefits

1. **Reduced Bounce Rate**: Only valid, deliverable emails are accepted
2. **Spam Protection**: Blocks spam and toxic email addresses
3. **Professional Quality**: Maintains high-quality email list
4. **Comprehensive Coverage**: Catches edge cases basic validation misses
