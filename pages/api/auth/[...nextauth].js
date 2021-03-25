import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { ObjectID } from 'mongodb';

import { MONGODB_URL } from '../../../server/constants';

export default NextAuth({
	session: {
		jwt: true
	},
	jwt: {
		secret: process.env.JWT_SECRET
	},
	providers: [
		Providers.Facebook({
			clientId: process.env.FACEBOOK_APP_ID,
			clientSecret: process.env.FACEBOOK_APP_SECRET
		})
	],
	database: MONGODB_URL,
	callbacks: {
		async session(session, user) {
			if (session) {
				session.user.id = user.id;
				session.user.isAdmin = user.id === process.env.ADMIN_ID;
			}
			return session;
		},
		async jwt(token, user) {
			if (token && user) {
				return { ...token, id: ObjectID(user.id).toString() };
			}
			return token;
		}
	}
});
