/* eslint-disable no-var */
import type { Db, MongoClient } from 'mongodb';
import type { S3Client } from '@aws-sdk/client-s3';
import type { LambdaClient } from '@aws-sdk/client-lambda';
import type { AtpAgent } from '@atproto/api';
import type { BskyList, Source } from '../types';
import type { SourceSlant } from '../constants/source-slant';

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
	var lambdaClient: LambdaClient;
	var bskyAgent: Promise<AtpAgent>;
	var bskyPublicAgent: AtpAgent;
	var bskyListMap: { [key: number]: BskyList };
}
