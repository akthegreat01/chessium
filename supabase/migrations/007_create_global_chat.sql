-- Create global messages table
CREATE TABLE IF NOT EXISTS public.global_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.global_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Allow everyone to read messages
CREATE POLICY "Allow anyone to read messages"
ON public.global_messages
FOR SELECT
TO public
USING (true);

-- Policy: Allow authenticated users to insert messages
CREATE POLICY "Allow authenticated users to insert messages"
ON public.global_messages
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Trigger to keep only the latest 50 messages (capped table)
CREATE OR REPLACE FUNCTION public.clean_old_global_messages()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM public.global_messages
    WHERE id NOT IN (
        SELECT id
        FROM public.global_messages
        ORDER BY created_at DESC
        LIMIT 50
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trigger_clean_global_messages
AFTER INSERT ON public.global_messages
FOR EACH STATEMENT
EXECUTE FUNCTION public.clean_old_global_messages();

-- Add table to Realtime publication
-- Try adding to supabase_realtime publication
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.global_messages;
    END IF;
END $$;
