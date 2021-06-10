import { cleanup, render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import MySavedResults from '../my-saved-results';
import { AppProviders } from '../../../contexts';
import * as apiService from '../../../services/api-service';
import { ListResponse, SavedResultSummary } from '../../../../types';

jest.mock('next/router');
jest.mock('next-auth/client');
const server = setupServer();

const mockUser: Session = {
	user: {
		id: '12346',
		isAdmin: false,
		name: 'Some Guy',
		email: 'some.guy@test.com'
	}
};

const mockResponse: ListResponse<SavedResultSummary> = {
	items: [
		{
			_id: 'abc123',
			name: 'Headlines Across the Spectrum',
			createdAt: new Date().toISOString()
		}
	],
	pageCount: 1
};

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
	(useSession as jest.Mock).mockReturnValue([null, false]);
	render(<MySavedResults />);
	expect(screen.queryByText('Log in to view your saved search results.')).toBeInTheDocument();
});

test('makes initial API call and renders results', async () => {
	(useSession as jest.Mock).mockReturnValue([mockUser, false]);
	server.use(rest.get('/api/searchResult', (_req, res, ctx) => res(ctx.json(mockResponse))));
	render(<MySavedResults />);
	expect(await screen.findByText('Headlines Across the Spectrum')).toBeInTheDocument();
});

test('makes initial API call and displays message if no results', async () => {
	(useSession as jest.Mock).mockReturnValue([mockUser, false]);
	server.use(rest.get('/api/searchResult', (_req, res, ctx) => res(ctx.json(mockEmptyResponse))));
	render(<MySavedResults />);
	expect(await screen.findByText('No saved results found')).toBeInTheDocument();
});

test('caches results returned from API', async () => {
	const apiSpy = jest.spyOn(apiService, 'callApi');
	(useSession as jest.Mock).mockReturnValue([mockUser, false]);
	server.use(rest.get('/api/searchResult', (_req, res, ctx) => res(ctx.json(mockResponse))));
	render(<MySavedResults />);

	expect(apiSpy).toHaveBeenCalledTimes(1);
	const filterInput = screen.getByLabelText(/^Filter.*/);

	fireEvent.change(filterInput, { target: { value: 'test' } });
	await waitFor(() => new Promise(resolve => setTimeout(resolve, 500)));
	expect(apiSpy).toHaveBeenCalledTimes(2);

	fireEvent.change(filterInput, { target: { value: 'test123' } });
	await waitFor(() => new Promise(resolve => setTimeout(resolve, 500)));
	expect(apiSpy).toHaveBeenCalledTimes(3);

	fireEvent.change(filterInput, { target: { value: 'test' } });
	await waitFor(() => new Promise(resolve => setTimeout(resolve, 500)));
	expect(apiSpy).toHaveBeenCalledTimes(3);
	expect(await screen.findByText('Headlines Across the Spectrum')).toBeInTheDocument();
});

test('displays success alert after successful item delete', async () => {
	(useSession as jest.Mock).mockReturnValue([mockUser, false]);
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
	(useSession as jest.Mock).mockReturnValue([mockUser, false]);
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
