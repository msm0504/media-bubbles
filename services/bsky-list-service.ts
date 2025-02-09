import { AtUri } from '@atproto/api';
import type { BskyList, Source } from '@/types';
import { getBskyAgent } from './bsky-agent';
import { type SourceSlant, SOURCE_SLANT_MAP } from '@/constants/source-slant';

global.bskyListMap = global.bskyListMap || null;

const initBskyListMap = () =>
	Object.entries(SOURCE_SLANT_MAP).reduce(
		(acc, [key, value]) => {
			const slant = Number(key) as SourceSlant;
			acc[slant] = { name: `${value} News Sources`, uri: '' };
			return acc;
		},
		{} as Record<SourceSlant, BskyList>
	);

const createBskyList = async (listName: string) => {
	const agent = await getBskyAgent();
	if (!agent.session?.did) return '';

	const resp = await agent.com.atproto.repo.createRecord({
		repo: agent.session.did,
		collection: 'app.bsky.graph.list',
		record: {
			$type: 'app.bsky.graph.list',
			purpose: 'app.bsky.graph.defs#curatelist',
			name: listName,
			description: listName,
			createdAt: new Date().toISOString(),
		},
	});
	return resp.data.uri;
};

const createBskyListItem = async (did: string, listUri: string) => {
	const agent = await getBskyAgent();
	if (!agent.session?.did) return '';

	agent.com.atproto.repo.createRecord({
		repo: agent.session.did,
		collection: 'app.bsky.graph.listitem',
		record: {
			$type: 'app.bsky.graph.listitem',
			subject: did,
			list: listUri,
			createdAt: new Date().toISOString(),
		},
	});
};

const deleteBskyListItem = async (listItemUri: string) => {
	const agent = await getBskyAgent();
	if (!agent.session?.did) return '';

	const { collection, rkey } = new AtUri(listItemUri);
	agent.com.atproto.repo.deleteRecord({ repo: agent.session.did, collection, rkey });
};

const synchBskyList = async (sources: Source[], uri: string) => {
	const agent = await getBskyAgent();
	if (!agent.session?.did) return;

	const {
		data: { items },
	} = await agent.app.bsky.graph.getList({ list: uri });

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

	didsToAdd.forEach(did => createBskyListItem(did, uri));

	urisToDelete.forEach(deleteBskyListItem);
};

export const synchBskyLists = async (sourceListBySlant: Source[][]) => {
	const agent = await getBskyAgent();
	if (!agent.session?.did) return;

	if (!global.bskyListMap) {
		global.bskyListMap = initBskyListMap();
	}

	const {
		data: { lists: bskyLists },
	} = await agent.app.bsky.graph.getLists({ actor: agent.session?.did });
	await Promise.all(
		Object.values(global.bskyListMap).map(async list => {
			const existing = bskyLists.find(({ name }) => name === list.name);
			list.uri = existing ? existing.uri : await createBskyList(list.name);
		})
	);

	sourceListBySlant.forEach((sources, i) =>
		synchBskyList(sources, global.bskyListMap[i as SourceSlant].uri)
	);
};

export const getBskyListUriForSlant = (slant: SourceSlant) => global.bskyListMap[slant].uri;
