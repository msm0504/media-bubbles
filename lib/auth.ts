import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { magicLink } from 'better-auth/plugins';
import { nanoid } from 'nanoid';

import { getDbConnection } from '@/services/db-connection';
import { sendLoginEmail } from '@/services/support-email-service';

const MAGIC_LINK_EXPIRE_MIN = 10;

export const auth = betterAuth({
	account: {
		modelName: 'accounts',
		fields: {
			providerId: 'provider',
			accountId: 'providerAccountId',
			refreshToken: 'refresh_token',
			accessToken: 'access_token',
			accessTokenExpiresAt: 'access_token_expires',
			idToken: 'id_token',
		},
	},
	database: mongodbAdapter(await getDbConnection()),
	plugins: [
		magicLink({
			expiresIn: MAGIC_LINK_EXPIRE_MIN * 60,
			generateToken: () => nanoid(),
			sendMagicLink: async ({ email, token }) =>
				sendLoginEmail(email, token, MAGIC_LINK_EXPIRE_MIN),
		}),
	],
	session: { modelName: 'sessions' },
	socialProviders: {
		google: {
			clientId: process.env.AUTH_GOOGLE_ID as string,
			clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
		},
	},
	user: {
		modelName: 'users',
		additionalFields: { role: { type: 'string', defaultValue: 'user', input: false } },
	},
	verification: { modelName: 'verification_tokens' },
});
