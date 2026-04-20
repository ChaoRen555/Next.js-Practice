import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  providers: [Google, GitHub],
  session: {
    strategy: "database",
  },
  callbacks: {
    authorized({ auth }) {
      return Boolean(auth?.user);
    },
    session({ session, user }) {
      if (!session.user) {
        return session;
      }

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      };
    },
  },
});
