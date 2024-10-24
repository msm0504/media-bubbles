import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import Search from '../search/page';
import { SEARCH_MODE_MAP } from '@/constants/search-mode';

const server = setupServer();

beforeAll(() => {
	server.listen();
	server.use(
		http.get('/api/source-lists', () =>
			HttpResponse.json({ appSourceList: [], sourceListBySlant: [] })
		)
	);
});

afterEach(cleanup);

afterAll(() => server.close());

test('search page renders', async () => {
	render(await Search({}));
	expect(screen.queryByText('Headlines Search', { selector: 'h2' })).toBeInTheDocument();
	expect(
		screen.queryByText(`Results shown will be from ${SEARCH_MODE_MAP.FULL_SPECTRUM.description}.`)
	).toBeInTheDocument();
});

test('changes search mode when tab is clicked', async () => {
	render(await Search({}));
	const myBubbleTab = screen.getByText(SEARCH_MODE_MAP.MY_BUBBLE.name, {
		exact: false,
		selector: 'button',
	});
	fireEvent.click(myBubbleTab);
	expect(
		screen.queryByText(`Results shown will be from ${SEARCH_MODE_MAP.MY_BUBBLE.description}.`)
	).toBeInTheDocument();
});
