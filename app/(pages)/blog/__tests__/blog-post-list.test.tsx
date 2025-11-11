import { afterAll, afterEach, beforeAll, expect, test, vi } from 'vitest';
import {
	cleanup,
	render,
	fireEvent,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import BlogPosts from '../page';
import { AppProviders } from '@/contexts';
import * as apiService from '@/services/api-service';
import type { BlogPostSummary, ListResponse } from '@/types';
import { useSession } from '@/lib/auth-client';
import {
	mockAdminSession,
	mockUnauthSession,
	mockUserSession,
} from '@/lib/__mocks__/mock-sessions';

vi.mock('next-auth/react', () => ({
	useSession: vi.fn(),
}));
const server = setupServer();

const mockResponse: ListResponse<BlogPostSummary> = {
	items: [
		{
			_id: 'abc123',
			author: 'some.admin@test.com',
			title: 'Very Important Post',
			slug: 'very_important_post',
			excerpt: '',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
		{
			_id: 'xyz789',
			author: 'some.admin@test.com',
			title: 'Funny + Insightful Post',
			slug: 'funny_insightful_post',
			excerpt: '',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
	],
	pageCount: 1,
};
const mockFilter1 = 'Important';
const mockFilter2 = 'Insightful';

const mockEmptyResponse: ListResponse<BlogPostSummary> = { items: [], pageCount: 0 };

beforeAll(() => {
	Element.prototype.scrollIntoView = vi.fn();
	server.listen();
});

afterEach(() => {
	cleanup();
	server.resetHandlers();
});

afterAll(() => server.close());

test('makes initial API call and renders results if not logged in', async () => {
	vi.mocked(useSession).mockReturnValue(mockUnauthSession);
	server.use(http.get('http://test.com/api/blog-posts', () => HttpResponse.json(mockResponse)));
	render(<BlogPosts />);
	expect(await screen.findByText('Very Important Post')).toBeInTheDocument();
});

test('makes initial API call and renders results if logged in', async () => {
	vi.mocked(useSession).mockReturnValue(mockUserSession);
	server.use(http.get('http://test.com/api/blog-posts', () => HttpResponse.json(mockResponse)));
	render(<BlogPosts />);
	expect(await screen.findByText('Very Important Post')).toBeInTheDocument();
});

test('makes initial API call and displays message if no results', async () => {
	vi.mocked(useSession).mockReturnValue(mockUnauthSession);
	server.use(
		http.get('http://test.com/api/blog-posts', () => HttpResponse.json(mockEmptyResponse))
	);
	render(<BlogPosts />);
	expect(await screen.findByText('No posts found')).toBeInTheDocument();
});

test('caches results returned from API', async () => {
	const apiSpy = vi.spyOn(apiService, 'callApi');
	vi.mocked(useSession).mockReturnValue(mockUserSession);
	server.use(
		http.get('http://test.com/api/blog-posts', ({ request }) => {
			const filter = new URL(request.url).searchParams.get('filter');
			return filter
				? HttpResponse.json({
						...mockEmptyResponse,
						items: mockResponse.items.filter(({ title }) => title.includes(filter)),
					})
				: HttpResponse.json(mockResponse);
		})
	);
	render(<BlogPosts />);

	await screen.findByText('Funny + Insightful Post');
	expect(apiSpy).toHaveBeenCalledTimes(1);
	const filterInput = screen.getByLabelText(/^Filter.*/);

	fireEvent.change(filterInput, { target: { value: mockFilter1 } });
	await waitForElementToBeRemoved(() => screen.queryByText('Funny + Insightful Post'));
	expect(apiSpy).toHaveBeenCalledTimes(2);

	fireEvent.change(filterInput, { target: { value: mockFilter2 } });
	await screen.findByText('Funny + Insightful Post');
	expect(apiSpy).toHaveBeenCalledTimes(3);

	fireEvent.change(filterInput, { target: { value: mockFilter1 } });
	await screen.findByText('Very Important Post');
	expect(apiSpy).toHaveBeenCalledTimes(3);
});

test('hides edit and delete buttons if not logged in', async () => {
	vi.mocked(useSession).mockReturnValue(mockUnauthSession);
	server.use(http.get('http://test.com/api/blog-posts', () => HttpResponse.json(mockResponse)));
	render(<BlogPosts />);
	expect(screen.queryByLabelText('Add Post')).not.toBeInTheDocument();
	await screen.findByText('Very Important Post');
	const itemSlug = mockResponse.items[0].slug;
	expect(screen.queryByLabelText(`Edit post ${itemSlug}`)).not.toBeInTheDocument();
	expect(screen.queryByLabelText(`Delete post ${itemSlug}`)).not.toBeInTheDocument();
});

test('hides edit and delete buttons if not admin', async () => {
	vi.mocked(useSession).mockReturnValue(mockUserSession);
	server.use(http.get('http://test.com/api/blog-posts', () => HttpResponse.json(mockResponse)));
	render(<BlogPosts />);
	expect(screen.queryByLabelText('Add Post')).not.toBeInTheDocument();
	await screen.findByText('Very Important Post');
	const itemSlug = mockResponse.items[0].slug;
	expect(screen.queryByLabelText(`Edit post ${itemSlug}`)).not.toBeInTheDocument();
	expect(screen.queryByLabelText(`Delete post ${itemSlug}`)).not.toBeInTheDocument();
});

test('displays success alert after successful item delete', async () => {
	vi.mocked(useSession).mockReturnValue(mockAdminSession);
	const mockRespCopy: ListResponse<BlogPostSummary> = {
		items: [...mockResponse.items],
		pageCount: 1,
	};
	server.use(http.get('http://test.com/api/blog-posts', () => HttpResponse.json(mockRespCopy)));
	server.use(
		http.delete(`http://test.com/api/blog-posts/${mockRespCopy.items[0].slug}`, () => {
			mockRespCopy.items.splice(0, 1);
			return HttpResponse.json({ itemDeleted: true });
		})
	);
	render(
		<AppProviders>
			<BlogPosts />
		</AppProviders>
	);

	await screen.findByText('Very Important Post');
	const { slug, title } = mockResponse.items[0];
	fireEvent.click(screen.getByLabelText(`Delete post ${slug}`));
	await screen.findByRole('alert');
	expect(screen.queryByText(`${title} deleted successfully.`)).toBeInTheDocument();
	expect(screen.queryByText(title)).not.toBeInTheDocument();
});

test('displays error alert after failed item delete', async () => {
	vi.mocked(useSession).mockReturnValue(mockAdminSession);
	server.use(http.get('http://test.com/api/blog-posts', () => HttpResponse.json(mockResponse)));
	server.use(
		http.delete(`http://test.com/api/blog-posts/${mockResponse.items[0].slug}`, () =>
			HttpResponse.json({ itemDeleted: false })
		)
	);
	render(
		<AppProviders>
			<BlogPosts />
		</AppProviders>
	);

	await screen.findByText('Very Important Post');
	const { slug, title } = mockResponse.items[0];
	fireEvent.click(screen.getByLabelText(`Delete post ${slug}`));
	await screen.findByRole('alert');
	expect(
		screen.queryByText(`Deleting ${title} failed. Please try again later.`)
	).toBeInTheDocument();
});
