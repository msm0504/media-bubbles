import { afterEach, describe, expect, test, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
	authSession: vi.fn(),
	betterAuthGet: vi.fn(),
	betterAuthPost: vi.fn(),
	getPostSummaries: vi.fn(),
	createPost: vi.fn(),
	updatePost: vi.fn(),
	deletePost: vi.fn(),
	sendSupportEmail: vi.fn(),
	getHeadlines: vi.fn(),
	getSavedResults: vi.fn(),
	saveSearchResult: vi.fn(),
	getSavedResult: vi.fn(),
	deleteSavedResult: vi.fn(),
	takeScreenshot: vi.fn(),
	getSourceLists: vi.fn(),
	getSourceLogo: vi.fn(),
	after: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({ auth: { api: { getSession: mocks.authSession } } }));
vi.mock('next/headers', () => ({ headers: vi.fn().mockResolvedValue(new Headers()) }));
vi.mock('next/server', () => ({ after: mocks.after }));
vi.mock('@/services/blog-service', () => ({
	getPostSummaries: mocks.getPostSummaries,
	createPost: mocks.createPost,
	updatePost: mocks.updatePost,
	deletePost: mocks.deletePost,
}));
vi.mock('@/services/support-email-service', () => ({ sendSupportEmail: mocks.sendSupportEmail }));
vi.mock('@/services/news-search-service', () => ({ getHeadlines: mocks.getHeadlines }));
vi.mock('@/services/saved-results-service', () => ({
	getSavedResults: mocks.getSavedResults,
	saveSearchResult: mocks.saveSearchResult,
	getSavedResult: mocks.getSavedResult,
	deleteSavedResult: mocks.deleteSavedResult,
}));
vi.mock('@/services/screenshot-service', () => ({ takeScreenshot: mocks.takeScreenshot }));
vi.mock('@/services/source-list-service', () => ({ getSourceLists: mocks.getSourceLists }));
vi.mock('@/services/source-logo-service', () => ({ getSourceLogo: mocks.getSourceLogo }));
vi.mock('better-auth/next-js', () => ({
	toNextJsHandler: vi.fn(() => ({ GET: mocks.betterAuthGet, POST: mocks.betterAuthPost })),
}));

import { GET as authGet, POST as authPost } from '@/app/api/auth/[...all]/route';
import { DELETE as deleteBlogPost, PUT as updateBlogPost } from '@/app/api/blog-posts/[id]/route';
import { GET as getBlogPosts, POST as createBlogPost } from '@/app/api/blog-posts/route';
import { POST as sendFeedback } from '@/app/api/feedback/route';
import { GET as getHeadlinesRoute } from '@/app/api/headlines/route';
import {
	DELETE as deleteSearchResult,
	GET as getSearchResult,
} from '@/app/api/search-result/[id]/route';
import { PUT as screenshotSearchResult } from '@/app/api/search-result/[id]/screenshot/route';
import { GET as getSavedResultsRoute, POST as saveResult } from '@/app/api/search-result/route';
import { GET as getSourceListsRoute } from '@/app/api/source-lists/route';
import { GET as getSourceLogoRoute } from '@/app/api/source-logo/route';

const request = (url: string, init?: RequestInit) => new Request(`http://localhost${url}`, init);
const jsonRequest = (url: string, body: unknown) =>
	request(url, { method: 'POST', body: JSON.stringify(body) });
const params = (id: string) => ({ params: Promise.resolve({ id }) });

afterEach(() => {
	vi.clearAllMocks();
	process.env.NEXT_PUBLIC_URL = 'https://media-bubbles.test';
});

describe('auth API route', () => {
	test('exports the Better Auth GET and POST handlers', async () => {
		await authGet(request('/api/auth/session'));
		await authPost(request('/api/auth/session', { method: 'POST' }));
		expect(mocks.betterAuthGet).toHaveBeenCalled();
		expect(mocks.betterAuthPost).toHaveBeenCalled();
	});
});

describe('blog post API routes', () => {
	test('gets post summaries using filter and page query parameters', async () => {
		mocks.getPostSummaries.mockResolvedValue({ items: [], pageCount: 0 });

		const response = await getBlogPosts(request('/api/blog-posts?filter=climate&page=3'));

		expect(mocks.getPostSummaries).toHaveBeenCalledWith('climate', 3);
		expect(await response.json()).toEqual({ items: [], pageCount: 0 });
	});

	test('requires an admin to create, update, or delete posts', async () => {
		mocks.authSession
			.mockResolvedValueOnce(null)
			.mockResolvedValueOnce({ user: { role: 'user' } })
			.mockResolvedValue({ user: { role: 'user' } });
		const body = { slug: 'post-1', title: 'Post' };

		expect((await createBlogPost(jsonRequest('/api/blog-posts', body))).status).toBe(401);
		expect((await createBlogPost(jsonRequest('/api/blog-posts', body))).status).toBe(403);
		expect(
			(await updateBlogPost(jsonRequest('/api/blog-posts/post-1', body), params('post-1'))).status
		).toBe(403);
		expect((await deleteBlogPost(request('/api/blog-posts/post-1'), params('post-1'))).status).toBe(
			403
		);
	});

	test('creates and updates an admin post, rejecting a mismatched slug', async () => {
		mocks.authSession.mockResolvedValue({ user: { role: 'admin' } });
		mocks.createPost.mockResolvedValue({ itemId: 'new-post' });
		mocks.updatePost.mockResolvedValue({ itemId: 'post-1' });
		const body = { slug: 'post-1', title: 'Updated' };

		expect(await (await createBlogPost(jsonRequest('/api/blog-posts', body))).json()).toEqual({
			itemId: 'new-post',
		});
		expect(mocks.createPost).toHaveBeenCalledWith(body);
		expect(
			await (
				await updateBlogPost(jsonRequest('/api/blog-posts/post-1', body), params('post-1'))
			).json()
		).toEqual({ itemId: 'post-1' });
		expect(
			(await updateBlogPost(jsonRequest('/api/blog-posts/wrong', body), params('wrong'))).status
		).toBe(500);
	});

	test('deletes an admin post by route id', async () => {
		mocks.authSession.mockResolvedValue({ user: { role: 'admin' } });
		mocks.deletePost.mockResolvedValue({ itemDeleted: true });

		const response = await deleteBlogPost(request('/api/blog-posts/post-1'), params('post-1'));

		expect(mocks.deletePost).toHaveBeenCalledWith('post-1');
		expect(await response.json()).toEqual({ itemDeleted: true });
	});
});

describe('feedback and headlines API routes', () => {
	test('sends the submitted feedback', async () => {
		const feedback = { reason: 'question', message: 'Hello' };
		mocks.sendSupportEmail.mockResolvedValue({ feedbackSent: true });

		const response = await sendFeedback(jsonRequest('/api/feedback', feedback));

		expect(mocks.sendSupportEmail).toHaveBeenCalledWith(feedback);
		expect(await response.json()).toEqual({ feedbackSent: true });
	});

	test('passes all headline query parameters to the search service', async () => {
		mocks.getHeadlines.mockResolvedValue({ source: [] });

		await getHeadlinesRoute(
			request('/api/headlines?sources=one,two&keyword=climate&previousDays=2')
		);

		expect(mocks.getHeadlines).toHaveBeenCalledWith({
			sources: 'one,two',
			keyword: 'climate',
			previousDays: '2',
		});
	});
});

