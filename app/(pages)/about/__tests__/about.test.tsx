import { afterAll, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import About from '../page';

afterAll(cleanup);

test('about page renders', () => {
	render(<About />);
	expect(screen.queryByText('About', { selector: 'h2' })).toBeInTheDocument();
});
