import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: number;
    nom: string;
    prenom: string;
    roleId: number;
    role: string;
  }

  interface Session {
    user: {
      id: number;
      nom: string;
      prenom: string;
      roleId: number;
      role: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    nom: string;
    prenom: string;
    roleId: number;
    role: string;
  }
}
