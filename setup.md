# Quick Setup Guide

## 1. Create Environment File

Create a `.env.local` file in the root directory with:

```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Email Service (Optional - will work without this)
RESEND_API_KEY=your_resend_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 2. Set up Supabase (5 minutes)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to **SQL Editor** in your dashboard
3. Copy the entire contents of `supabase-schema.sql` and paste it
4. Click **Run** to create the database tables
5. Go to **Settings > API** and copy your keys to `.env.local`

## 3. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` to see your waitlist!

## 4. Test the Flow

1. Go to the landing page
2. Enter an email and click "Join the waitlist"
3. Fill out the credentials form
4. See the success page with referral system
5. Test the referral system with a different email

## 5. Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repo
3. Add the same environment variables in Vercel dashboard
4. Deploy!

Your waitlist will be live in minutes! 🚀

