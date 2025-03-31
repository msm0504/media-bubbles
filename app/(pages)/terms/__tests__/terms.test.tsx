import { afterAll, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import Terms from '../page';

afterAll(cleanup);

test('terms and conditions page renders', () => {
	render(<Terms />);
	expect(screen.queryByText('Terms and Conditions', { selector: 'h1' })).toBeInTheDocument();
});
