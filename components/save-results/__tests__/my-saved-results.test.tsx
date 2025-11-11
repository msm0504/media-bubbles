import { afterAll, afterEach, beforeAll, expect, test, vi } from 'vitest';
import {
	cleanup,
	render,
	fireEvent,
	screen,
	waitFor,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import MySavedResults from '../my-saved-results';
import { AppProviders } from '@/contexts';
import type { ListResponse, SavedResultSummary } from '@/types';
import { useSession } from '@/lib/auth-client';
import { mockUserSession, mockUnauthSession } from '@/lib/__mocks__/mock-sessions';
import * as apiService from '@/services/api-service';

const server = setupServer();

const mockResponse: ListResponse<SavedResultSummary> = {
	items: [
		{
			_id: 'abc123',
			name: 'Headlines Across the Spectrum',
			createdAt: new Date().toISOString(),
		},
		{
			_id: 'xyz789',
			name: 'Some Keyword Stay in My Bubble (Left)',
			createdAt: new Date().toISOString(),
		},
	],
	pageCount: 1,
};
const mockFilter1 = 'Keyword';
const mockFilter2 = 'Head';

const mockEmptyResponse: ListResponse<SavedResultSummary> = { items: [], pageCount: 0 };

beforeAll(() => {
	Element.prototype.scrollIntoView = vi.fn();
	server.listen();
});

afterEach(() => {
	cleanup();
	server.resetHandlers();
});

afterAll(() => server.close());

test('blocks access if not logged in', () => {
	vi.mocked(useSession).mockReturnValue(mockUnauthSession);
	render(<MySavedResults />);
	expect(screen.queryByText('Log in to view your saved search results.')).toBeInTheDocument();
});

test('makes initial API call and renders results', async () => {
	vi.mocked(useSession).mockReturnValue(mockUserSession);
	server.use(http.get('http://test.com/api/search-result', () => HttpResponse.json(mockResponse)));
	render(<MySavedResults />);
	expect(await screen.findByText('Headlines Across the Spectrum')).toBeInTheDocument();
});

test('makes initial API call and displays message if no results', async () => {
	vi.mocked(useSession).mockReturnValue(mockUserSession);
	server.use(
		http.get('http://test.com/api/search-result', () => HttpResponse.json(mockEmptyResponse))
	);
	render(<MySavedResults />);
	expect(await screen.findByText('No saved results found')).toBeInTheDocument();
});

test('caches results returned from API', async () => {
	const apiSpy = vi.spyOn(apiService, 'callApi');
	vi.mocked(useSession).mockReturnValue(mockUserSession);
	server.use(
		http.get('http://test.com/api/search-result', ({ request }) => {
			const filter = new URL(request.url).searchParams.get('filter');
			return filter
				? HttpResponse.json({
						...mockEmptyResponse,
						items: mockResponse.items.filter(({ name }) => name.includes(filter)),
					})
				: HttpResponse.json(mockResponse);
		})
	);
	render(<MySavedResults />);

	await screen.findByText('Headlines Across the Spectrum');
	expect(apiSpy).toHaveBeenCalledTimes(1);
	const filterInput = screen.getByLabelText(/^Filter.*/);

	fireEvent.change(filterInput, { target: { value: mockFilter1 } });
	await waitForElementToBeRemoved(() => screen.queryByText('Headlines Across the Spectrum'));
	expect(apiSpy).toHaveBeenCalledTimes(2);

	fireEvent.change(filterInput, { target: { value: mockFilter2 } });
	await screen.findByText('Headlines Across the Spectrum');
	expect(apiSpy).toHaveBeenCalledTimes(3);

	fireEvent.change(filterInput, { target: { value: mockFilter1 } });
	await screen.findByText('Some Keyword Stay in My Bubble (Left)');
	expect(apiSpy).toHaveBeenCalledTimes(3);
});

test('displays success alert after successful item delete', async () => {
	vi.mocked(useSession).mockReturnValue(mockUserSession);
	const mockRespCopy: ListResponse<SavedResultSummary> = {
		items: [...mockResponse.items],
		pageCount: 1,
	};
	server.use(http.get('http://test.com/api/search-result', () => HttpResponse.json(mockRespCopy)));
	server.use(
		http.delete(`http://test.com/api/search-result/${mockRespCopy.items[0]._id}`, () => {
			mockRespCopy.items.splice(0, 1);
			return HttpResponse.json({ itemDeleted: true });
		})
	);
	render(
		<AppProviders>
			<MySavedResults />
		</AppProviders>
	);

	await waitFor(() => screen.getByText('Headlines Across the Spectrum'));
	const itemName = mockResponse.items[0].name;
	fireEvent.click(screen.getByLabelText(`Delete saved result ${itemName}`));
	await waitFor(() => screen.getByRole('alert'));
	expect(screen.queryByText(`${itemName} deleted successfully.`)).toBeInTheDocument();
	expect(screen.queryByText('Headlines Across the Spectrum')).not.toBeInTheDocument();
});

test('displays error alert after failed item delete', async () => {
	vi.mocked(useSession).mockReturnValue(mockUserSession);
	server.use(http.get('http://test.com/api/search-result', () => HttpResponse.json(mockResponse)));
	server.use(
		http.delete(`http://test.com/api/search-result/${mockResponse.items[0]._id}`, () =>
			HttpResponse.json({ itemDeleted: false })
		)
	);
	render(
		<AppProviders>
			<MySavedResults />
		</AppProviders>
	);

	await waitFor(() => screen.getByText('Headlines Across the Spectrum'));
	const itemName = mockResponse.items[0].name;
	fireEvent.click(screen.getByLabelText(`Delete saved result ${itemName}`));
	await waitFor(() => screen.getByRole('alert'));
	expect(
		screen.queryByText(`Deleting ${itemName} failed. Please try again later.`)
	).toBeInTheDocument();
});
