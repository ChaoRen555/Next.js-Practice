import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { hashPassword, verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { credentialsLoginSchema } from "@/lib/validationSchemas";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const validation = credentialsLoginSchema.safeParse(credentials);

        if (!validation.success) {
          return null;
        }

        const { email, password } = validation.data;
        const existingUser = await prisma.user.findUnique({
          where: {
            email,
          },
          select: {
            id: true,
            email: true,
            image: true,
            name: true,
            passwordHash: true,
          },
        });

        if (existingUser) {
          if (!existingUser.passwordHash) {
            return null;
          }

          const passwordValid = await verifyPassword(
            password,
            existingUser.passwordHash,
          );

          if (!passwordValid) {
            return null;
          }

          return {
            id: existingUser.id,
            email: existingUser.email,
            image: existingUser.image,
            name: existingUser.name,
          };
        }

        const passwordHash = await hashPassword(password);
        const createdUser = await prisma.user.create({
          data: {
            email,
            name: email.split("@")[0],
            passwordHash,
          },
          select: {
            id: true,
            email: true,
            image: true,
            name: true,
          },
        });

        return {
          id: createdUser.id,
          email: createdUser.email,
          image: createdUser.image,
          name: createdUser.name,
        };
      },
    }),
    Google,
    GitHub,
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth }) {
      return Boolean(auth?.user);
    },
    async session({ session, token }) {
      if (!session.user) {
        return session;
      }

      if (!token.sub) {
        return session;
      }

      const dbUser = await prisma.user.findUnique({
        where: {
          id: token.sub,
        },
        select: {
          email: true,
          image: true,
          name: true,
          role: true,
        },
      });

      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub ?? "",
          email: dbUser?.email ?? session.user.email,
          image: dbUser?.image ?? session.user.image,
          name: dbUser?.name ?? session.user.name,
          role: dbUser?.role ?? "USER",
        },
      };
    },
  },
});
