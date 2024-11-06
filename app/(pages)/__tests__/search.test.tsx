import { afterAll, afterEach, beforeAll, expect, test, vi } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import Search from '../search/page';
import { SEARCH_MODE_MAP } from '@/constants/search-mode';

beforeAll(() => {
	vi.mock('@/services/source-list-service', () => ({
		getSourceLists: () => ({ appSourceList: [], sourceListBySlant: [] }),
	}));
});

afterEach(cleanup);

afterAll(() => vi.restoreAllMocks());

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
