import { Collection, Db, MongoClient } from 'mongodb';

import { MONGODB_URL } from '../constants';

global.mongo = global.mongo || { clientPromise: null, db: null };

export async function getMongoClient(): Promise<MongoClient> {
	if (global.mongo.clientPromise) {
		return global.mongo.clientPromise;
	}

	const client = new MongoClient(MONGODB_URL);
	global.mongo.clientPromise = client.connect();
	return global.mongo.clientPromise;
}

async function getDbConnection(): Promise<Db> {
	if (global.mongo.db) {
		return global.mongo.db;
	}

	global.mongo.db = await getMongoClient().then(client => client.db(process.env.MONGODB_DBNAME));
	return global.mongo.db;
}

export async function getCollection(collectionName: string): Promise<Collection> {
	const db = await getDbConnection();
	return db.collection(collectionName);
}
