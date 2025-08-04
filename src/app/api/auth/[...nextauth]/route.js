// app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "../../../../generated/prisma";
import bcrypt from "bcrypt";

console.log(process.env.NEXTAUTH_SECRET)
const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials, req) {
        const admin = await prisma.admin.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (admin) {
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            admin.password
          );

          if (isPasswordValid) {
            return {
              id: admin.id,
              email: admin.email,
            };
          }
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "api/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };