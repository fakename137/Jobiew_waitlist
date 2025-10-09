# JobHunt AI Waitlist

A modern waitlist website with a dynamic referral system that allows users to jump 3 spots ahead when they refer someone.

## Features

- 🎯 **Landing Page**: Clean, modern design with hero text and feature sections
- 📝 **Registration**: Simple email and name collection
- 🎉 **Success Page**: Dynamic referral system with leaderboard
- 🔗 **Referral System**: Users jump 3 spots when they refer someone
- 📊 **Leaderboard**: Real-time ranking of top referrers
- 📱 **Responsive**: Works perfectly on all devices
- ⚡ **Fast**: Built with Next.js 14 and optimized for performance

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Supabase (Database + Auth)
- **Email**: Resend (for notifications)
- **Deployment**: Vercel

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd waitlist-app
npm install
```

### 2. Set up Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Go to the SQL Editor and run the schema from `supabase-schema.sql`
3. Get your project URL and anon key from Settings > API
4. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
RESEND_API_KEY=your_resend_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set up Email Service (Optional)

1. Sign up for [Resend](https://resend.com)
2. Get your API key and add it to `.env.local`
3. Configure email templates in the Resend dashboard

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your waitlist website.

## Database Schema

The application uses two main tables:

### `waitlist_users`
- `id`: Unique identifier
- `email`: User's email address
- `name`: User's full name
- `referral_code`: Unique 6-character code for referrals
- `referred_by`: ID of the user who referred them
- `position`: Current position in waitlist
- `referrals_count`: Number of successful referrals
- `created_at`: Timestamp when user joined
- `updated_at`: Last update timestamp

### `referrals`
- `id`: Unique identifier
- `referrer_id`: ID of the user who made the referral
- `referred_id`: ID of the user who was referred
- `created_at`: Timestamp when referral was made

## How the Referral System Works

1. **User joins waitlist**: Gets assigned a position based on total users + 1
2. **User gets referral code**: 6-character unique code generated
3. **User shares referral link**: Link contains their referral code
4. **Someone uses referral link**: New user joins with referrer's code
5. **Referrer jumps 3 spots**: Their position decreases by 3
6. **Other users adjust**: Users between old and new positions move down by 1

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in your Vercel dashboard:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_APP_URL` (your production URL)

## Customization

### Branding
- Update the logo and brand name in the header components
- Change colors in `tailwind.config.js`
- Modify the hero text and feature descriptions

### Referral System
- Change the jump amount (currently 3 spots) in `src/lib/database.ts`
- Modify referral code length in `generateReferralCode()` function
- Update the leaderboard display logic

### Email Templates
- Customize email templates in your email service provider
- Add email notifications for new referrals
- Set up automated welcome emails

## Analytics

Consider adding:
- Google Analytics for traffic tracking
- Conversion rate monitoring
- A/B testing for different landing page versions
- User behavior tracking

## Support

For issues or questions:
1. Check the console for error messages
2. Verify your Supabase connection
3. Ensure all environment variables are set correctly
4. Check the database schema matches the SQL file

## License

MIT License - feel free to use this for your own projects!