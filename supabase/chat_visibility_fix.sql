-- FIX: Allow all authenticated users to view profiles (names/avatars)
-- Currently, policies might restrict viewing execution to only own profile.

-- 1. Drop existing restrictive policies on profiles if they exist
-- (We use broad names to catch common default policies)

-- Drop "Users can view their own profile" if we want to replace it with a broader one
-- OR better, just ADD a new broader policy.
-- Note: Supabase policies are OR-based. If ANY policy allows access, it's allowed.
-- So we just need to add a policy that allows "Authenticated users" to SELECT.

CREATE POLICY "Authenticated users can view all profiles for chat" ON profiles
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- 2. Allow viewing user roles (so we know who is a Teacher)
CREATE POLICY "Authenticated users can view all user roles for chat" ON user_roles
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- 3. Ensure 'messages' policies are correct (just in case)
-- (These typically exist from setup, but good to be sure)
-- Policies for messages were likely handled in private_messaging_setup.sql, 
-- but ensuring they can see each other's messages is handled by the "Users can view relevant messages" policy there.

-- 4. Enable RLS on these tables if not already (safeguard)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
