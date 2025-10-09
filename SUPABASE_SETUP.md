# Supabase Setup Guide

## Step 1: Get Your API Keys

1. **Go to your Supabase project dashboard**: https://supabase.com/dashboard/project/rmjlkewtokhjelqytnqu
2. **Click on "Settings"** in the left sidebar
3. **Click on "API"** in the settings menu
4. **Copy these values:**
   - **Project URL**: `https://rmjlkewtokhjelqytnqu.supabase.co`
   - **Anon public key**: (starts with `eyJ...`)
   - **Service role key**: (starts with `eyJ...` - keep this secret!)

## Step 2: Set Up Database Tables

1. **Go to "SQL Editor"** in your Supabase dashboard
2. **Click "New Query"**
3. **Copy and paste this entire SQL code:**

```sql
-- Create waitlist_users table
CREATE TABLE waitlist_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  referral_code VARCHAR(10) UNIQUE NOT NULL,
  referred_by UUID REFERENCES waitlist_users(id),
  position INTEGER NOT NULL,
  referrals_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create referrals table for tracking referral relationships
CREATE TABLE referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL REFERENCES waitlist_users(id),
  referred_id UUID NOT NULL REFERENCES waitlist_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_waitlist_users_email ON waitlist_users(email);
CREATE INDEX idx_waitlist_users_referral_code ON waitlist_users(referral_code);
CREATE INDEX idx_waitlist_users_position ON waitlist_users(position);
CREATE INDEX idx_waitlist_users_referrals_count ON waitlist_users(referrals_count);
CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred_id ON referrals(referred_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_waitlist_users_updated_at 
    BEFORE UPDATE ON waitlist_users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE waitlist_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a waitlist signup)
CREATE POLICY "Allow public read access to waitlist_users" ON waitlist_users
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to waitlist_users" ON waitlist_users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to waitlist_users" ON waitlist_users
    FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to referrals" ON referrals
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to referrals" ON referrals
    FOR INSERT WITH CHECK (true);
```

4. **Click "Run"** to execute the SQL

## Step 3: Update Environment Variables

Once you have your API keys, update the `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://rmjlkewtokhjelqytnqu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
RESEND_API_KEY=your_resend_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3007
```

Replace `your_anon_key_here` and `your_service_role_key_here` with the actual keys from Step 1.

## Step 4: Test Your Setup

1. **Restart your development server:**
   ```bash
   npm run dev
   ```

2. **Visit your waitlist**: http://localhost:3007

3. **Test the flow:**
   - Enter an email and join the waitlist
   - Check if you see the success page
   - Test the referral system

## Step 5: Verify Database

1. **Go to "Table Editor"** in your Supabase dashboard
2. **Check the `waitlist_users` table** - you should see your test user
3. **Verify the referral system** by testing with different emails

Your waitlist is now fully functional! 🎉

