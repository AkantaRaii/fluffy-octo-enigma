import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import api from "@/utils/axios";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { JWT } from "next-auth/jwt";

async function refreshToken(token: JWT): Promise<JWT> {
  if (token.refreshToken) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/token/refresh/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: token.refreshToken }),
      }
    );
    const data = await res.json();
    if (res.ok) {
      return { ...token, accessToken: data.access };
    }
  }
  return token;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await api.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/token/`,
            {
              email: credentials?.email,
              password: credentials?.password,
            }
          );

          const data = res.data;
          if (data) {
            return {
              id: String(data.user.id),
              email: data.user.email,
              accessToken: data.access,
              refreshToken: data.refresh,
              role: data.user.role,
            };
          }
          return null;
        } catch (err: unknown) {
          if (axios.isAxiosError(err)) {
            const status = err.response?.status;
            const message =
              err.response?.data?.detail ||
              (status === 401
                ? "Invalid credentials"
                : status === 403
                ? "Account forbidden"
                : "Login failed");

            // return null for 401 (invalid creds)
            if (status === 401) return null;

            // throw for others (NextAuth -> ?error=...)
            throw new Error(`${status}:${message}`);
          }
          throw new Error("Unexpected error occurred");
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, user }) {
      // Decode token to get expiration
      if (token.accessToken) {
        const decoded: { exp?: number } = jwtDecode(token.accessToken);
        if (decoded.exp) token.accessTokenExpires = decoded.exp * 1000;
      }

      // First login, attach user info
      if (user && account) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          id: user.id,
          email: user.email,
          role: user.role,
        };
      }

      // Return previous token if not expired
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Refresh token
      return refreshToken(token);
    },

    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        id: token.id,
        email: token.email,
        role: token.role,
        accessTokenExpires: token.accessTokenExpires,
      };
    },

    async redirect({ url, baseUrl }) {
      try {
        const next = new URL(url, baseUrl).searchParams.get("next");
        if (next) return `${baseUrl}${next}`;
      } catch {}
      return baseUrl;
    },
  },
};
