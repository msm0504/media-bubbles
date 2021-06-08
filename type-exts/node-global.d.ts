import { Db } from 'mongodb';
import { Source } from '../types';
import { SourceSlant } from '../client/constants/source-slant';

declare global {
	namespace NodeJS {
		interface Global {
			mongo: {
				db: Db;
				promise: Promise<Db>;
			};
			sources: {
				lastUpdate: number;
				app: Source[];
				bySlant: Source[][];
				biasRatings: { [name: string]: SourceSlant };
			};
		}
	}
}
