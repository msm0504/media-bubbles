import NextAuth from 'next-auth';
import FacebookProvider from 'next-auth/providers/facebook';
import TwitterProvider from 'next-auth/providers/twitter';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';

import { getMongoClient } from '@/server/services/db-connection';

export default NextAuth({
	session: {
		strategy: 'jwt'
	},
	jwt: {
		secret: process.env.JWT_SECRET
	},
	providers: [
		FacebookProvider({
			clientId: process.env.FACEBOOK_APP_ID || '',
			clientSecret: process.env.FACEBOOK_APP_SECRET || ''
		}),
		TwitterProvider({
			clientId: process.env.TWITTER_APP_KEY || '',
			clientSecret: process.env.TWITTER_APP_SECRET || ''
		})
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
		}
	}
});
