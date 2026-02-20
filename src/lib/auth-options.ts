import { type AuthOptions, type User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

interface Credentials {
  identifiant: string;
  password: string;
}

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 5 * 60 * 60,
    updateAge: 60 * 60,
  },
  jwt: {
    maxAge: 5 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        identifiant: { label: "Identifiant", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Credentials | undefined) {
        if (!credentials?.identifiant || !credentials?.password)
          throw new Error("Champs manquants");

        const user = await prisma.user.findUnique({
          where: { identifiant: credentials.identifiant },
          include: { role: true },
        });

        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        if (user.isBlocked) throw new Error("Votre compte est bloqué.");

        return {
          id: user.id,
          name: `${user.nom} ${user.prenom}`,
          email: user.email,
          roleId: user.roleId,
          role: user.role.name,
        } as NextAuthUser & { roleId: number; role: string };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.roleId = (user as any).roleId;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as number;
      session.user.roleId = token.roleId as number;
      session.user.role = token.role as string;
      return session;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
};
