-- Enable RLS on user_badges if it isn't already
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own badges
DROP POLICY IF EXISTS "Users can read own badges" ON public.user_badges;
CREATE POLICY "Users can read own badges" ON public.user_badges
    FOR SELECT USING (auth.uid() = user_id);

-- Allow authenticated users to insert badges for themselves (when earned)
DROP POLICY IF EXISTS "Users can insert own badges" ON public.user_badges;
CREATE POLICY "Users can insert own badges" ON public.user_badges
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Optionally, give teachers full access to user_badges if they need to manually award/revoke
DROP POLICY IF EXISTS "Teachers can manage user_badges" ON public.user_badges;
CREATE POLICY "Teachers can manage user_badges" ON public.user_badges
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.role = 'teacher'
        )
    );
