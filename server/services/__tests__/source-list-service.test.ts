import { getBiasRatingBySourceId, getSourceLists } from '../source-list-service';
import { getTwitterHandle } from '../twitter-user-service';
import allsidesRespMock from '../__mocks__/allsides-resp.json';
import { Source } from '../../../types';

const fetchMock = jest.fn(() =>
	Promise.resolve({
		json: () => Promise.resolve(allsidesRespMock)
	})
);
jest.mock('../twitter-user-service');

const cnnSourceObj: Source = {
	id: 'CNN',
	name: 'CNN',
	url: 'http://www.cnn.com'
};
const wsjSourceObj: Source = {
	id: 'WSJ',
	name: 'Wall Street Journal',
	url: 'http://online.wsj.com/'
};

beforeAll(() => {
	global.fetch = fetchMock as any;
	(getTwitterHandle as jest.Mock).mockImplementation((source: string) =>
		Promise.resolve(source === 'CNN' ? 'CNN' : source === 'Wall Street Journal' ? 'WSJ' : '')
	);
});

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
