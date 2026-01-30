-- 1. Create the music_library table
CREATE TABLE IF NOT EXISTS music_library (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    url TEXT NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE music_library ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies

-- Everyone can view the library (Students & Teachers)
CREATE POLICY "Authenticated users can view music library" ON music_library
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Only Teachers/Admins can insert
-- (Assuming we check if user has 'teacher' role in user_roles table)
CREATE POLICY "Teachers can add to music library" ON music_library
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND role IN ('teacher', 'admin')
        )
    );

-- Only Teachers/Admins can delete
CREATE POLICY "Teachers can delete from music library" ON music_library
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND role IN ('teacher', 'admin')
        )
    );
