-- Add is_archived column to ilt_deadlines table
ALTER TABLE ilt_deadlines 
ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT FALSE;

-- Update existing records to have is_archived = FALSE (redundant with default but good for clarity)
UPDATE ilt_deadlines 
SET is_archived = FALSE 
WHERE is_archived IS NULL;
