import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: clubs } = await supabase.from("clubs").select("*");
  const { data: members } = await supabase.from("club_members").select("*");
  
  return NextResponse.json({
    currentUser: user?.id,
    clubs,
    members
  });
}
