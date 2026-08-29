import { app } from '@bsky/sdk/lexicons';
import { getBskyPublicAgent } from '../connections/bsky-agent';

const MAX_BSKY_PROFILES = 5;

export const getBskyProfile = async (sourceName: string, url: string) => {
	const agent = getBskyPublicAgent();
	if (url === 'bbc.com') {
		const bbcResp = await agent.call(app.bsky.actor.searchActorsTypeahead, {
			q: 'bbcnews',
			limit: MAX_BSKY_PROFILES,
		});
		return bbcResp.actors[1];
	}

	const urlResp = await agent.call(app.bsky.actor.searchActorsTypeahead, {
		q: url,
		limit: MAX_BSKY_PROFILES,
	});
	if (urlResp?.actors.length) {
		return urlResp.actors[0];
	}

	const nameResp = await agent.call(app.bsky.actor.searchActorsTypeahead, {
		q: sourceName,
		limit: MAX_BSKY_PROFILES,
	});
	return nameResp?.actors[0];
};
