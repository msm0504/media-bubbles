import { cacheTag, revalidateTag } from 'next/cache';
import { synchBskyList } from './bsky-list-service';
import {
	deleteSourcePosts,
	loadPostsForNewSource,
	updateSlantForSourcePosts,
} from './bsky-post-service';
import { getBskyProfile } from './bsky-profile-service';
import SOURCE_INCLUDE_LIST from '../data/source-include-list.json';
import ALL_SIDES_RATINGS from '../data/allsides_pub_data.json';
import type { Source } from '@/types';
import { getCollection } from '@/connections/db-connection';
import type { SourceSlant } from '@/constants/source-slant';

type AllSidesRating = {
	source_name: string;
	source_type: string;
	media_bias_rating: string;
	source_url: string;
	allsides_url: string;
};
type AllSidesPubRating = { publication: AllSidesRating[] };
type AllSidesPubResponse = { allsides_media_bias_ratings: AllSidesPubRating };
type AllSidesBiasRating = keyof typeof ALL_SIDES_RATINGS_TO_INT;
type SourceIncludeListKey = keyof typeof SOURCE_INCLUDE_LIST;

type SourceLists = {
	appSourceList: Source[];
	sourceListBySlant: Source[][];
};

const ALL_SIDES_RATINGS_TO_INT = {
	Left: 0,
	'Lean Left': 1,
	Center: 2,
	'Lean Right': 3,
	Right: 4,
};
const CENTER = 2;

const COLLECTION_NAME = 'source_lists';
const _collection = getCollection<SourceLists>(COLLECTION_NAME);

const saveSourceLists = async (sourceLists: SourceLists) => {
	const db = await _collection;
	await db.deleteMany({});
	await db.insertOne(sourceLists);
};

const getSourcesAndBiasRatings = () => {
	const appSourceList: Source[] = [];
	const sourceBiasRatings: Record<string, SourceSlant> = {};

	const biasRatings =
		(ALL_SIDES_RATINGS as AllSidesPubResponse)?.allsides_media_bias_ratings.publication || [];
	biasRatings.forEach(({ source_name, source_url, media_bias_rating }) => {
		const biasRating = ALL_SIDES_RATINGS_TO_INT[
			media_bias_rating as AllSidesBiasRating
		] as SourceSlant;
		if (biasRating === null || typeof biasRating === 'undefined') return 0;

		const modifiedName = source_name
			.replace(/\(.*\)/, '') // ignore part of name in ()
			.replace(/\s-\s\S+$/, '') // ignore dash suffix
			.trim();

		if (!SOURCE_INCLUDE_LIST[modifiedName as SourceIncludeListKey] === true || !source_url)
			return 0;

		const id = modifiedName.toLowerCase().replace(/\s/g, '-');
		if (!Object.prototype.hasOwnProperty.call(sourceBiasRatings, id)) {
			const formattedUrl = new URL(source_url).hostname.replace(/www\./, '');
			appSourceList.push({
				id,
				name: modifiedName,
				url: formattedUrl,
				slant: biasRating,
			});
		}
		if (!Object.prototype.hasOwnProperty.call(sourceBiasRatings, id)) {
			sourceBiasRatings[id] = biasRating;
		} else if (Math.abs(biasRating - CENTER) > Math.abs(sourceBiasRatings[id] - CENTER)) {
			sourceBiasRatings[id] = biasRating;
			const prev = appSourceList.find(source => source.id === id);
			if (prev) {
				prev.slant = biasRating;
			}
		}
	});

	return appSourceList;
};

export const populateSourceLists = async () => {
	const db = await _collection;
	const savedSourceLists = (await db.findOne()) as unknown as SourceLists;
	const curSourcesMap = savedSourceLists
		? savedSourceLists.appSourceList.reduce(
				(acc, source) => {
					acc[source.id] = source;
					return acc;
				},
				{} as { [name: string]: Source }
			)
		: {};

	let isChanged: boolean = false;
	const added: Source[] = [];
	const changed: Source[] = [];
	const deletedIds: Set<string> = new Set(Object.keys(curSourcesMap));

	const appSourceList = getSourcesAndBiasRatings();
	const sourceListBySlant: Source[][] = [];

	appSourceList.sort((source1, source2) => {
		const name1 = source1.name.toLowerCase();
		const name2 = source2.name.toLowerCase();

		if (name1 < name2) {
			return -1;
		}
		if (name1 > name2) {
			return 1;
		}
		return 0;
	});

	appSourceList.forEach(source => {
		const sourceSlant = source.slant;
		if (typeof sourceSlant === 'undefined') return;

		if (!sourceListBySlant[sourceSlant]) {
			sourceListBySlant[sourceSlant] = [];
		}
		sourceListBySlant[sourceSlant].push(source);

		if (!curSourcesMap[source.id]) {
			added.push(source);
			isChanged = true;
		} else if (curSourcesMap[source.id].slant !== sourceSlant) {
			changed.push(source);
			isChanged = true;
		}

		deletedIds.delete(source.id);
	});

	if (deletedIds.size > 0) isChanged = true;

	// get bsky profile info and posts for all added
	await Promise.all(
		added.map(async source => {
			const profile = await getBskyProfile(source.name, source.url);
			if (profile?.handle) {
				source.bskyHandle = profile.handle;
				source.bskyDid = profile.did;
				await loadPostsForNewSource(source);
			} else {
				console.error(`Failed getting profile for ${source.name} (${source.url}): ${profile}`);
			}
		})
	);

	// update source posts if slant has changed
	await Promise.all(changed.map(updateSlantForSourcePosts));
	// remove posts for deleted sources
	await Promise.all(deletedIds.values().map(deleteSourcePosts));

	if (isChanged) {
		await saveSourceLists({ appSourceList, sourceListBySlant });
		revalidateTag('source-lists', 'max');
	}

	// synch added and deleted with bsky feed
	await synchBskyList(appSourceList);
};

export const getSourceLists = async (): Promise<SourceLists> => {
	'use cache';
	cacheTag('source-lists');
	const db = await _collection;
	const sourceLists = (await db.findOne()) as unknown as SourceLists;
	return {
		appSourceList: sourceLists.appSourceList,
		sourceListBySlant: sourceLists.sourceListBySlant,
	};
};
