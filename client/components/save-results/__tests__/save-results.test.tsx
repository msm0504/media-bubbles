import { cleanup, render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import SaveResults from '../save-results';
import { AppProviders } from '../../../contexts';
import { SearchResultContext, initialState } from '../../../contexts/search-result-context';

const server = setupServer();

beforeAll(() => {
	Element.prototype.scrollIntoView = jest.fn();
	server.listen();
});

afterEach(() => {
	cleanup();
	server.resetHandlers();
});

afterAll(server.close);

test('button shows if result has not been previously saved', () => {
	render(
		<SearchResultContext.Provider value={[initialState, () => {}]}>
			<SaveResults />
		</SearchResultContext.Provider>
	);
	expect(screen.queryByText('Save Results')).toBeInTheDocument();
});

test('button does not show if result has already been saved', () => {
	render(
		<SearchResultContext.Provider value={[{ ...initialState, savedResultId: 'abc123' }, () => {}]}>
			<SaveResults />
		</SearchResultContext.Provider>
	);
	expect(screen.queryByText('Save Results')).not.toBeInTheDocument();
});

test('displays success alert after successful search result save', async () => {
	const mockItemId = 'item123';
	server.use(
		rest.post('/api/searchResult', (_req, res, ctx) => res(ctx.json({ itemId: mockItemId })))
	);
	render(
		<AppProviders>
			<SaveResults />
		</AppProviders>
	);

	fireEvent.click(screen.getByText('Save Results'));
	await waitFor(() => screen.getByRole('alert'));
	expect(screen.queryByText('Search result saved successfully.')).toBeInTheDocument();
});

test('displays error alert after failed search result save', async () => {
	server.use(rest.post('/api/searchResult', (_req, res, ctx) => res(ctx.json({}))));
	render(
		<AppProviders>
			<SaveResults />
		</AppProviders>
	);

	fireEvent.click(screen.getByText('Save Results'));
	await waitFor(() => screen.getByRole('alert'));
	expect(
		screen.queryByText('Saving this search result failed. Please try again later.')
	).toBeInTheDocument();
});
