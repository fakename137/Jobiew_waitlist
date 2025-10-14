# Resend Email Configuration - Production Setup

## Issue: Emails Only Sending to One Address

If Resend is only sending emails to `jayanth.sms.in@gmail.com`, you're likely in **sandbox mode**. Here's how to fix it:

---

## 🔧 Solution Steps

### Option 1: Verify Your Domain (Recommended for Production)

1. **Go to Resend Dashboard**
   - Visit: https://resend.com/domains
   - Click "Add Domain"

2. **Add Your Domain**
   - Enter your domain (e.g., `jobiew.com`)
   - Resend will provide DNS records

3. **Add DNS Records**
   Add these records to your domain DNS:
   ```
   Type: TXT
   Name: @
   Value: [Resend verification code]
   
   Type: MX
   Name: @
   Value: feedback-smtp.resend.com
   Priority: 10
   
   Type: TXT
   Name: _dmarc
   Value: [Resend DMARC record]
   ```

4. **Verify Domain**
   - Click "Verify" in Resend dashboard
   - May take up to 24 hours for DNS propagation

5. **Update Email Sender**
   Change in `/src/app/api/join-waitlist/route.ts`:
   ```typescript
   from: 'Jobiew <noreply@jobiew.com>',  // Use your verified domain
   ```

---

### Option 2: Add More Test Emails (Development)

If you're still testing and don't have a domain yet:

1. **Go to Resend Dashboard**
   - Visit: https://resend.com/settings/emails

2. **Add Email Addresses**
   - Click "Add Email"
   - Enter email addresses you want to test with
   - Verify each email via confirmation link

3. **Sandbox Limitations**
   - Can only send to verified emails
   - Limited to 100 emails/day
   - Shows "via resend.dev" in sender

---

### Option 3: Use Resend's Test Mode (Temporary)

For testing without verification:

```typescript
// Add this check in join-waitlist/route.ts
const isDevelopment = process.env.NODE_ENV === 'development';

if (isDevelopment) {
  console.log('Development mode: Email would be sent to:', result.user.email);
  console.log('Email content:', {
    subject: `Welcome to Jobiew - You're #${result.user.position} in line!`,
    position: result.user.position,
    referralLink: referralLink,
  });
  // Skip actual email sending
} else {
  // Send real email
  await resend.emails.send({
    from: 'Jobiew <onboarding@resend.dev>',
    to: [result.user.email],
    subject: `Welcome to Jobiew - You're #${result.user.position} in line!`,
    react: WaitlistEmailTemplate({
      position: result.user.position,
      totalUsers: result.totalUsers || result.user.position,
      inviteCode: result.user.invite_code || '',
      referralLink: referralLink,
    }),
  });
}
```

---

## 🔍 Check Current Status

Run this command to check your Resend configuration:

```bash
curl -X GET https://api.resend.com/domains \
  -H "Authorization: Bearer YOUR_RESEND_API_KEY"
```

Or check in Resend Dashboard:
- Go to https://resend.com/domains
- Look for your domain status
- "Verified" = Ready for production
- "Pending" = Needs DNS verification

---

## ⚡ Quick Fix for Testing

If you just want to test quickly, update the code to override the recipient:

```typescript
// Temporary override for testing
const isTestMode = process.env.RESEND_TEST_MODE === 'true';
const recipientEmail = isTestMode 
  ? 'jayanth.sms.in@gmail.com'  // Your verified email
  : result.user.email;

await resend.emails.send({
  from: 'Jobiew <onboarding@resend.dev>',
  to: [recipientEmail],
  subject: `Welcome to Jobiew - You're #${result.user.position} in line!`,
  react: WaitlistEmailTemplate({
    position: result.user.position,
    totalUsers: result.totalUsers || result.user.position,
    inviteCode: result.user.invite_code || '',
    referralLink: referralLink,
  }),
});
```

Add to `.env.local`:
```bash
RESEND_TEST_MODE=true
```

---

## 🎯 Production Checklist

Before going live:

- [ ] Verify domain in Resend
- [ ] Update DNS records
- [ ] Test email delivery to external addresses
- [ ] Remove test mode flags
- [ ] Update `from` address to use your domain
- [ ] Set up email forwarding for replies
- [ ] Monitor bounce/spam rates in Resend dashboard
- [ ] Set up SPF, DKIM, DMARC records

---

## 📧 Best Practices

### 1. Use Proper Sender Domain
```typescript
// ✅ Good (verified domain)
from: 'Jobiew <hello@jobiew.com>'

// ❌ Bad (sandbox)
from: 'Jobiew <onboarding@resend.dev>'
```

### 2. Handle Email Failures Gracefully
```typescript
try {
  await resend.emails.send({ ... });
} catch (emailError) {
  // Don't fail signup if email fails
  console.error('Email failed:', emailError);
  // Still return success to user
}
```

### 3. Log Email Status
```typescript
const emailResult = await resend.emails.send({ ... });
console.log('Email sent:', {
  id: emailResult.id,
  to: result.user.email,
  status: 'sent'
});
```

---

## 🐛 Common Issues

### Issue: "Email not sent"
**Cause:** Resend API key missing or invalid

**Solution:**
```bash
# Check .env.local
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
```

### Issue: "Domain not verified"
**Cause:** DNS records not propagated

**Solution:**
- Wait 24-48 hours for DNS propagation
- Check DNS with: `dig TXT yourdomain.com`
- Use https://dnschecker.org to verify globally

### Issue: "Emails going to spam"
**Cause:** Missing SPF/DKIM/DMARC

**Solution:**
- Add all DNS records provided by Resend
- Send test emails to https://www.mail-tester.com
- Warm up domain by sending gradually

---

## 🔗 Useful Links

- **Resend Dashboard:** https://resend.com/dashboard
- **Resend Docs:** https://resend.com/docs
- **Domain Verification:** https://resend.com/docs/dashboard/domains/introduction
- **API Reference:** https://resend.com/docs/api-reference/emails/send-email

---

## 📊 Resend Pricing

- **Free Tier:** 100 emails/day, 3,000/month
- **Sandbox Mode:** Only verified emails
- **Production:** Requires verified domain
- **Cost:** $20/month for 50,000 emails

---

## ✅ Current Configuration

Check your current setup:

```bash
# In your project
cat .env.local | grep RESEND

# Should show:
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
```

**File:** `/src/app/api/join-waitlist/route.ts`
**Line:** 81
**Current sender:** `Jobiew <onboarding@resend.dev>`

**Action Required:**
1. Verify domain in Resend
2. Update sender to: `Jobiew <hello@yourdomain.com>`
3. Test with real user emails

---

Last Updated: 2025



