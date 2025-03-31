import { afterAll, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import PrivacyPolicy from '../page';

afterAll(cleanup);

test('privacy policy page renders', () => {
	render(<PrivacyPolicy />);
	expect(screen.queryByText('Privacy Policy', { selector: 'h1' })).toBeInTheDocument();
});
