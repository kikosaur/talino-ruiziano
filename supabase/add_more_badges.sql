-- 1. Ensure extensions are enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Add unique constraint to badges name if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'badges_name_key') THEN
        ALTER TABLE badges ADD CONSTRAINT badges_name_key UNIQUE (name);
    END IF;
END $$;

-- 3. Add more badges to fill the gallery
INSERT INTO badges (name, description, icon, required_points, required_submissions)
VALUES
  ('Early Bird', 'Submitted an assignment 3 days before deadline', 'Zap', 50, 1),
  ('Social Butterfly', 'Active in Peer Chat', 'MessageCircle', 30, NULL),
  ('On Fire', 'Maintained a 7-day streak', 'Flame', 100, NULL),
  ('Scholar', 'Earned 1000 total points', 'GraduationCap', 1000, NULL),
  ('Weekend Warrior', 'Logged in on a weekend', 'Calendar', 20, NULL)
ON CONFLICT (name) DO NOTHING;
