-- ============================================================
-- FIX DB COLUMNS, RLS POLICIES, SIGNUP TRIGGERS, AND BACKFILL PROFILES
-- ============================================================

-- 1. Safely add missing columns to games and analyses tables if they were skipped during table creation
DO $$
BEGIN
  -- Alter public.games to add missing columns
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'games') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'games' AND column_name = 'user_id') THEN
      ALTER TABLE public.games ADD COLUMN user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'games' AND column_name = 'opponent_type') THEN
      ALTER TABLE public.games ADD COLUMN opponent_type TEXT CHECK (opponent_type IN ('bot', 'import'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'games' AND column_name = 'bot_rating') THEN
      ALTER TABLE public.games ADD COLUMN bot_rating INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'games' AND column_name = 'bot_name') THEN
      ALTER TABLE public.games ADD COLUMN bot_name TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'games' AND column_name = 'user_color') THEN
      ALTER TABLE public.games ADD COLUMN user_color TEXT CHECK (user_color IN ('white', 'black'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'games' AND column_name = 'time_control') THEN
      ALTER TABLE public.games ADD COLUMN time_control TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'games' AND column_name = 'opening_name') THEN
      ALTER TABLE public.games ADD COLUMN opening_name TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'games' AND column_name = 'opening_eco') THEN
      ALTER TABLE public.games ADD COLUMN opening_eco TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'games' AND column_name = 'source') THEN
      ALTER TABLE public.games ADD COLUMN source TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'games' AND column_name = 'accuracy') THEN
      ALTER TABLE public.games ADD COLUMN accuracy NUMERIC(5,2);
    END IF;
  END IF;

  -- Alter public.analyses to add missing columns
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'analyses') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'analyses' AND column_name = 'user_id') THEN
      ALTER TABLE public.analyses ADD COLUMN user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'analyses' AND column_name = 'pgn') THEN
      ALTER TABLE public.analyses ADD COLUMN pgn TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'analyses' AND column_name = 'white_player') THEN
      ALTER TABLE public.analyses ADD COLUMN white_player TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'analyses' AND column_name = 'black_player') THEN
      ALTER TABLE public.analyses ADD COLUMN black_player TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'analyses' AND column_name = 'result') THEN
      ALTER TABLE public.analyses ADD COLUMN result TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'analyses' AND column_name = 'summary') THEN
      ALTER TABLE public.analyses ADD COLUMN summary TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'analyses' AND column_name = 'is_public') THEN
      ALTER TABLE public.analyses ADD COLUMN is_public BOOLEAN DEFAULT FALSE;
    END IF;
  END IF;
END $$;


