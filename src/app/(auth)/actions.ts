"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = formData.get("redirect") as string | null;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Invalid email or password" };
  }

  revalidatePath("/", "layout");
  if (redirectTo && redirectTo.startsWith("/")) {
    redirect(redirectTo);
  }
  redirect("/dashboard");
}

export async function signup(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!username || !email || !password) {
    return { error: "Username, email, and password are required" };
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
      return { error: "Email address is already taken" };
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
