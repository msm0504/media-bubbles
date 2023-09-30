import { cleanup, render, screen } from '@testing-library/react';

import About from '../pages/about';

afterAll(cleanup);

test('about page renders', () => {
	render(<About />);
	expect(screen.queryByText('About', { selector: 'h2' })).toBeInTheDocument();
});
