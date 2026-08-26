/* eslint-disable no-var */
import type { Db, MongoClient } from 'mongodb';
import type { Client } from '@atproto/lex';

declare global {
	var mongo: {
		clientPromise: Promise<MongoClient>;
		db: Db;
	};
	var bskyAgent: Promise<Client>;
	var bskyPublicAgent: Client;
}
