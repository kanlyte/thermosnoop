"use server"
import * as z from "zod";
import { LoginSchema } from "@/lib/schemas";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    return { success: "Logged in successfully!" };

  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.message) {
        case "User not found":
          return { error: "Email not registered" };
        case "Wrong password":
          return { error: "Incorrect password" };
        case "EMAIL_NOT_VERIFIED":
          return { 
            success: "Email not verified",
            message_type: "verify_email",
            email: email
          };
        default:
          return { error: "Login failed. Please try again." };
      }
    }
    return { error: "An unexpected error occurred" };
  }
};