import { Db, MongoClient } from 'mongodb';
import { S3Client } from '@aws-sdk/client-s3';
import { Source } from '../types';
import { SourceSlant } from '../client/constants/source-slant';

declare global {
	namespace NodeJS {
		interface Global {
			mongo: {
				clientPromise: Promise<MongoClient>;
				db: Db;
			};
			sources: {
				lastUpdate: number;
				app: Source[];
				bySlant: Source[][];
				biasRatings: Record<string, SourceSlant>;
			};
			s3Client: S3Client;
		}
	}
}
