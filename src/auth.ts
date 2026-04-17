import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        if (credentials.is2FA === "true") {
          const user = await prisma.user.findUnique({ where: { email: credentials.email as string } });
          if (!user) return null;

          // Special bypass used right after email verification at sign-up
          if (credentials.code === "__verified__") {
            if (!user.isEmailVerified) return null;
            return { id: user.id, email: user.email, name: user.name, role: user.role, isSeller: user.isSeller };
          }

          // Standard 2FA login flow: validate the code
          if (user.twoFactorCode !== credentials.code || !user.twoFactorCodeExpires || user.twoFactorCodeExpires < new Date()) {
            return null;
          }
          await prisma.user.update({
            where: { id: user.id },
            data: { twoFactorCode: null, twoFactorCodeExpires: null }
          });
          return { id: user.id, email: user.email, name: user.name, role: user.role, isSeller: user.isSeller };
        }

        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          
          try {
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) return null;

            // Block unverified accounts
            if (user.isEmailVerified === false) return null;
            
            // Block deactivated accounts
            if (user.isActive === false) throw new Error("Account Deactivated");

            const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
            if (!passwordsMatch) return null;

            if (user.twoFactorEnabled) {
              return { id: user.id, email: user.email, name: user.name, role: user.role, isSeller: user.isSeller, requires2FA: true } as any;
            }

            return { id: user.id, email: user.email, name: user.name, role: user.role, isSeller: user.isSeller };
          } catch (e) {
            console.error("Auth Error", e);
            return null;
          }
        }
        return null;
      },
    }),
  ],
});
