import { createClient } from "@/lib/supabase/server";

export interface Club {
  id: string;
  name: string;
  slug: string;
  description: string;
  owner_id: string;
  member_count: number;
}

export async function getClubs(): Promise<Club[]> {
  const supabase = await createClient();
  
  // Fetch clubs and count their members
  const { data, error } = await supabase
    .from("clubs")
    .select(`
      *,
      member_count:club_members(count)
    `)
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error("Error fetching clubs:", error);
    return [];
  }

  return data.map((c: any) => ({
    ...c,
    member_count: c.member_count[0]?.count || 0
  }));
}

export async function getClubBySlug(slug: string): Promise<Club | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("clubs")
    .select(`
      *,
      member_count:club_members(count)
    `)
    .eq("slug", slug)
    .single();

  if (error || !data) return null;

  return {
    ...data,
    member_count: data.member_count[0]?.count || 0
  };
}

export async function getClubMembers(clubId: string) {
  const supabase = await createClient();
  
  // We need to fetch club members and join with profiles to get chess_com_username
  const { data, error } = await supabase
    .from("club_members")
    .select(`
      id,
      user_id,
      role,
      profiles (
        username,
        chess_com_username
      )
    `)
    .eq("club_id", clubId);

  if (error || !data) {
    console.error("Error fetching club members:", error);
    return [];
  }

  return data.map((m: any) => ({
    id: m.id,
    user_id: m.user_id,
    role: m.role,
    username: m.profiles?.username || `User_${m.user_id.substring(0, 8)}`,
    chessComUsername: m.profiles?.chess_com_username || null
  }));
}
