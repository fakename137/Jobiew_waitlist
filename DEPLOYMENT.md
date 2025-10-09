# Deployment Guide for JobHunt AI Waitlist

## Quick Start (5 minutes to live)

### 1. Set up Supabase Database

1. Go to [Supabase](https://supabase.com) and create a new project
2. Go to **SQL Editor** in your Supabase dashboard
3. Copy and paste the entire contents of `supabase-schema.sql`
4. Click **Run** to create the database tables
5. Go to **Settings > API** and copy:
   - Project URL
   - Anon public key
   - Service role key (keep this secret!)

### 2. Set up Email Service (Optional)

1. Sign up for [Resend](https://resend.com) (free tier available)
2. Get your API key from the dashboard
3. Add your domain for sending emails (optional for testing)

### 3. Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your GitHub repo
3. Add these environment variables in Vercel dashboard:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
RESEND_API_KEY=your_resend_api_key_here
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

4. Click **Deploy**

### 4. Test Your Waitlist

1. Visit your deployed URL
2. Try signing up with a test email
3. Check the success page and referral system
4. Test the referral flow with a different email

## Environment Variables Explained

| Variable | Purpose | Required |
|----------|---------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Database connection | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public database access | ✅ Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin database access | ✅ Yes |
| `RESEND_API_KEY` | Email notifications | ❌ Optional |
| `NEXT_PUBLIC_APP_URL` | Your domain for links | ✅ Yes |

## Customization Before Launch

### 1. Update Branding
- Change "JobHunt AI" to your startup name
- Update the logo in header components
- Modify colors in `tailwind.config.js`

### 2. Update Content
- Change hero text and sub-heading
- Update the 4 feature sections
- Customize email templates in `src/lib/email.ts`

### 3. Configure Analytics
- Add Google Analytics ID to track conversions
- Set up conversion goals in GA4
- Monitor referral performance

### 4. Set up Monitoring
- Add error tracking (Sentry)
- Set up uptime monitoring
- Configure alerts for high traffic

## Post-Launch Checklist

- [ ] Test all user flows
- [ ] Verify email delivery
- [ ] Check mobile responsiveness
- [ ] Test referral system
- [ ] Monitor database performance
- [ ] Set up backup strategy
- [ ] Plan launch announcement

## Scaling Considerations

### Database
- Monitor Supabase usage and limits
- Consider database indexing for large datasets
- Set up automated backups

### Performance
- Enable Vercel Edge Functions for global performance
- Optimize images and assets
- Monitor Core Web Vitals

### Email
- Upgrade Resend plan for higher volume
- Set up email templates
- Monitor deliverability rates

## Troubleshooting

### Common Issues

1. **Database connection errors**
   - Check Supabase URL and keys
   - Verify RLS policies are set correctly

2. **Email not sending**
   - Verify Resend API key
   - Check domain authentication
   - Review email templates

3. **Referral system not working**
   - Check database triggers
   - Verify position calculation logic
   - Test with different users

### Support Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Resend Documentation](https://resend.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## Security Best Practices

1. **Environment Variables**
   - Never commit `.env.local` to git
   - Use Vercel's environment variable system
   - Rotate keys regularly

2. **Database Security**
   - Enable RLS policies
   - Use service role key only on server
   - Monitor database access logs

3. **Email Security**
   - Use verified domains
   - Implement rate limiting
   - Monitor for abuse

## Launch Strategy

### Pre-Launch (1 week before)
- [ ] Set up analytics and tracking
- [ ] Create social media assets
- [ ] Prepare launch announcement
- [ ] Test with beta users

### Launch Day
- [ ] Announce on social media
- [ ] Send to email lists
- [ ] Post on relevant communities
- [ ] Monitor for issues

### Post-Launch (1 week after)
- [ ] Analyze conversion metrics
- [ ] Gather user feedback
- [ ] Optimize based on data
- [ ] Plan next features

## Success Metrics to Track

- **Conversion Rate**: Visitors to signups
- **Referral Rate**: % of users who refer others
- **Viral Coefficient**: Average referrals per user
- **Email Open Rate**: Engagement with notifications
- **Position Movement**: How fast users move up

## Next Steps After Launch

1. **Product Development**
   - Build your actual product
   - Keep waitlist engaged with updates
   - Plan beta testing program

2. **Marketing**
   - Content marketing strategy
   - Social media presence
   - Community building

3. **Analytics**
   - A/B test different landing pages
   - Optimize conversion funnels
   - Track user behavior patterns

Your waitlist is now ready to launch! 🚀

