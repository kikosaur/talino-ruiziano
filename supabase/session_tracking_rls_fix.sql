-- =====================================================
-- 3. ENABLE ROW LEVEL SECURITY (CORRECTED)
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
-- Note: This checks the user_roles table to see if the user is a teacher
CREATE POLICY "Admins can view all sessions"
  ON session_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'teacher'
    )
  );
