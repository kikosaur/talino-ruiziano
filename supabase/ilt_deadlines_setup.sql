-- 1. Ensure extensions are enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create ilt_deadlines table
CREATE TABLE IF NOT EXISTS ilt_deadlines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  subject TEXT DEFAULT 'General',
  description TEXT,
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE ilt_deadlines ENABLE ROW LEVEL SECURITY;

-- 4. Policies
DROP POLICY IF EXISTS "Anyone can view deadlines" ON ilt_deadlines;
CREATE POLICY "Anyone can view deadlines" ON ilt_deadlines
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only teachers can manage deadlines" ON ilt_deadlines;
CREATE POLICY "Only teachers can manage deadlines" ON ilt_deadlines
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'teacher'
    )
  );

-- 5. Insert some default data
INSERT INTO ilt_deadlines (name, subject, description, deadline)
VALUES 
  ('Math Week 1', 'Mathematics', 'Basic algebraic expressions', NOW() + INTERVAL '7 days'),
  ('English Essay', 'English', 'Write a 500-word essay on a classic novel', NOW() + INTERVAL '10 days'),
  ('Science Lab', 'Science', 'Chemical reaction report', NOW() + INTERVAL '14 days')
ON CONFLICT (name) DO NOTHING;
