-- Session Tracking Setup for StudySpark
-- This script creates tables and functions to track user session time

-- =====================================================
-- 1. CREATE SESSION_LOGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS session_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  session_end TIMESTAMPTZ,
  duration_seconds INTEGER,
  page_views INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_session_user_id ON session_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_session_start ON session_logs(session_start);
CREATE INDEX IF NOT EXISTS idx_session_created_at ON session_logs(created_at);

-- =====================================================
-- 2. UPDATE PROFILES TABLE
-- =====================================================
-- Add session tracking columns to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS total_time_spent_seconds INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS session_count INTEGER DEFAULT 0;

-- =====================================================
-- 3. ENABLE ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE session_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own sessions" ON session_logs;
DROP POLICY IF EXISTS "Users can create own sessions" ON session_logs;
DROP POLICY IF EXISTS "Users can update own sessions" ON session_logs;
DROP POLICY IF EXISTS "Admins can view all sessions" ON session_logs;

-- Policy: Users can view their own sessions
CREATE POLICY "Users can view own sessions"
  ON session_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own sessions
CREATE POLICY "Users can create own sessions"
  ON session_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own sessions
CREATE POLICY "Users can update own sessions"
  ON session_logs FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Admins (teachers) can view all sessions
CREATE POLICY "Admins can view all sessions"
  ON session_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'teacher'
    )
  );

-- =====================================================
-- 4. AUTO-UPDATE TRIGGER FUNCTION
-- =====================================================
-- Drop existing function if it exists
DROP FUNCTION IF EXISTS update_profile_time_stats() CASCADE;

-- Function to update profile stats when session ends
CREATE OR REPLACE FUNCTION update_profile_time_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update if session has ended and has a duration
  IF NEW.session_end IS NOT NULL AND NEW.duration_seconds IS NOT NULL THEN
    UPDATE profiles
    SET 
      total_time_spent_seconds = COALESCE(total_time_spent_seconds, 0) + NEW.duration_seconds,
      last_active_at = NEW.session_end,
      session_count = COALESCE(session_count, 0) + 1
    WHERE user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS update_profile_stats_trigger ON session_logs;

CREATE TRIGGER update_profile_stats_trigger
AFTER UPDATE ON session_logs
FOR EACH ROW
WHEN (NEW.session_end IS NOT NULL AND OLD.session_end IS NULL)
EXECUTE FUNCTION update_profile_time_stats();

-- =====================================================
-- 5. HELPER FUNCTIONS
-- =====================================================

-- Function to get user's total time today
CREATE OR REPLACE FUNCTION get_user_time_today(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  total_seconds INTEGER;
BEGIN
  SELECT COALESCE(SUM(duration_seconds), 0)
  INTO total_seconds
  FROM session_logs
  WHERE user_id = p_user_id
    AND session_start >= CURRENT_DATE
    AND duration_seconds IS NOT NULL;
  
  RETURN total_seconds;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get average session duration for a user
CREATE OR REPLACE FUNCTION get_user_avg_session(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  avg_seconds INTEGER;
BEGIN
  SELECT COALESCE(AVG(duration_seconds)::INTEGER, 0)
  INTO avg_seconds
  FROM session_logs
  WHERE user_id = p_user_id
    AND duration_seconds IS NOT NULL;
  
  RETURN avg_seconds;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 6. DATA RETENTION (OPTIONAL)
-- =====================================================
-- Function to clean up old sessions (older than 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM session_logs
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- You can schedule this function to run periodically
-- For now, it can be called manually when needed

-- =====================================================
-- Setup complete!
-- =====================================================
