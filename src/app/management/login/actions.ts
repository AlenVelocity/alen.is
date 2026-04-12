"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function checkUsername(username: string) {
  const expectedUser = process.env.ADMIN_USERNAME || "admin";
  if (username !== expectedUser) {
    redirect("/lost");
  }
  return { success: true };
}

export async function checkPassword(password: string) {
  const expectedPwd = process.env.ADMIN_SECRET;
  if (password !== expectedPwd) {
    redirect("/lost");
  }
  
  // Set session cookie (httpOnly for middleware)
  const cookieStore = await cookies();
  cookieStore.set("admin_session", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });
  
  redirect("/management");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/management/login");
}
