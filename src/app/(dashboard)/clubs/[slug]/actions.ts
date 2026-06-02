"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function joinClubAction(clubId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not logged in" };

  const { error } = await supabase
    .from("club_members")
    .insert({
      club_id: clubId,
      user_id: user.id,
      role: "member"
    });

  if (error) {
    console.error("Error joining club:", error);
    return { error: error.message };
  }

  revalidatePath("/clubs");
  revalidatePath(`/clubs/[slug]`, "page");
  
  return { success: true };
}
