-- ============================================================
-- CHESSIUM DATABASE SCHEMA
-- Version: 1.0.0
-- Run this in the Supabase SQL Editor
-- ============================================================

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  chess_com_username TEXT,
  lichess_username TEXT,
  puzzle_rating INTEGER DEFAULT 1200,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  is_online BOOLEAN DEFAULT FALSE,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- ============================================================
-- GAMES (bot games + imported games)
-- ============================================================
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  opponent_type TEXT CHECK (opponent_type IN ('bot', 'import')),
  bot_rating INTEGER,
  bot_name TEXT,
  pgn TEXT NOT NULL,
  result TEXT CHECK (result IN ('1-0', '0-1', '1/2-1/2', '*')),
  user_color TEXT CHECK (user_color IN ('white', 'black')),
  time_control TEXT,
  opening_name TEXT,
  opening_eco TEXT,
  source TEXT, -- 'chessium', 'chess.com', 'lichess'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_games_user ON games(user_id);
CREATE INDEX IF NOT EXISTS idx_games_created ON games(user_id, created_at DESC);

-- ============================================================
-- ANALYSES (saved game analyses)
-- ============================================================
CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  pgn TEXT NOT NULL,
  white_player TEXT,
  black_player TEXT,
  result TEXT,
  white_accuracy NUMERIC(5,2),
  black_accuracy NUMERIC(5,2),
  opening_name TEXT,
  opening_eco TEXT,
  move_data JSONB,
  eval_data JSONB,
  critical_moments JSONB,
  is_public BOOLEAN DEFAULT FALSE,
  source TEXT, -- 'paste', 'upload', 'chess.com', 'lichess'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analyses_user ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_public ON analyses(is_public) WHERE is_public = TRUE;

-- ============================================================
-- PUZZLES
-- ============================================================
CREATE TABLE IF NOT EXISTS puzzles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fen TEXT NOT NULL,
  moves TEXT NOT NULL, -- Solution moves in UCI format, comma-separated
  rating INTEGER DEFAULT 1200,
  rating_deviation INTEGER DEFAULT 100,
  themes TEXT[] DEFAULT '{}',
  opening_tags TEXT[] DEFAULT '{}',
  is_daily BOOLEAN DEFAULT FALSE,
  daily_date DATE,
  plays INTEGER DEFAULT 0,
  pass_rate NUMERIC(5,2) DEFAULT 50.0,
  source TEXT DEFAULT 'custom',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_puzzles_rating ON puzzles(rating);
CREATE INDEX IF NOT EXISTS idx_puzzles_themes ON puzzles USING GIN(themes);
CREATE INDEX IF NOT EXISTS idx_puzzles_daily ON puzzles(daily_date) WHERE is_daily = TRUE;

-- ============================================================
-- PUZZLE ATTEMPTS
-- ============================================================
CREATE TABLE IF NOT EXISTS puzzle_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  puzzle_id UUID REFERENCES puzzles(id) ON DELETE CASCADE,
  solved BOOLEAN NOT NULL,
  time_taken INTEGER, -- milliseconds
  rating_before INTEGER,
  rating_after INTEGER,
  moves_made TEXT[], -- User's actual moves
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_puzzle_attempts_user ON puzzle_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_puzzle_attempts_puzzle ON puzzle_attempts(puzzle_id);

-- ============================================================
-- COURSES
-- ============================================================
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  cover_image TEXT,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  category TEXT,
  lessons JSONB NOT NULL DEFAULT '[]'::jsonb,
  lesson_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  is_free BOOLEAN DEFAULT TRUE,
  author_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);

-- ============================================================
-- COURSE PROGRESS
-- ============================================================
CREATE TABLE IF NOT EXISTS course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  completed_lessons TEXT[] DEFAULT '{}',
  current_lesson INTEGER DEFAULT 0,
  quiz_scores JSONB DEFAULT '{}'::jsonb,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_course_progress_user ON course_progress(user_id);

-- ============================================================
-- BLOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  author_id UUID REFERENCES profiles(id),
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_tags ON blogs USING GIN(tags);

-- ============================================================
-- COMMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_edited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_blog ON comments(blog_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id);

-- ============================================================
-- OPENING REPERTOIRES
-- ============================================================
CREATE TABLE IF NOT EXISTS opening_repertoires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT CHECK (color IN ('white', 'black')),
  moves_tree JSONB NOT NULL DEFAULT '{}'::jsonb,
  notes JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_repertoires_user ON opening_repertoires(user_id);

