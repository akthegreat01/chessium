"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const redirectTo = formData.get("redirect") as string | null;

  if (!username || !password) {
    return { error: "Username and password are required" };
  }

  const supabase = await createClient();
  const email = `${username}@chessium.app`;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Invalid username or password" };
  }

  revalidatePath("/", "layout");
  if (redirectTo && redirectTo.startsWith("/")) {
    redirect(redirectTo);
  }
  redirect("/dashboard");
}

export async function signup(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Username and password are required" };
  }

  if (username.length < 3) {
    return { error: "Username must be at least 3 characters long" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long" };
  }

  // Basic validation for username (alphanumeric and underscores only)
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { error: "Username can only contain letters, numbers, and underscores" };
  }

  const supabase = await createClient();
  const email = `${username}@chessium.app`;

  // Supabase Auth Signup
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username,
      },
    },
  });

  if (error) {
    if (error.message.includes("User already registered")) {
      return { error: "Username is already taken" };
    }
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
