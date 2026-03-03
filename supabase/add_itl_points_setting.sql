-- Create app_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.app_settings (
    id SERIAL PRIMARY KEY,
    class_name TEXT NOT NULL DEFAULT 'BSIT Capstone Project',
    instructor_name TEXT NOT NULL DEFAULT 'Prof. Dela Cruz',
    course_description TEXT DEFAULT 'Capstone project management and submission system.',
    academic_year TEXT NOT NULL DEFAULT '2025-2026',
    semester TEXT NOT NULL DEFAULT 'First Semester',
    allow_late_submissions BOOLEAN DEFAULT TRUE,
    maintenance_mode BOOLEAN DEFAULT FALSE,
    itl_submission_points INTEGER NOT NULL DEFAULT 50,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default row if not exists (ensure singleton)
INSERT INTO public.app_settings (id, class_name)
VALUES (1, 'BSIT Capstone Project')
ON CONFLICT (id) DO NOTHING;

-- If the table already existed but was missing the itl_submission_points column, add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'app_settings'
        AND column_name = 'itl_submission_points'
    ) THEN
        ALTER TABLE public.app_settings ADD COLUMN itl_submission_points INTEGER NOT NULL DEFAULT 50;
    END IF;
END $$;

-- Enable RLS (safe to run multiple times)
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them safely
DROP POLICY IF EXISTS "Public read access for settings" ON public.app_settings;
DROP POLICY IF EXISTS "Teachers can update settings" ON public.app_settings;

-- Recreate Policies
CREATE POLICY "Public read access for settings" ON public.app_settings
    FOR SELECT USING (true);

CREATE POLICY "Teachers can update settings" ON public.app_settings
    FOR UPDATE USING (auth.role() = 'authenticated');
