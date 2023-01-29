import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import SearchTabs from '../pages/search';
import { SEARCH_MODE_MAP } from '../client/constants/search-mode';

beforeEach(() => {
	render(<SearchTabs appSourceList={[]} sourceListBySlant={[]} />);
});

afterAll(cleanup);

test('search page renders', () => {
	expect(screen.queryByText('Headlines Search', { selector: 'h2' })).toBeInTheDocument();
	expect(
		screen.queryByText(`Results shown will be from ${SEARCH_MODE_MAP.FULL_SPECTRUM.description}.`)
	).toBeInTheDocument();
});

test('changes search mode when tab is clicked', () => {
	const myBubbleTab = screen.getByText(SEARCH_MODE_MAP.MY_BUBBLE.name);
	fireEvent.click(myBubbleTab);
	expect(
		screen.queryByText(`Results shown will be from ${SEARCH_MODE_MAP.MY_BUBBLE.description}.`)
	).toBeInTheDocument();
});
