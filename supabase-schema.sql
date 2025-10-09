-- Create waitlist_users table
CREATE TABLE waitlist_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  invite_code VARCHAR(10),
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_waitlist_users_email ON waitlist_users(email);
CREATE INDEX idx_waitlist_users_invite_code ON waitlist_users(invite_code);
CREATE INDEX idx_waitlist_users_position ON waitlist_users(position);

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

-- Create policies for public access (since this is a waitlist signup)
CREATE POLICY "Allow public read access to waitlist_users" ON waitlist_users
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to waitlist_users" ON waitlist_users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to waitlist_users" ON waitlist_users
    FOR UPDATE USING (true);

