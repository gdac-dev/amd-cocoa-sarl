import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      // Always allow public auth routes
      const publicPaths = ['/login', '/register', '/verify-account', '/forgot-password'];
      if (publicPaths.some(p => pathname.startsWith(p))) {
        return true;
      }

      // Protect admin routes — must be logged in AND be ADMIN
      if (pathname.startsWith('/admin')) {
        if (isLoggedIn && (auth.user as any).role === 'ADMIN') return true;
        return false;
      }

      // Protect seller routes — must be logged in
      if (pathname.startsWith('/seller')) {
        return isLoggedIn;
      }

      return true; // Allow all other routes
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
        token.isSeller = (user as any).isSeller;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role as string;
        (session.user as any).id = token.id as string;
        (session.user as any).isSeller = token.isSeller as boolean;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allow relative redirects
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allow same origin
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  providers: [], // Add providers here later
} satisfies NextAuthConfig;