-- 2. Safely drop and recreate RLS policies using a PL/pgSQL block to check if tables exist
DO $$
BEGIN
  -- Profiles Policies
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles';
    EXECUTE 'DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles';
    EXECUTE 'DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles';
    
    EXECUTE 'CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true)';
    EXECUTE 'CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id)';
    EXECUTE 'CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id)';
  END IF;

  -- Games Policies
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'games') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can view own games" ON public.games';
    EXECUTE 'DROP POLICY IF EXISTS "Users can create own games" ON public.games';
    EXECUTE 'DROP POLICY IF EXISTS "Users can update own games" ON public.games';
    EXECUTE 'DROP POLICY IF EXISTS "Users can delete own games" ON public.games';

    EXECUTE 'CREATE POLICY "Users can view own games" ON public.games FOR SELECT USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "Users can create own games" ON public.games FOR INSERT WITH CHECK (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "Users can update own games" ON public.games FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "Users can delete own games" ON public.games FOR DELETE USING (auth.uid() = user_id)';
  END IF;

  -- Analyses Policies
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'analyses') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can view own or public analyses" ON public.analyses';
    EXECUTE 'DROP POLICY IF EXISTS "Anyone can create analyses" ON public.analyses';
    EXECUTE 'DROP POLICY IF EXISTS "Users can update own analyses" ON public.analyses';
    EXECUTE 'DROP POLICY IF EXISTS "Users can delete own analyses" ON public.analyses';

    EXECUTE 'CREATE POLICY "Users can view own or public analyses" ON public.analyses FOR SELECT USING (auth.uid() = user_id OR is_public = TRUE OR user_id IS NULL)';
    EXECUTE 'CREATE POLICY "Anyone can create analyses" ON public.analyses FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL)';
    EXECUTE 'CREATE POLICY "Users can update own analyses" ON public.analyses FOR UPDATE USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "Users can delete own analyses" ON public.analyses FOR DELETE USING (auth.uid() = user_id)';
  END IF;

  -- Opening Repertoires Policies
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'opening_repertoires') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can manage own repertoires" ON public.opening_repertoires';
    EXECUTE 'CREATE POLICY "Users can manage own repertoires" ON public.opening_repertoires FOR ALL USING (auth.uid() = user_id)';
  END IF;

  -- Statistics Policies
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'statistics') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can manage own statistics" ON public.statistics';
    EXECUTE 'CREATE POLICY "Users can manage own statistics" ON public.statistics FOR ALL USING (auth.uid() = user_id)';
  END IF;

  -- User Settings Policies
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_settings') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can manage own settings" ON public.user_settings';
    EXECUTE 'CREATE POLICY "Users can manage own settings" ON public.user_settings FOR ALL USING (auth.uid() = user_id)';
  END IF;
END $$;


-- 3. Create a robust handle_new_user trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  attempts INT := 0;
BEGIN
  -- Determine base username
  base_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    split_part(NEW.email, '@', 1),
    'user'
  );
  
  -- Sanitize username (alphanumeric and underscores)
  base_username := regexp_replace(base_username, '[^a-zA-Z0-9_]', '', 'g');
  IF length(base_username) < 3 THEN
    base_username := base_username || '_' || substring(NEW.id::text, 1, 8);
  END IF;

  final_username := base_username;
  
  -- Handle potential username collision
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) AND attempts < 10 LOOP
    final_username := base_username || '_' || (floor(random() * 9000) + 1000)::text;
    attempts := attempts + 1;
  END LOOP;

  -- Insert profile
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    final_username,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'username', final_username)
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    username = EXCLUDED.username,
    display_name = EXCLUDED.display_name;

  -- Insert user settings
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_settings') THEN
    INSERT INTO public.user_settings (user_id) 
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-attach trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 4. Backfill profiles for all existing users in auth.users
DO $$
DECLARE
  user_rec RECORD;
  base_username TEXT;
  final_username TEXT;
  attempts INT;
BEGIN
  FOR user_rec IN SELECT id, email, raw_user_meta_data FROM auth.users LOOP
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = user_rec.id) THEN
      attempts := 0;
      base_username := COALESCE(
        user_rec.raw_user_meta_data->>'username',
        split_part(user_rec.email, '@', 1),
        'user'
      );
      base_username := regexp_replace(base_username, '[^a-zA-Z0-9_]', '', 'g');
      IF length(base_username) < 3 THEN
        base_username := base_username || '_' || substring(user_rec.id::text, 1, 8);
      END IF;

      final_username := base_username;
      
      WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) AND attempts < 10 LOOP
        final_username := base_username || '_' || (floor(random() * 9000) + 1000)::text;
        attempts := attempts + 1;
      END LOOP;

      INSERT INTO public.profiles (id, username, display_name)
      VALUES (
        user_rec.id,
        final_username,
        COALESCE(user_rec.raw_user_meta_data->>'display_name', user_rec.raw_user_meta_data->>'username', final_username)
      )
      ON CONFLICT (id) DO NOTHING;

      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_settings') THEN
        INSERT INTO public.user_settings (user_id)
        VALUES (user_rec.id)
        ON CONFLICT (user_id) DO NOTHING;
      END IF;
    END IF;
  END LOOP;
END;
$$;
