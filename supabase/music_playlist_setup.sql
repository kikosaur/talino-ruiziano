-- 1. Create the user_playlists table
CREATE TABLE IF NOT EXISTS user_playlists (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE user_playlists ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies

-- Users can view ONLY their own playlists
CREATE POLICY "Users can view own playlist" ON user_playlists
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert into their own playlist
CREATE POLICY "Users can add to own playlist" ON user_playlists
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can delete details from their own playlist
CREATE POLICY "Users can remove from own playlist" ON user_playlists
    FOR DELETE
    USING (auth.uid() = user_id);

-- 4. Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_playlists_user_id ON user_playlists(user_id);
