import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import TwitterProvider from 'next-auth/providers/twitter';
import { MongoDBAdapter } from '@auth/mongodb-adapter';

import { getMongoClient } from '@/services/db-connection';

export const { auth, handlers, signIn, signOut } = NextAuth({
	session: {
		strategy: 'jwt',
	},
	providers: [GoogleProvider, TwitterProvider],
	adapter: MongoDBAdapter(getMongoClient()),
	callbacks: {
		async session({ session, token }) {
			if (session) {
				session.user.id = '' + token.id;
				session.user.isAdmin = token.id === process.env.ADMIN_ID;
			}
			return session;
		},
		async jwt({ token, user }) {
			if (token && user) {
				return { ...token, id: user.id };
			}
			return token;
		},
	},
});
