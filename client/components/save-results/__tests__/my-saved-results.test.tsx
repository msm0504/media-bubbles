import {
	cleanup,
	render,
	fireEvent,
	screen,
	waitFor,
	waitForElementToBeRemoved
} from '@testing-library/react';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import MySavedResults from '../my-saved-results';
import { AppProviders } from '@/client/contexts';
import * as apiService from '@/client/services/api-service';
import type { ListResponse, SavedResultSummary } from '@/types';

jest.mock('next/router', () => ({
	useRouter: () => ({ push: jest.fn() })
}));
jest.mock('next-auth/react');
// No idea why this is needed, but it is now.
// https://github.com/swc-project/swc/issues/3843#issuecomment-1058826971
jest.mock('@/client/services/api-service', () => {
	const actualModule = jest.requireActual('@/client/services/api-service');
	return {
		__esModule: true,
		...actualModule
	};
});
const server = setupServer();

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const mockUser: Session = {
	user: {
		id: '12346',
		isAdmin: false,
		name: 'Some Guy',
		email: 'some.guy@test.com'
	},
	expires: tomorrow.toDateString()
};

const mockResponse: ListResponse<SavedResultSummary> = {
	items: [
		{
			_id: 'abc123',
			name: 'Headlines Across the Spectrum',
			createdAt: new Date().toISOString()
		},
		{
			_id: 'xyz789',
			name: 'Some Keyword Stay in My Bubble (Left)',
			createdAt: new Date().toISOString()
		}
	],
	pageCount: 1
};
const mockFilter1 = 'Keyword';
const mockFilter2 = 'Head';

const mockEmptyResponse: ListResponse<SavedResultSummary> = { items: [], pageCount: 0 };

beforeAll(() => {
	Element.prototype.scrollIntoView = jest.fn();
	server.listen();
});

afterEach(() => {
	cleanup();
	server.resetHandlers();
});

afterAll(() => server.close());

test('blocks access if not logged in', () => {
	(useSession as jest.Mock).mockReturnValue({ data: null, status: 'unauthenticated' });
	render(<MySavedResults />);
	expect(screen.queryByText('Log in to view your saved search results.')).toBeInTheDocument();
});

test('makes initial API call and renders results', async () => {
	(useSession as jest.Mock).mockReturnValue({ data: mockUser, status: 'authenticated' });
	server.use(rest.get('/api/search-result', (_req, res, ctx) => res(ctx.json(mockResponse))));
	render(<MySavedResults />);
	expect(await screen.findByText('Headlines Across the Spectrum')).toBeInTheDocument();
});

test('makes initial API call and displays message if no results', async () => {
	(useSession as jest.Mock).mockReturnValue({ data: mockUser, status: 'authenticated' });
	server.use(rest.get('/api/search-result', (_req, res, ctx) => res(ctx.json(mockEmptyResponse))));
	render(<MySavedResults />);
	expect(await screen.findByText('No saved results found')).toBeInTheDocument();
});

test('caches results returned from API', async () => {
	const apiSpy = jest.spyOn(apiService, 'callApi');
	(useSession as jest.Mock).mockReturnValue({ data: mockUser, status: 'authenticated' });
	server.use(
		rest.get('/api/search-result', (req, res, ctx) => {
			const filter = req.url.searchParams.get('filter');
			return filter
				? res(
						ctx.json({
							...mockEmptyResponse,
							items: mockResponse.items.filter(({ name }) => name.includes(filter))
						})
				  )
				: res(ctx.json(mockResponse));
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
	(useSession as jest.Mock).mockReturnValue({ data: mockUser, status: 'authenticated' });
	const mockRespCopy: ListResponse<SavedResultSummary> = {
		items: [...mockResponse.items],
		pageCount: 1
	};
	server.use(rest.get('/api/search-result', (_req, res, ctx) => res(ctx.json(mockRespCopy))));
	server.use(
		rest.delete(`/api/search-result/${mockRespCopy.items[0]._id}`, (_req, res, ctx) => {
			mockRespCopy.items.splice(0, 1);
			return res(ctx.json({ itemDeleted: true }));
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
	await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));
	expect(screen.queryByText('Headlines Across the Spectrum')).not.toBeInTheDocument();
});

test('displays error alert after failed item delete', async () => {
	(useSession as jest.Mock).mockReturnValue({ data: mockUser, status: 'authenticated' });
	server.use(rest.get('/api/search-result', (_req, res, ctx) => res(ctx.json(mockResponse))));
	server.use(
		rest.delete(`/api/search-result/${mockResponse.items[0]._id}`, (_req, res, ctx) =>
			res(ctx.json({ itemDeleted: false }))
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
