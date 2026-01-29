-- Enable RLS on submissions table
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to ensure clean state
DROP POLICY IF EXISTS "Users can view their own submissions" ON public.submissions;
DROP POLICY IF EXISTS "Users can insert their own submissions" ON public.submissions;
DROP POLICY IF EXISTS "Teachers can view all submissions" ON public.submissions;
DROP POLICY IF EXISTS "Teachers can update submissions" ON public.submissions;

-- Policy 1: Students can insert their own submissions
CREATE POLICY "Users can insert their own submissions"
ON public.submissions FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = user_id
);

-- Policy 2: Students can view their own submissions
CREATE POLICY "Users can view their own submissions"
ON public.submissions FOR SELECT
TO authenticated
USING (
    auth.uid() = user_id
);

-- Policy 3: Teachers can view ALL submissions
-- This uses the user_roles table to check if the current user is a teacher
CREATE POLICY "Teachers can view all submissions"
ON public.submissions FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
        AND role = 'teacher'
    )
);

-- Policy 4: Teachers can update submissions (grading)
CREATE POLICY "Teachers can update submissions"
ON public.submissions FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
        AND role = 'teacher'
    )
);
