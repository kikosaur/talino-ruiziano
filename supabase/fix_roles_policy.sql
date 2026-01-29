-- Enable RLS on user_roles (if not already)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing read policy to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Public can view roles" ON public.user_roles;

-- Allow users to view their OWN role
CREATE POLICY "Users can view their own role"
ON public.user_roles FOR SELECT
TO authenticated
USING (
    auth.uid() = user_id
);

-- Note: We might need a stricter policy if we want to prevent users from knowing who is teacher?
-- But for the logic to work, the user themself must be able to read their own role row.