-- ============================================================
-- STATISTICS
-- ============================================================
CREATE TABLE IF NOT EXISTS statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  platform TEXT CHECK (platform IN ('chessium', 'chess.com', 'lichess')),
  rating_data JSONB DEFAULT '{}'::jsonb,
  accuracy_data JSONB DEFAULT '{}'::jsonb,
  opening_data JSONB DEFAULT '{}'::jsonb,
  games_played INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, platform)
);

CREATE INDEX IF NOT EXISTS idx_statistics_user ON statistics(user_id);

-- ============================================================
-- USER SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  board_theme TEXT DEFAULT 'green',
  piece_set TEXT DEFAULT 'classic',
  show_coordinates BOOLEAN DEFAULT TRUE,
  show_legal_moves BOOLEAN DEFAULT TRUE,
  move_animation BOOLEAN DEFAULT TRUE,
  sound_enabled BOOLEAN DEFAULT TRUE,
  auto_promote_queen BOOLEAN DEFAULT TRUE,
  premove_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE puzzles ENABLE ROW LEVEL SECURITY;
ALTER TABLE puzzle_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE opening_repertoires ENABLE ROW LEVEL SECURITY;
ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PROFILES POLICIES
-- ============================================================
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = id);

-- ============================================================
-- GAMES POLICIES
-- ============================================================
CREATE POLICY "Users can view own games"
  ON games FOR SELECT
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can create own games"
  ON games FOR INSERT
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own games"
  ON games FOR UPDATE
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own games"
  ON games FOR DELETE
  USING (user_id = (SELECT auth.uid()));

-- ============================================================
-- ANALYSES POLICIES
-- ============================================================
CREATE POLICY "Users can view own or public analyses"
  ON analyses FOR SELECT
  USING (user_id = (SELECT auth.uid()) OR is_public = TRUE OR user_id IS NULL);

CREATE POLICY "Anyone can create analyses"
  ON analyses FOR INSERT
  WITH CHECK (user_id = (SELECT auth.uid()) OR user_id IS NULL);

CREATE POLICY "Users can update own analyses"
  ON analyses FOR UPDATE
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own analyses"
  ON analyses FOR DELETE
  USING (user_id = (SELECT auth.uid()));

-- ============================================================
-- PUZZLES POLICIES
-- ============================================================
CREATE POLICY "Puzzles are viewable by everyone"
  ON puzzles FOR SELECT USING (true);

CREATE POLICY "Admins can manage puzzles"
  ON puzzles FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'
  ));

-- ============================================================
-- PUZZLE ATTEMPTS POLICIES
-- ============================================================
CREATE POLICY "Users can view own attempts"
  ON puzzle_attempts FOR SELECT
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can create attempts"
  ON puzzle_attempts FOR INSERT
  WITH CHECK (user_id = (SELECT auth.uid()));

-- ============================================================
-- COURSES POLICIES
-- ============================================================
CREATE POLICY "Published courses are viewable by everyone"
  ON courses FOR SELECT
  USING (is_published = TRUE);

CREATE POLICY "Admins can manage courses"
  ON courses FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'
  ));

-- ============================================================
-- COURSE PROGRESS POLICIES
-- ============================================================
CREATE POLICY "Users can manage own progress"
  ON course_progress FOR ALL
  USING (user_id = (SELECT auth.uid()));

-- ============================================================
-- BLOGS POLICIES
-- ============================================================
CREATE POLICY "Published blogs are viewable by everyone"
  ON blogs FOR SELECT
  USING (is_published = TRUE);

CREATE POLICY "Admins can manage all blogs"
  ON blogs FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'
  ));

-- ============================================================
-- COMMENTS POLICIES
-- ============================================================
CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  USING (user_id = (SELECT auth.uid()));

-- ============================================================
-- OPENING REPERTOIRES POLICIES
-- ============================================================
CREATE POLICY "Users can manage own repertoires"
  ON opening_repertoires FOR ALL
  USING (user_id = (SELECT auth.uid()));

-- ============================================================
-- STATISTICS POLICIES
-- ============================================================
CREATE POLICY "Users can manage own statistics"
  ON statistics FOR ALL
  USING (user_id = (SELECT auth.uid()));

-- ============================================================
-- USER SETTINGS POLICIES
-- ============================================================
CREATE POLICY "Users can manage own settings"
  ON user_settings FOR ALL
  USING (user_id = (SELECT auth.uid()));

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  INSERT INTO public.user_settings (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_blogs_updated_at
  BEFORE UPDATE ON blogs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
