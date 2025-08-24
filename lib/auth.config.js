import CredentialsProvider from "next-auth/providers/credentials";

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
          const res = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            return null;
          }
          const data = await res.json();
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
            username: user.username,
            age: user.age,
            city: user.city,
            accessToken: token,
          };
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
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
      }
      session.accessToken = token.accessToken;
      return session;
    },
  },
};
