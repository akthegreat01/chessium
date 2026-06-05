-- 1. Create global_messages table if not exists
CREATE TABLE IF NOT EXISTS public.global_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    content TEXT NOT NULL,
    channel TEXT NOT NULL DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Add channel column if table existed but column was missing
ALTER TABLE public.global_messages 
ADD COLUMN IF NOT EXISTS channel TEXT NOT NULL DEFAULT 'general';

-- 3. Enable RLS
ALTER TABLE public.global_messages ENABLE ROW LEVEL SECURITY;

-- 4. Recreate Policies to avoid duplicate errors
DROP POLICY IF EXISTS "Allow anyone to read messages" ON public.global_messages;
CREATE POLICY "Allow anyone to read messages"
ON public.global_messages
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to insert messages" ON public.global_messages;
CREATE POLICY "Allow authenticated users to insert messages"
ON public.global_messages
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 5. Create trigger function to clean old global messages per channel (keeps 50 latest per channel)
CREATE OR REPLACE FUNCTION public.clean_old_global_messages()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM public.global_messages
    WHERE id NOT IN (
        SELECT id
        FROM (
            SELECT id, ROW_NUMBER() OVER (PARTITION BY channel ORDER BY created_at DESC) as rn
            FROM public.global_messages
        ) t
        WHERE rn <= 50
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Recreate the trigger
DROP TRIGGER IF EXISTS trigger_clean_global_messages ON public.global_messages;
CREATE TRIGGER trigger_clean_global_messages
AFTER INSERT ON public.global_messages
FOR EACH STATEMENT
EXECUTE FUNCTION public.clean_old_global_messages();

-- 7. Add table to Realtime publication if not already added
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        -- Safely add the table to the publication if it's not already in it
        IF NOT EXISTS (
            SELECT 1 
            FROM pg_publication_rel pr 
            JOIN pg_class c ON pr.prrelid = c.oid 
            JOIN pg_publication p ON pr.prpubid = p.oid 
            WHERE p.pubname = 'supabase_realtime' AND c.relname = 'global_messages'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE public.global_messages;
        END IF;
    END IF;
END $$;
