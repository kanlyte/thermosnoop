// types/next-auth.d.ts
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    name?: string;
    email?: string;
    accessToken?: string;
    refreshToken?: string;
  }

  interface Session {
    user: {
      id: string;
      name?: string;
      email?: string;
    };
    refreshToken?: string;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    accessToken?: string;
    refreshToken?: string;
  }
}