describe('saved search-result API routes', () => {
	test('returns an empty list for an anonymous user', async () => {
		mocks.authSession.mockResolvedValue(null);

		expect(await (await getSavedResultsRoute(request('/api/search-result'))).json()).toEqual({
			savedResults: [],
			pageCount: 0,
		});
		expect(mocks.getSavedResults).not.toHaveBeenCalled();
	});

	test('gets saved results for the logged-in user', async () => {
		mocks.authSession.mockResolvedValue({ user: { id: 'user-1' } });
		mocks.getSavedResults.mockResolvedValue({ items: [], pageCount: 1 });

		await getSavedResultsRoute(request('/api/search-result?filter=morning&page=2'));

		expect(mocks.getSavedResults).toHaveBeenCalledWith('morning', 2, 'user-1');
	});

	test('saves a result with the current user and schedules its screenshot', async () => {
		mocks.authSession.mockResolvedValue({ user: { id: 'user-1' } });
		mocks.saveSearchResult.mockResolvedValue({ itemId: 'result-1' });
		mocks.after.mockImplementation((callback: () => Promise<void>) => callback());
		const result = { name: 'Morning News', items: [] };

		await saveResult(jsonRequest('/api/search-result', result));
		await Promise.resolve();

		expect(mocks.saveSearchResult).toHaveBeenCalledWith({ ...result, userId: 'user-1' });
		expect(mocks.after).toHaveBeenCalled();
		expect(mocks.takeScreenshot).toHaveBeenCalledWith(
			'https://media-bubbles.test/headlines/result-1',
			'Morning_News',
			'#search-results',
			630
		);
	});

	test('gets and deletes a saved result by id', async () => {
		mocks.getSavedResult.mockResolvedValue({ _id: 'result-1' });
		mocks.authSession.mockResolvedValue({ user: { id: 'user-1' } });
		mocks.deleteSavedResult.mockResolvedValue({ itemDeleted: true });

		expect(
			await (
				await getSearchResult(request('/api/search-result/result-1'), params('result-1'))
			).json()
		).toEqual({
			_id: 'result-1',
		});
		await deleteSearchResult(
			request('/api/search-result/result-1', { method: 'DELETE' }),
			params('result-1')
		);
		expect(mocks.deleteSavedResult).toHaveBeenCalledWith('result-1', 'user-1');
	});

	test('requires an admin and an existing result to take a screenshot', async () => {
		mocks.authSession.mockResolvedValueOnce(null).mockResolvedValueOnce({ user: { role: 'user' } });
		expect(
			(await screenshotSearchResult(request('/api/search-result/x'), params('x'))).status
		).toBe(401);
		expect(
			(await screenshotSearchResult(request('/api/search-result/x'), params('x'))).status
		).toBe(403);

		mocks.authSession.mockResolvedValue({ user: { role: 'admin' } });
		mocks.getSavedResult.mockResolvedValue(null);
		expect(
			(await screenshotSearchResult(request('/api/search-result/x'), params('x'))).status
		).toBe(400);
	});

	test('takes a screenshot for an admin result', async () => {
		mocks.authSession.mockResolvedValue({ user: { role: 'admin' } });
		mocks.getSavedResult.mockResolvedValue({ name: 'Saved Result' });

		await screenshotSearchResult(request('/api/search-result/result-1'), params('result-1'));

		expect(mocks.takeScreenshot).toHaveBeenCalledWith(
			'https://media-bubbles.test/headlines/result-1',
			'Saved_Result',
			'#search-results',
			630
		);
	});
});

describe('source API routes', () => {
	test('returns source lists', async () => {
		mocks.getSourceLists.mockResolvedValue({ appSourceList: [] });

		expect(await (await getSourceListsRoute()).json()).toEqual({ appSourceList: [] });
	});

	test('returns a PNG response for an existing source logo', async () => {
		const image = Buffer.from([1, 2, 3]);
		mocks.getSourceLogo.mockResolvedValue(image);

		const response = await getSourceLogoRoute(request('/api/source-logo?id=example'));

		expect(mocks.getSourceLogo).toHaveBeenCalledWith('example');
		expect(response.headers.get('content-type')).toBe('image/png');
		expect(new Uint8Array(await response.arrayBuffer())).toEqual(new Uint8Array(image));
	});

	test('returns a bad request when no source logo is found', async () => {
		mocks.getSourceLogo.mockResolvedValue(null);

		const response = await getSourceLogoRoute(request('/api/source-logo?id=missing'));

		expect(response.status).toBe(400);
		expect(await response.text()).toBe('No logo found for missing');
	});
});
