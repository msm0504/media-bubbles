import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { getTwitterUser } from '../twitter-user-service';
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
	const twitterUser = await getTwitterUser('CNN');
	expect(twitterUser?.handle).toEqual('CNN');
});

test('returns screen_name of second returned result for Bloomberg', async () => {
	server.use(
		rest.get('https://api.twitter.com/1.1/users/search.json', (_req, res, ctx) =>
			res(ctx.json(bloombergRespMock))
		)
	);
	const twitterUser = await getTwitterUser('Bloomberg');
	expect(twitterUser?.handle).toEqual('business');
});

// Some sources now unverified on Twitter (ELON!!!).
// Therefore, I've removed the condition to only include verified accounts.
test.skip('returns null if returned user is unverified', async () => {
	server.use(
		rest.get('https://api.twitter.com/1.1/users/search.json', (_req, res, ctx) =>
			res(ctx.json(cnnUnverifiedRespMock))
		)
	);
	const twitterUser = await getTwitterUser('CNN');
	expect(twitterUser).toBeNull();
});

test('returns null if no results returned', async () => {
	server.use(
		rest.get('https://api.twitter.com/1.1/users/search.json', (_req, res, ctx) => res(ctx.json([])))
	);
	const twitterUser = await getTwitterUser('sfghjhasdgh');
	expect(twitterUser).toBeNull();
});
