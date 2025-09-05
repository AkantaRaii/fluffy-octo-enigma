import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

// Extend default JWT to include custom fields
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    id?: string;
    email?: string;
    role?: string;
  }
}

// Extend default Session to include custom fields
declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    id?: string;
    email?: string;
    role?: string;
  }

  interface User extends DefaultUser {
    id: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    role: string;
  }
}
