import { cleanup, render, screen } from '@testing-library/react';
import About from '../about/page';

afterAll(cleanup);

test('about page renders', () => {
	render(<About />);
	expect(screen.queryByText('About', { selector: 'h2' })).toBeInTheDocument();
});
