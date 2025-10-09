# Email Validation System

This application implements comprehensive email validation to ensure only real, valid email addresses can join the waitlist.

## Features

### 1. **Format Validation**
- RFC 5322 compliant email regex
- Checks local part length (max 64 characters)
- Checks domain length (max 253 characters)
- Prevents consecutive dots
- Requires valid TLD (minimum 2 characters)

### 2. **Disposable Email Detection**
Blocks 30+ common temporary/disposable email services including:
- 10minutemail.com
- guerrillamail.com
- mailinator.com
- tempmail.com
- throwaway.email
- And many more...

### 3. **DNS MX Record Verification**
- Performs DNS lookup to verify the domain can receive emails
- Ensures the email domain has valid mail exchange servers
- Helps prevent typos and non-existent domains

### 4. **Common Typo Detection**
Catches and suggests corrections for common typos:
- gmial.com → gmail.com
- gmai.com → gmail.com
- gnail.com → gmail.com
- yahooo.com → yahoo.com
- outlok.com → outlook.com
- hotmial.com → hotmail.com

## Implementation

### Server-Side Validation
Located in `/src/lib/email-validation.ts`, the validation runs on every waitlist signup:

```typescript
import { validateEmail } from '@/lib/email-validation';

const validationResult = await validateEmail(email, true);
if (!validationResult.valid) {
  // Reject the signup with helpful error message
}
```

### Client-Side Validation
Provides immediate feedback as users type:
- Real-time format checking
- Instant disposable email detection
- Typo suggestions
- Visual feedback with red border

## API

### `validateEmail(email: string, checkMX: boolean = true)`
Comprehensive async validation with optional MX record checking.

**Returns:**
```typescript
{
  valid: boolean;
  reason?: string; // User-friendly error message if invalid
}
```

### `validateEmailQuick(email: string)`
Synchronous validation without DNS lookup (faster but less thorough).

### `validateEmailFormat(email: string)`
Basic format validation only.

### `isDisposableEmail(email: string)`
Check if email is from a disposable service.

### `hasValidMXRecords(email: string)`
Verify domain has MX records (can receive emails).

## Benefits

1. **Reduces Spam** - Blocks temporary email addresses
2. **Improves Data Quality** - Ensures valid, reachable emails
3. **Better User Experience** - Catches typos before submission
4. **Reduced Bounce Rate** - MX verification prevents invalid domains
5. **Security** - Prevents abuse from disposable email services

## Performance

- Client-side validation: Instant
- Server-side format & disposable check: < 10ms
- DNS MX lookup: ~100-500ms (cached by DNS servers)

The MX lookup adds minimal latency but significantly improves email quality.

## Extending

To add more disposable domains, update the `DISPOSABLE_EMAIL_DOMAINS` array in `/src/lib/email-validation.ts`.

To add more typo corrections, update the `commonTypos` object in the validation functions.

