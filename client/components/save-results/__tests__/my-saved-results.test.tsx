import {
	cleanup,
	render,
	fireEvent,
	screen,
	waitFor,
	waitForElementToBeRemoved
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import MySavedResults from '../my-saved-results';
import { AppProviders } from '../../../contexts';
import * as apiService from '../../../services/api-service';
import { ListResponse, SavedResultSummary } from '../../../../types';

jest.mock('next/router');
jest.mock('next-auth/react');
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
	(useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
	server.listen();
});

afterEach(() => {
	cleanup();
	server.resetHandlers();
});

afterAll(server.close);

test('blocks access if not logged in', () => {
	(useSession as jest.Mock).mockReturnValue({ data: null, status: 'unauthenticated' });
	render(<MySavedResults />);
	expect(screen.queryByText('Log in to view your saved search results.')).toBeInTheDocument();
});

test('makes initial API call and renders results', async () => {
	(useSession as jest.Mock).mockReturnValue({ data: mockUser, status: 'authenticated' });
	server.use(rest.get('/api/searchResult', (_req, res, ctx) => res(ctx.json(mockResponse))));
	render(<MySavedResults />);
	expect(await screen.findByText('Headlines Across the Spectrum')).toBeInTheDocument();
});

test('makes initial API call and displays message if no results', async () => {
	(useSession as jest.Mock).mockReturnValue({ data: mockUser, status: 'authenticated' });
	server.use(rest.get('/api/searchResult', (_req, res, ctx) => res(ctx.json(mockEmptyResponse))));
	render(<MySavedResults />);
	expect(await screen.findByText('No saved results found')).toBeInTheDocument();
});

test('caches results returned from API', async () => {
	const apiSpy = jest.spyOn(apiService, 'callApi');
	(useSession as jest.Mock).mockReturnValue({ data: mockUser, status: 'authenticated' });
	server.use(
		rest.get('/api/searchResult', (req, res, ctx) => {
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
	server.use(rest.get('/api/searchResult', (_req, res, ctx) => res(ctx.json(mockResponse))));
	server.use(
		rest.delete(`/api/searchResult/${mockResponse.items[0]._id}`, (_req, res, ctx) =>
			res(ctx.json({ itemDeleted: true }))
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
	expect(screen.queryByText(`${itemName} deleted successfully.`)).toBeInTheDocument();
});

test('displays error alert after failed item delete', async () => {
	(useSession as jest.Mock).mockReturnValue({ data: mockUser, status: 'authenticated' });
	server.use(rest.get('/api/searchResult', (_req, res, ctx) => res(ctx.json(mockResponse))));
	server.use(
		rest.delete(`/api/searchResult/${mockResponse.items[0]._id}`, (_req, res, ctx) =>
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
