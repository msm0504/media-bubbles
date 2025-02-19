import { afterAll, afterEach, beforeAll, expect, test } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { getBskyListUriForSlant, synchBskyLists } from '../bsky-list-service';

type RequestData = { collection?: string };

const server = setupServer(
	http.get('/bsky/getLists', () => HttpResponse.json({ data: { lists: [] } })),
	http.get('/bsky/getList', () =>
		HttpResponse.json({
			data: { items: [{ subject: { did: 'did:old:123' }, uri: 'bsky.app/oldListItem' }] },
		})
	),
	http.post('/bsky/createRecord', async ({ request }) => {
		const body = (await request.json()) as RequestData;
		const resp =
			body?.collection === 'app.bsky.graph.list'
				? { data: { uri: 'bsky.app/newList' } }
				: { status: 'success' };
		return HttpResponse.json(resp);
	}),
	http.delete('/bsky/deleteRecord', () => HttpResponse.json({ status: 'success' }))
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('synch bsky lists', async () => {
	const sourceListBySlant = [
		[
			{
				id: 'example',
				bskyDid: 'did:example:123',
				bskyHandle: 'example',
				name: 'example',
				url: 'example.com',
			},
		],
	];

	await synchBskyLists(sourceListBySlant);
	expect(getBskyListUriForSlant(0)).toEqual('bsky.app/newList');
});
