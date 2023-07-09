import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { getBiasRatingBySourceId, getSourceLists } from '../source-list-service';
import allsidesRespMock from '../__mocks__/allsides-resp.json';
import { Source } from '@/types';

const server = setupServer();

const cnnSourceObj: Source = {
	id: 'cnn',
	name: 'CNN',
	url: 'cnn.com',
	slant: 0
};
const wsjSourceObj: Source = {
	id: 'wall-street-journal',
	name: 'Wall Street Journal',
	url: 'online.wsj.com',
	slant: 3
};

beforeAll(() => {
	server.listen();
	server.use(
		rest.get(
			'https://www.allsides.com/media-bias/json/noncommercial/publications',
			(_req, res, ctx) => res(ctx.json(allsidesRespMock))
		)
	);
});

afterAll(server.close);

test('generates and returns source lists', async () => {
	const { appSourceList, sourceListBySlant } = await getSourceLists();
	expect(appSourceList).toEqual([cnnSourceObj, wsjSourceObj]);
	expect(sourceListBySlant).toEqual([[cnnSourceObj], undefined, undefined, [wsjSourceObj]]);
});

test('can get bias rating for 1 source after source lists have been generated', async () => {
	await getSourceLists();
	expect(getBiasRatingBySourceId(cnnSourceObj.id)).toEqual(0);
	expect(getBiasRatingBySourceId(wsjSourceObj.id)).toEqual(3);
});
