-- 1. Create the bucket (handle case where it exists)
-- This prevents "duplicate key" errors if you run it multiple times
INSERT INTO storage.buckets (id, name, public)
VALUES ('submissions', 'submissions', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Drop policies if they already exist so we can recreate them clean
DROP POLICY IF EXISTS "Authenticated users can upload submissions" ON storage.objects;
DROP POLICY IF EXISTS "Public Access to Submissions for Review" ON storage.objects;

-- 3. Create Upload Policy
-- Allows authenticated users to upload ONLY if the file path starts with their User ID
CREATE POLICY "Authenticated users can upload submissions"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'submissions' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Create Read Policy
-- Allows anyone to view the file (necessary for the app to display the link)
CREATE POLICY "Public Access to Submissions for Review"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'submissions' );
