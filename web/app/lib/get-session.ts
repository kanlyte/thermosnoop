// lib/get-session.ts
import { auth } from "@/auth";

export async function getSession() {
  try {
    // This will properly handle the cookies
    const session = await auth();
    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}