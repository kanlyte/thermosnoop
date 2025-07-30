import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"
import { LoginSchema } from "@/lib/schemas"
import axiosInstance from "./lib/axiosinstance";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const validatedFields = LoginSchema.safeParse(credentials);
          if (!validatedFields.success) {
            throw new Error("Invalid credentials");
          }

          const { email, password } = validatedFields.data;
          
          // Using Axios instead of fetch
          const response = await axiosInstance.post('/login', {
            email,
            password
          });

          const data = response.data;

          if (response.status !== 200) {
            if (data.data === "user not found") {
              throw new Error("User not found");
            } else if (data.data === "wrong password") {
              throw new Error("Wrong password");
            }
            throw new Error("Login failed");
          }

          if (data.emailNotVerified) {
            throw new Error("EMAIL_NOT_VERIFIED");
          }

          return {
            id: data.user.id,
            name: data.user.first_name,
            email: data.user.email,
            accessToken: data.accessToken
          };
        } catch (error) {
          console.error("Login error:", error);
          throw error;
        }
      }
    })
  ],
});