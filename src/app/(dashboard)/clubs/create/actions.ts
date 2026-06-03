"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createClubAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to create a club." };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  if (!name || !description) {
    return { error: "Name and description are required." };
  }

  // Ensure user profile exists (fallback if trigger failed)
  const username = user.user_metadata?.username || user.email?.split('@')[0] || `user_${Math.floor(Math.random() * 100000)}`;
  await supabase.from("profiles").upsert({
    id: user.id,
    username: username,
    display_name: username
  }).then();

  // Insert club
  const { data: club, error: clubError } = await supabase
    .from("clubs")
    .insert({
      name,
      slug,
      description,
      owner_id: user.id
    })
    .select()
    .single();

  if (clubError) {
    // If slug collision, try appending a random string
    if (clubError.code === '23505') { // unique violation
      slug = `${slug}-${Math.floor(Math.random() * 10000)}`;
      const { data: retryClub, error: retryError } = await supabase
        .from("clubs")
        .insert({
          name,
          slug,
          description,
          owner_id: user.id
        })
        .select()
        .single();
        
      if (retryError) {
        return { error: "Failed to create club. Please try again." };
      }
      
      // Insert member
      await supabase.from("club_members").insert({
        club_id: retryClub.id,
        user_id: user.id,
        role: "owner"
      });
      
      revalidatePath("/clubs");
      redirect(`/clubs/${retryClub.slug}`);
    }
    
    return { error: clubError.message };
  }

  // Insert member
  await supabase.from("club_members").insert({
    club_id: club.id,
    user_id: user.id,
    role: "owner"
  });

  revalidatePath("/clubs");
  redirect(`/clubs/${club.slug}`);
}
