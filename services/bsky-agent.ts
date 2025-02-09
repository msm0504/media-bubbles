import { AtpAgent } from '@atproto/api';

global.bskyAgent = global.bskyAgent || null;

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
