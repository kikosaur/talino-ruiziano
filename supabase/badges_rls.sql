-- Enable RLS on the badges table if not already enabled
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

-- Policy for anyone (authenticated or public depending on your setup, assuming public read for now) to read badges
DROP POLICY IF EXISTS "Public read access for badges" ON public.badges;
CREATE POLICY "Public read access for badges" ON public.badges
    FOR SELECT USING (true);

-- Policy for teachers to insert, update, delete badges. 
-- Assuming simple authenticated role check for now, matching app_settings. 
DROP POLICY IF EXISTS "Teachers can manage badges" ON public.badges;
CREATE POLICY "Teachers can manage badges" ON public.badges
    FOR ALL USING (auth.role() = 'authenticated');
