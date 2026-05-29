import { createClient } from "@/utils/supabase/server";
import SavedAnalysesClient from "./ClientPage";

export default async function SavedAnalysesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let serverSaves = [];
  
  if (user) {
    const { data } = await supabase
      .from("saved_analyses")
      .select("*")
      .order("created_at", { ascending: false });
      
    if (data) {
      serverSaves = data.map(d => ({
        id: d.id,
        pgn: d.pgn,
        white_player: d.white_player,
        black_player: d.black_player,
        opening_name: d.opening_name,
        accuracy_w: d.accuracy_w,
        accuracy_b: d.accuracy_b,
        result: d.result,
        date: d.created_at
      }));
    }
  }

  return <SavedAnalysesClient serverSaves={serverSaves} isLoggedIn={!!user} />;
}
