import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

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
			session.user.id = user.id;
			session.user.isAdmin = user.id === process.env.NEXT_PUBLIC_ADMIN_ID;
			return session;
		},
		async jwt(token, user, account) {
			if (token && account) {
				return { ...token, id: account.id };
			}
			return token;
		}
	}
});
