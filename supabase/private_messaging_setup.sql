-- Add private messaging support to the messages table

-- 1. Add recipient_id column
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'messages' AND column_name = 'recipient_id') THEN
        ALTER TABLE messages ADD COLUMN recipient_id UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- 2. Update RLS Policies
-- First, drop existing policies if they are too permissive
DROP POLICY IF EXISTS "Messages are viewable by everyone" ON messages;
DROP POLICY IF EXISTS "Anyone can insert messages" ON messages;
DROP POLICY IF EXISTS "Users can view all messages" ON messages;
DROP POLICY IF EXISTS "Authenticated users can insert messages" ON messages;

-- 3. Create new policies
-- View Policy: Users can see public messages OR messages they sent OR messages sent to them
CREATE POLICY "Users can view relevant messages" ON messages
    FOR SELECT
    USING (
        recipient_id IS NULL OR 
        auth.uid() = user_id OR 
        auth.uid() = recipient_id
    );

-- Insert Policy: Authenticated users can send messages
CREATE POLICY "Authenticated users can send messages" ON messages
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Optional: Enable RLS if not already enabled
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
