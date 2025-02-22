import { AtpAgent } from '@atproto/api';

global.bskyAgent = global.bskyAgent || null;
global.bskyPublicAgent = global.bskyPublicAgent || null;

const initBskyAgent = async () => {
	const agent = new AtpAgent({ service: 'https://bsky.social' });
	await agent.login({
		identifier: process.env.BLUESKY_HANDLE || '',
		password: process.env.BLUESKY_PASSWORD || '',
	});
	return agent;
};

export const getBskyAgent = async () => {
	if (!global.bskyAgent) {
		global.bskyAgent = initBskyAgent();
	}
	return global.bskyAgent;
};

export const getBskyPublicAgent = () => {
	if (!global.bskyPublicAgent) {
		global.bskyPublicAgent = new AtpAgent({ service: 'https://public.api.bsky.app' });
	}
	return global.bskyPublicAgent;
};
