import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { getTwitterHandle } from '../twitter-user-service';
import bloombergRespMock from '../__mocks__/twitter-user/bloomberg-resp.json';
import cnnRespMock from '../__mocks__/twitter-user/cnn-resp.json';
import cnnUnverifiedRespMock from '../__mocks__/twitter-user/cnn-unverified-resp.json';

const server = setupServer();

beforeAll(() => {
	server.listen();
});

afterEach(() => {
	server.resetHandlers();
});

afterAll(server.close);

test('returns screen_name of first returned result', async () => {
	server.use(
		rest.get('https://api.twitter.com/1.1/users/search.json', (_req, res, ctx) =>
			res(ctx.json(cnnRespMock))
		)
	);
	const twitterHandle = await getTwitterHandle('CNN');
	expect(twitterHandle).toEqual('CNN');
});

test('returns screen_name of second returned result for Bloomberg', async () => {
	server.use(
		rest.get('https://api.twitter.com/1.1/users/search.json', (_req, res, ctx) =>
			res(ctx.json(bloombergRespMock))
		)
	);
	const twitterHandle = await getTwitterHandle('Bloomberg');
	expect(twitterHandle).toEqual('business');
});

test('returns null if returned user is unverified', async () => {
	server.use(
		rest.get('https://api.twitter.com/1.1/users/search.json', (_req, res, ctx) =>
			res(ctx.json(cnnUnverifiedRespMock))
		)
	);
	const twitterHandle = await getTwitterHandle('CNN');
	expect(twitterHandle).toBeNull();
});

test('returns null if no results returned', async () => {
	server.use(
		rest.get('https://api.twitter.com/1.1/users/search.json', (_req, res, ctx) => res(ctx.json([])))
	);
	const twitterHandle = await getTwitterHandle('sfghjhasdgh');
	expect(twitterHandle).toBeNull();
});
