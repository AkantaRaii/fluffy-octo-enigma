// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    id?: string | number;
    email?: string;
    role?: "ADMIN" | "ANALYZER" | "USER";
  }
}
