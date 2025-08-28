import api from "@/utils/axios";
import axios, { isAxiosError } from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth/next";
import { jwtDecode } from "jwt-decode";
async function refreshToken(token: any) {
  if (token && token.refreshToken) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/token/refresh/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: token.refreshToken }),
      }
    );
    const response = await res.json();
    if (res.ok) {
      return {
        ...token,
        accessToken: response.access,
      };
    } else {
      return token;
    }
  }
}
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "jsmith@example.com",
        },
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
              id: data.user.id,
              email: data.user.email,
              accessToken: data.access,
              refreshToken: data.refresh,
              role: data.user.role,
            };
          } else {
            return null; // Return null if no data is received
          }
        } catch (err: any) {
          if (axios.isAxiosError(err)) {
            const backendMessage = err.response?.data?.detail || "Login failed";
            throw new Error(backendMessage); // pass backend error to frontend
          }
          throw new Error("Unexpected error occurred");
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as const, // use JWT strategy
  },
  callbacks: {
    async jwt({
      token,
      account,
      user,
    }: {
      token: any;
      account: any;
      user?: any;
    }) {
      if (token.accessToken) {
        const decodedToken = jwtDecode(token.accessToken);
        if (decodedToken?.exp !== undefined) {
          token.accessTokenExpires = decodedToken.exp * 1000;
        }
      }
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
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }
      return refreshToken(token);
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.accessToken = token.accessToken || "";
        session.refreshToken = token.refreshToken || "";
        session.id = token.id;
        session.email = token.email;
        session.role = token.role;
        session.accessTokenExpires = token.accessTokenExpires;
      }
      return session;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      try {
        const next = new URL(url, baseUrl).searchParams.get("next");
        if (next) {
          return `${baseUrl}${next}`;
        }
      } catch {
        // ignore parsing errors
      }
      return baseUrl; // fallback (usually dashboard/home)
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
const auth = () => getServerSession(authOptions);
export { auth };
