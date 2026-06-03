-- Backfill profiles for existing users in auth.users who do not have a profile yet
INSERT INTO public.profiles (id, username, display_name)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'username', split_part(email, '@', 1), 'User_' || substring(id::text, 1, 8)),
  COALESCE(raw_user_meta_data->>'username', split_part(email, '@', 1), 'User_' || substring(id::text, 1, 8))
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- Backfill user_settings for any users missing settings
INSERT INTO public.user_settings (user_id)
SELECT id FROM auth.users
ON CONFLICT (user_id) DO NOTHING;
