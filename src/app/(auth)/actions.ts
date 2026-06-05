"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(prevState: any, formData: FormData) {
  const identifier = formData.get("identifier") as string; // email or username
  const password = formData.get("password") as string;
  const redirectTo = formData.get("redirect") as string | null;

  if (!identifier || !password) {
    return { error: "Username/email and password are required" };
  }

  const supabase = await createClient();

  // If it looks like an email, login directly
  if (identifier.includes("@")) {
    const { error } = await supabase.auth.signInWithPassword({
      email: identifier,
      password,
    });

    if (error) {
      return { error: "Invalid credentials" };
    }
  } else {
    // It's a username — try with the auto-generated email pattern
    const generatedEmail = `${identifier.toLowerCase()}@chessium.local`;
    const { error } = await supabase.auth.signInWithPassword({
      email: generatedEmail,
      password,
    });

    if (error) {
      return { error: "Invalid credentials" };
    }
  }

  revalidatePath("/", "layout");
  if (redirectTo && redirectTo.startsWith("/")) {
    redirect(redirectTo);
  }
  redirect("/dashboard");
}

export async function signup(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const email = (formData.get("email") as string)?.trim() || "";
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

  // Check if username already exists
  const { data: existingUser } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .single();

  if (existingUser) {
    return { error: "Username is already taken" };
  }

  // If no email provided, generate a placeholder email from the username
  const signupEmail = email || `${username.toLowerCase()}@chessium.local`;

  // Supabase Auth Signup
  const { error } = await supabase.auth.signUp({
    email: signupEmail,
    password,
    options: {
      data: {
        username: username,
        display_name: username,
      },
    },
  });

  if (error) {
    if (error.message.includes("User already registered")) {
      return { error: email ? "Email address is already taken" : "Username is already taken" };
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
