import { Client } from '@atproto/lex';
import { PasswordSession } from '@atproto/lex-password-session';

global.bskyAgent = global.bskyAgent || null;
global.bskyPublicAgent = global.bskyPublicAgent || null;

const initBskyAgent = async () => {
	const session = await PasswordSession.login({
		service: 'https://bsky.social',
		identifier: process.env.BLUESKY_HANDLE || '',
		password: process.env.BLUESKY_PASSWORD || '',
	});
	return new Client(session);
};

export const getBskyAgent = async () => {
	if (!global.bskyAgent) {
		global.bskyAgent = initBskyAgent();
	}
	return global.bskyAgent;
};

export const getBskyPublicAgent = () => {
	if (!global.bskyPublicAgent) {
		global.bskyPublicAgent = new Client('https://public.api.bsky.app');
	}
	return global.bskyPublicAgent;
};
