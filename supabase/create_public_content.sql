-- Create public_content table to store editable data for public-facing pages
CREATE TABLE IF NOT EXISTS public.public_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL, -- e.g., 'program', 'bulletin', 'about_stat', 'about_value', 'about_contact'
    title TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb, -- Flexible storage for specific fields like icon, category, date, courses array
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Turn on RLS
ALTER TABLE public.public_content ENABLE ROW LEVEL SECURITY;

-- 1. Anyone can view public content (public route access)
CREATE POLICY "Anyone can view public content"
    ON public.public_content
    FOR SELECT
    USING (true);

-- 2. Only teachers can insert public content
CREATE POLICY "Only teachers can insert public content"
    ON public.public_content
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND role = 'teacher'
        )
    );

-- 3. Only teachers can update public content
CREATE POLICY "Only teachers can update public content"
    ON public.public_content
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND role = 'teacher'
        )
    );

-- 4. Only teachers can delete public content
CREATE POLICY "Only teachers can delete public content"
    ON public.public_content
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND role = 'teacher'
        )
    );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_public_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_public_content_timestamp
BEFORE UPDATE ON public.public_content
FOR EACH ROW
EXECUTE FUNCTION update_public_content_updated_at();

-- ==========================================
-- SEED INITIAL DATA (From hardcoded frontend files)
-- ==========================================

-- Seed Programs
INSERT INTO public.public_content (type, title, description, metadata) VALUES
('program', 'Junior High School', 'Comprehensive curriculum for grades 7-10, building strong academic foundations.', '{"duration": "4 Years", "students": "500+", "icon": "📚", "courses": ["Mathematics", "Science", "English", "Filipino", "Social Studies", "TLE", "MAPEH"]}'),
('program', 'Senior High School - STEM', 'Science, Technology, Engineering, and Mathematics track for future innovators.', '{"duration": "2 Years", "students": "200+", "icon": "🔬", "courses": ["General Physics", "General Chemistry", "Pre-Calculus", "Basic Calculus", "Research"]}'),
('program', 'Senior High School - ABM', 'Accountancy, Business, and Management track for future business leaders.', '{"duration": "2 Years", "students": "180+", "icon": "💼", "courses": ["Business Math", "Accounting", "Business Finance", "Marketing", "Entrepreneurship"]}'),
('program', 'Senior High School - HUMSS', 'Humanities and Social Sciences track for future educators and public servants.', '{"duration": "2 Years", "students": "150+", "icon": "📖", "courses": ["Creative Writing", "Philippine Politics", "Community Engagement", "Social Science"]}'),
('program', 'Senior High School - GAS', 'General Academic Strand for students exploring various career paths.', '{"duration": "2 Years", "students": "120+", "icon": "🎯", "courses": ["Humanities", "Social Sciences", "Applied Economics", "Organization & Management"]}'),
('program', 'Senior High School - TVL', 'Technical-Vocational-Livelihood track for hands-on career preparation.', '{"duration": "2 Years", "students": "100+", "icon": "🛠️", "courses": ["Computer Systems Servicing", "Cookery", "Electrical Installation", "Welding"]}');

-- Seed Bulletins
INSERT INTO public.public_content (type, title, description, metadata) VALUES
('bulletin', 'Enrollment for SY 2026-2027 Now Open', 'We are excited to announce that enrollment for the upcoming school year is now open. Early bird registrants will receive a 10% discount on tuition fees. Visit the registrar''s office or enroll online through our student portal.', '{"category": "Announcement", "date": "2026-01-28T00:00:00.000Z", "pinned": true, "icon": "📢"}'),
('bulletin', 'Congratulations to Our Math Olympiad Winners!', 'Our students brought home 3 gold, 5 silver, and 7 bronze medals from the Regional Mathematics Olympiad. Special recognition goes to Juan Dela Cruz for placing 1st overall. Way to go, Ruizianos!', '{"category": "Achievement", "date": "2026-01-25T00:00:00.000Z", "pinned": true, "icon": "🏆"}'),
('bulletin', 'ILT Week 4 Submission Deadline Reminder', 'This is a reminder that ILT Week 4: Data Collection assignments are due on February 5, 2026. Please submit your work through the Talino-Ruiziano portal. Late submissions will incur a 10-point deduction.', '{"category": "Academic", "date": "2026-01-27T00:00:00.000Z", "pinned": false, "icon": "📚"}'),
('bulletin', 'Foundation Week Activities Schedule', 'Join us for Foundation Week from February 10-14, 2026! Activities include: Quiz Bee, Sports Fest, Talent Show, and the Foundation Day Program. Sign-ups are now open at the Student Affairs Office.', '{"category": "Event", "date": "2026-01-20T00:00:00.000Z", "pinned": false, "icon": "🎉"}'),
('bulletin', 'Parent-Teacher Conference Schedule', 'The 2nd Quarter Parent-Teacher Conference will be held on February 8, 2026 from 8:00 AM to 5:00 PM. Parents are encouraged to meet with their child''s advisers to discuss academic progress.', '{"category": "Event", "date": "2026-01-18T00:00:00.000Z", "pinned": false, "icon": "👨‍👩‍👧"}'),
('bulletin', 'Library Extended Hours During Exam Week', 'The school library will extend its operating hours from 6:00 AM to 10:00 PM during exam week (February 17-21). Take advantage of the quiet study environment and available resources.', '{"category": "Announcement", "date": "2026-01-15T00:00:00.000Z", "pinned": false, "icon": "📖"}');

-- Seed About Stats
INSERT INTO public.public_content (type, title, description, metadata) VALUES
('about_stat', 'Years of Excellence', '25+', '{"icon": "Award"}'),
('about_stat', 'Students Enrolled', '1,200+', '{"icon": "Users"}'),
('about_stat', 'Graduate Success Rate', '98%', '{"icon": "GraduationCap"}'),
('about_stat', 'Faculty Members', '80+', '{"icon": "BookOpen"}');

-- Seed About Values
INSERT INTO public.public_content (type, title, description, metadata) VALUES
('about_value', 'Excellence', 'Striving for the highest standards in education and personal development.', '{"icon": "Target"}'),
('about_value', 'Compassion', 'Nurturing a caring community that supports every student''s journey.', '{"icon": "Heart"}'),
('about_value', 'Collaboration', 'Fostering teamwork and partnerships for collective success.', '{"icon": "Users"}'),
('about_value', 'Innovation', 'Embracing new technologies and methods to enhance learning.', '{"icon": "BookOpen"}');

-- Seed About Contact
INSERT INTO public.public_content (type, title, description, metadata) VALUES
('about_contact', 'Address', 'San Bartolome (POB.), 3102 San Leonardo, Nueva Ecija, Philippines', '{"icon": "MapPin"}'),
('about_contact', 'Phone', 'N/A', '{"icon": "Phone"}'),
('about_contact', 'Email', 'slrdaacademics@gmail.com', '{"icon": "Mail"}');
