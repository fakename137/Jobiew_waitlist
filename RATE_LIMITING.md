# Rate Limiting Documentation

## Overview

This application implements IP-based rate limiting to prevent abuse and ensure fair usage of the waitlist signup system.

## Configuration

**Default Settings:**
- **Maximum Attempts:** 5 signups per IP address
- **Time Window:** 1 hour (60 minutes)
- **Block Duration:** 1 hour after limit is exceeded

## How It Works

### 1. **IP Detection**
The system extracts the client IP address from various proxy headers:
- `x-forwarded-for` (primary)
- `x-real-ip` (fallback)
- `cf-connecting-ip` (Cloudflare)

### 2. **Rate Limit Checking**
Before processing any signup:
1. Extract client IP address
2. Check if IP has exceeded the rate limit
3. If blocked, return HTTP 429 (Too Many Requests)
4. If allowed, proceed with signup

### 3. **Attempt Recording**
After a successful signup:
- Record the attempt timestamp
- Increment the counter for that IP
- Reset counter if time window has expired

### 4. **Automatic Cleanup**
- Old entries are automatically cleaned up periodically
- Entries older than the time window + block duration are removed

## API Response

### When Rate Limited (HTTP 429)
```json
{
  "success": false,
  "message": "Too many signup attempts. Please try again after 3:45:12 PM.",
  "resetTime": "2024-01-15T15:45:12.000Z"
}
```

### Normal Response (HTTP 200)
```json
{
  "success": true,
  "user": { ... },
  "message": "Successfully joined the waitlist!"
}
```

## Monitoring

### Check Rate Limit Statistics
**Endpoint:** `GET /api/rate-limit-stats`

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalTrackedIPs": 42,
    "config": {
      "maxAttempts": 5,
      "windowMs": 3600000,
      "blockDurationMs": 3600000
    }
  },
  "timestamp": "2024-01-15T14:30:00.000Z"
}
```

## Implementation Details

### Storage
- **Development/Single Server:** In-memory Map (current implementation)
- **Production/Distributed:** Consider using Redis or a database

### Benefits
1. **Prevents Abuse:** Stops automated bots from spamming signups
2. **Fair Usage:** Ensures legitimate users have equal access
3. **Resource Protection:** Prevents overwhelming the database and email service
4. **DDoS Mitigation:** Helps protect against denial-of-service attacks

### Limitations
1. **In-Memory Storage:** Rate limits reset on server restart
2. **Distributed Systems:** Won't work across multiple servers without shared storage
3. **VPN/Proxy:** Users can bypass by changing IP addresses

## Configuration Changes

To modify rate limit settings, edit `/src/lib/rate-limit.ts`:

```typescript
const RATE_LIMIT_CONFIG = {
  maxAttempts: 5,          // Change this for more/fewer attempts
  windowMs: 60 * 60 * 1000, // Change this for different time window
  blockDurationMs: 60 * 60 * 1000, // Change this for different block duration
};
```

## Production Recommendations

### 1. **Use Redis for Distributed Systems**
```typescript
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function checkRateLimit(ip: string) {
  const key = `rate_limit:${ip}`;
  const count = await redis.incr(key);
  
  if (count === 1) {
    await redis.expire(key, 3600); // 1 hour
  }
  
  return {
    isBlocked: count > 5,
    remainingAttempts: Math.max(0, 5 - count),
  };
}
```

### 2. **Add Logging and Monitoring**
- Log rate limit violations for security analysis
- Set up alerts for unusual patterns
- Track legitimate users being blocked

### 3. **Consider Different Limits for Different Actions**
- Stricter limits for signups
- More lenient limits for checking status
- No limits for public pages

### 4. **Whitelist Trusted IPs**
- Allow internal testing without rate limits
- Whitelist known partners or integrations

## Testing Rate Limiting

### Test Rate Limit
```bash
# Make 6 requests quickly (should get blocked on 6th)
for i in {1..6}; do
  curl -X POST http://localhost:3001/api/join-waitlist \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"test$i@example.com\"}"
  echo "\n---\n"
done
```

### Check Stats
```bash
curl http://localhost:3001/api/rate-limit-stats
```

## Security Considerations

1. **IP Spoofing:** Trust proxy headers only from trusted sources
2. **Shared IPs:** Corporate networks may share IPs (consider relaxing limits)
3. **IPv6:** Ensure proper handling of IPv6 addresses
4. **GDPR Compliance:** IP addresses are personal data in some jurisdictions

## Future Enhancements

- [ ] Implement Redis backend for production
- [ ] Add email-based rate limiting (in addition to IP)
- [ ] Implement progressive delays (exponential backoff)
- [ ] Add CAPTCHA for users who hit rate limits
- [ ] Whitelist/blacklist management UI
- [ ] Rate limit analytics dashboard

