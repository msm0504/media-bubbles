import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import PrivacyPolicy from '../pages/privacy-policy';

afterAll(cleanup);

test('privacy policy page renders', () => {
	render(<PrivacyPolicy />);
	expect(screen.queryByText('Privacy Policy', { selector: 'h1' })).toBeInTheDocument();
});
