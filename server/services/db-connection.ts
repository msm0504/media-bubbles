import { Collection, Db, MongoClient } from 'mongodb';

import { MONGODB_URL } from '../constants';

global.mongo = global.mongo || { db: null, promise: null };

async function getDbConnection(): Promise<Db> {
	if (global.mongo.db) {
		return global.mongo.db;
	}

	if (!global.mongo.promise) {
		const client = new MongoClient(MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			bufferMaxEntries: 0
		});
		global.mongo.promise = client.connect().then(client => client.db(process.env.MONGODB_DBNAME));
	}
	global.mongo.db = await global.mongo.promise;
	return global.mongo.db;
}

export async function getCollection(collectionName: string): Promise<Collection> {
	const db = await getDbConnection();
	return db.collection(collectionName);
}
