/* eslint-disable no-var */
import { Db, MongoClient } from 'mongodb';
import { S3Client } from '@aws-sdk/client-s3';
import type { Source } from '../types';
import { SourceSlant } from '../constants/source-slant';

declare global {
	var mongo: {
		clientPromise: Promise<MongoClient>;
		db: Db;
	};
	var sources: {
		lastUpdate: number;
		app: Source[];
		bySlant: Source[][];
		biasRatings: Record<string, SourceSlant>;
	};
	var s3Client: S3Client;
}
