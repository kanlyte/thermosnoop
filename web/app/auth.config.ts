import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
    
    // Add these callbacks to handle JWT and session
    async jwt({ token, user, account }) {
      // Initial sign in - add accessToken to token
      if (user && account) {
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.id = user.id ?? "";
      }
      return token;
    },
    
    async session({ session, token }) {
      // Send accessToken to the client
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.user.id = token.id as string;
      return session;
    },
  },
  providers: [], // Add providers via spread
  session: {
    strategy: "jwt", // Ensure JWT strategy is used
  },
} satisfies NextAuthConfig;