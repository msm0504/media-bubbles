import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Mailgun from 'next-auth/providers/mailgun';
import Twitter from 'next-auth/providers/twitter';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { nanoid } from 'nanoid';

import { getMongoClient } from '@/services/db-connection';
import { sendLoginEmail } from './services/support-email-service';

export const { auth, handlers, signIn, signOut } = NextAuth({
	session: {
		strategy: 'jwt',
	},
	providers: [
		Google,
		Twitter,
		Mailgun({
			sendVerificationRequest: ({ expires, identifier, token }) =>
				sendLoginEmail(identifier, token, expires),
			generateVerificationToken: () => nanoid(),
		}),
	],
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
