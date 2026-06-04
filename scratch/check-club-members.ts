import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envContent = fs.readFileSync(".env.local", "utf-8");
const url = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim();
const anonKey = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();

const supabase = createClient(url!, anonKey!);

async function run() {
  console.log("=== Fetching all clubs ===");
  const { data: clubs, error: clubsErr } = await supabase.from("clubs").select("*");
  console.log("Clubs:", clubs, "Error:", clubsErr);

  if (clubs && clubs.length > 0) {
    const clubId = clubs[0].id;
    console.log(`\n=== Fetching club members for club: ${clubs[0].name} (${clubId}) ===`);
    const { data: members, error: membersErr } = await supabase
      .from("club_members")
      .select(`
        id,
        user_id,
        role,
        profiles (
          id,
          username,
          chess_com_username
        )
      `)
      .eq("club_id", clubId);
    console.log("Members:", JSON.stringify(members, null, 2), "Error:", membersErr);
    
    console.log("\n=== Direct profiles fetch ===");
    const { data: profiles, error: profilesErr } = await supabase.from("profiles").select("*");
    console.log("Profiles in DB:", profiles, "Error:", profilesErr);
  }
}

run();
