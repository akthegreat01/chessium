"use server";

import { createClient } from "@/utils/supabase/server";

export async function saveAnalysis(data: {
  pgn: string;
  white_player: string;
  black_player: string;
  opening_name: string;
  accuracy_w: number;
  accuracy_b: number;
  result: string;
}) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: "You must be logged in to save an analysis to the cloud." };
  }

  const { error } = await supabase
    .from("saved_analyses")
    .insert([
      {
        user_id: user.id,
        pgn: data.pgn,
        white_player: data.white_player,
        black_player: data.black_player,
        opening_name: data.opening_name,
        accuracy_w: data.accuracy_w,
        accuracy_b: data.accuracy_b,
        result: data.result
      }
    ]);

  if (error) {
    console.error("Save analysis error:", error);
    return { error: "Failed to save analysis. Please try again." };
  }

  return { success: true };
}

export async function deleteAnalysis(id: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("saved_analyses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id); // extra safety

  if (error) return { error: "Failed to delete" };
  return { success: true };
}
