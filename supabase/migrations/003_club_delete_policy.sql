-- Allow club owners to delete their clubs
CREATE POLICY "Club owners can delete clubs" ON clubs FOR DELETE USING (auth.uid() = owner_id);
