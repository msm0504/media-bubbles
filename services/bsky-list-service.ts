import type { AtUriString, DatetimeString, DidString } from '@atproto/lex';
import { AtUri } from '@atproto/syntax';
import { app } from '@bsky/sdk/lexicons';
import type { Source } from '@/types';
import { getBskyAgent } from '@/connections/bsky-agent';

const LIST_NAME = 'News Sources';

const createBskyList = async () => {
	const agent = await getBskyAgent();

	const resp = await agent.create(app.bsky.graph.list, {
		purpose: 'app.bsky.graph.defs#curatelist',
		name: LIST_NAME,
		description: LIST_NAME,
		createdAt: new Date().toISOString() as DatetimeString,
	});

	return resp.uri;
};

export const getBskyNewsListUri = async () => {
	'use cache';
	const agent = await getBskyAgent();
	if (!agent.did) return '';

	const resp = await agent.call(app.bsky.graph.getLists, { actor: agent.did });
	const list = resp.lists.find(list => list.name === LIST_NAME);

	return list?.uri || createBskyList();
};

const createBskyListItem = async (did: string, listUri: string) => {
	const agent = await getBskyAgent();

	await agent.create(app.bsky.graph.listitem, {
		subject: did as DidString,
		list: listUri as AtUriString,
		createdAt: new Date().toISOString() as DatetimeString,
	});
};

const deleteBskyListItem = async (listItemUri: string) => {
	const agent = await getBskyAgent();

	const { rkey } = new AtUri(listItemUri);
	await agent.delete(app.bsky.graph.listitem, { rkey });
};

export const synchBskyList = async (sources: Source[]) => {
	const agent = await getBskyAgent();
	const uri = await getBskyNewsListUri();

	const { items } = await agent.call(app.bsky.graph.getList, { list: uri as AtUriString });

	const didsToAdd = sources.reduce((acc: string[], { bskyDid }) => {
		if (bskyDid) {
			const existing = items.find(item => item.subject.did === bskyDid);
			if (!existing) {
				acc.push(bskyDid);
			}
		}
		return acc;
	}, []);

	const urisToDelete = items.reduce((acc: string[], item) => {
		const existing = sources.find(source => source.bskyDid === item.subject.did);
		if (!existing) {
			acc.push(item.uri);
		}
		return acc;
	}, []);

	await Promise.all(didsToAdd.map(did => createBskyListItem(did, uri)));
	await Promise.all(urisToDelete.map(deleteBskyListItem));
};
