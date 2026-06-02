-- ============================================================
-- CLUBS SCHEMA
-- ============================================================

CREATE TABLE IF NOT EXISTS clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clubs_slug ON clubs(slug);

CREATE TABLE IF NOT EXISTS club_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin', 'owner')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(club_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_club_members_club ON club_members(club_id);
CREATE INDEX IF NOT EXISTS idx_club_members_user ON club_members(user_id);

-- RLS
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_members ENABLE ROW LEVEL SECURITY;

-- Anyone can read clubs
CREATE POLICY "Clubs are viewable by everyone" ON clubs FOR SELECT USING (true);

-- Authenticated users can insert clubs
CREATE POLICY "Authenticated users can create clubs" ON clubs FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Club owners can update their clubs
CREATE POLICY "Club owners can update clubs" ON clubs FOR UPDATE USING (auth.uid() = owner_id);

-- Anyone can read club members
CREATE POLICY "Club members are viewable by everyone" ON club_members FOR SELECT USING (true);

-- Authenticated users can join clubs
CREATE POLICY "Authenticated users can join clubs" ON club_members FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Club owners/admins can remove members (simplified)
CREATE POLICY "Club admins can manage members" ON club_members FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM club_members admin_check 
    WHERE admin_check.club_id = club_members.club_id 
    AND admin_check.user_id = auth.uid() 
    AND admin_check.role IN ('admin', 'owner')
  ) OR auth.uid() = user_id -- Users can leave clubs themselves
);
