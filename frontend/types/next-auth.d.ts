// types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number; // 👈 backend token expiry (ms timestamp)
    id?: string | number;
    email?: string;
    role?: "ADMIN" | "ANALYZER" | "USER";
  }

  interface User {
    id: string | number;
    email: string;
    role: "ADMIN" | "ANALYZER" | "USER";
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    id?: string | number;
    email?: string;
    role?: "ADMIN" | "ANALYZER" | "USER";
  }
}
