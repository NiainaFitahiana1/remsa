import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import type { User } from "next-auth";

type AppUser = User & {
  id: number;
  nom: string;
  prenom: string;
  roleId: number;
  role: string;
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifiant: { label: "Identifiant", type: "text" },
        password: { label: "Mot de passe", type: "password" },
      },

      async authorize(credentials): Promise<AppUser | null> {
        if (!credentials?.identifiant || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { identifiant: credentials.identifiant },
          include: { role: true },
        });

        if (!user || user.isBlocked) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) return null;

        return {
          id: user.id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          roleId: user.roleId,
          role: user.role.name,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as AppUser;

        token.id = u.id as number;
        token.nom = u.nom;
        token.prenom = u.prenom;
        token.roleId = u.roleId as number;
        token.role = u.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as number;
        session.user.nom = token.nom as string;
        session.user.prenom = token.prenom as string;
        session.user.roleId = token.roleId as number;
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};
