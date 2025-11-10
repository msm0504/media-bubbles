import { cacheTag } from 'next/cache';
import { getCollection } from './db-connection';
import type { Source } from '@/types';

type SourceLists = {
	appSourceList: Source[];
	sourceListBySlant: Source[][];
};

const COLLECTION_NAME = 'source_lists';
const _collection = getCollection(COLLECTION_NAME);

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
