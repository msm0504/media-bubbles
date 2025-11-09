import { getCollection } from './db-connection';
import type { Source } from '@/types';

type SourceLists = {
	appSourceList: Source[];
	sourceListBySlant: Source[][];
};

const COLLECTION_NAME = 'source_lists';
const _collection = getCollection(COLLECTION_NAME);

export const getSourceLists = async (): Promise<SourceLists> => {
	const db = await _collection;
	return db.findOne() as unknown as SourceLists;
};
