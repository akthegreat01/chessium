import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envContent = fs.readFileSync(".env.local", "utf-8");
const url = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim();
const anonKey = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();

const supabase = createClient(url!, anonKey!);

async function run() {
  console.log("=== Checking Table Existence ===");
  const tables = ["blogs", "comments", "puzzles", "puzzle_attempts", "club_members", "clubs", "games", "analyses"];
  for (const table of tables) {
    const { error } = await supabase.from(table).select("*").limit(1);
    if (error) {
      console.log(`Table ${table} error:`, error.message);
    } else {
      console.log(`Table ${table} exists (success)`);
    }
  }

  console.log("\n=== Checking Profile Columns ===");
  const columns = ["id", "username", "display_name", "avatar_url", "bio", "chess_com_username", "lichess_username", "puzzle_rating", "role", "is_online", "last_seen", "created_at", "updated_at"];
  for (const col of columns) {
    const { error } = await supabase.from("profiles").select(col).limit(1);
    if (error) {
      console.log(`Column ${col} error:`, error.message);
    } else {
      console.log(`Column ${col} exists (success)`);
    }
  }
}

run();
