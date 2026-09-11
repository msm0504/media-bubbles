import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { BskyArticle } from '@/types';
import { callApi } from '@/services/api-service';
import Home from '../page';

vi.mock('@/services/api-service', () => ({
	callApi: vi.fn(),
}));

const mockedCallApi = vi.mocked(callApi);

const article: BskyArticle = {
	_id: 'article-1',
	sourceId: 'source-1',
	sourceName: 'Example News',
	slant: 3,
	title: 'A recent headline',
	description: 'A description for the recent headline',
	url: 'https://example.com/article-1',
	publishedAt: new Date('2026-01-01T00:00:00.000Z'),
};

describe('home page', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		mockedCallApi.mockResolvedValue([]);
	});

	afterEach(() => {
		cleanup();
		vi.useRealTimers();
		vi.clearAllMocks();
	});

	test('renders the hero content and navigation links', () => {
		render(<Home />);

		expect(screen.getByRole('heading', { name: /see the whole story/i })).toBeInTheDocument();
		expect(screen.getByText(/escape your information bubble/i)).toBeInTheDocument();
		expect(screen.getByRole('link', { name: /explore the headlines/i })).toHaveAttribute(
			'href',
			'/search'
		);
		expect(screen.getByRole('link', { name: /learn how it works/i })).toHaveAttribute(
			'href',
			'/about'
		);
	});

	test('loads recent headlines after the debounce interval', async () => {
		mockedCallApi.mockResolvedValue([article]);
		render(<Home />);

		expect(mockedCallApi).not.toHaveBeenCalled();
		await act(async () => {
			vi.advanceTimersByTime(300);
			await Promise.resolve();
		});

		expect(mockedCallApi).toHaveBeenCalledWith('get', '/headlines/most-recent', {
			keyword: '',
		});
		expect(screen.getByText('Center-Right: Example News')).toBeInTheDocument();
		expect(screen.getByText('A recent headline')).toBeInTheDocument();
	});

	test('uses the search input value in the headlines request', async () => {
		render(<Home />);
		const searchInput = screen.getByRole('textbox', { name: 'Search' });

		fireEvent.change(searchInput, { target: { value: 'climate' } });
		act(() => vi.advanceTimersByTime(299));
		expect(mockedCallApi).not.toHaveBeenCalled();

		await act(async () => {
			vi.advanceTimersByTime(1);
			await Promise.resolve();
		});
		expect(mockedCallApi).toHaveBeenCalledWith('get', '/headlines/most-recent', {
			keyword: 'climate',
		});
	});
});
