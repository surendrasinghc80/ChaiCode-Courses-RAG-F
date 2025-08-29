import CredentialsProvider from "next-auth/providers/credentials";
import { AuthenticationApi } from "@/ApiConstants";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "";

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;
          const axios = (await import("axios")).default;

          const response = await axios.post(
            `${BASE_URL}${AuthenticationApi.Login}`,
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          const data = response.data;
          // Backend returns { success, message, data: { user, token } }
          if (!data.success || !data.data) {
            return null;
          }

          const user = data.data.user || {};
          const token = data.data.token;

          return {
            id: String(user.id),
            name: user.username,
            email: user.email,
            role: user.role,
            username: user.username,
            age: user.age,
            city: user.city,
            accessToken: token,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Always redirect to the requested URL or home
      // We'll handle admin redirect on the client side
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async jwt({ token, user }) {
      if (user) {
        // Persist all user data and access token to the JWT
        token.accessToken = user.accessToken;
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.username = user.username;
        token.age = user.age;
        token.city = user.city;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.username = token.username;
        session.user.age = token.age;
        session.user.city = token.city;
        session.user.role = token.role;
      }
      session.accessToken = token.accessToken;
      return session;
    },
  },
};
