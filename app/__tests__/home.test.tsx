import { afterAll, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import Home from '../page';

afterAll(cleanup);

test('home page renders', () => {
	render(<Home />);
	expect(screen.queryByText('Media Bubbles', { selector: 'h1' })).toBeInTheDocument();
});
