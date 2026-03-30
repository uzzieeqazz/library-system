import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

/**
 * NextAuth.js конфигурациясы.
 * JWT стратегиясын қолданады, credentials (email + құпия сөз) арқылы аутентификация.
 * JWT токеніне пайдаланушының id және role орналастырылады.
 */
export const authOptions: NextAuthOptions = {
    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/auth/login",
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Құпия сөз", type: "password" },
            },
            async authorize(credentials) {
                // Аутентификация олқы:
                // 1. credentials жоқ болса reject
                // 2. Email бойынша пайдаланушыны табу
                // 3. bcrypt арқылы парольді тексеру
                if (!credentials?.email || !credentials?.password) return null;
                const [user] = await db
                    .select()
                    .from(users)
                    .where(eq(users.email, credentials.email));
                if (!user) return null;
                const valid = await bcrypt.compare(credentials.password, user.passwordHash);
                if (!valid) return null;
                return { id: String(user.id), name: user.name, email: user.email, role: user.role };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
            }
            return session;
        },
    },
};
