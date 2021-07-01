import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Terms from '../pages/terms';

afterAll(cleanup);

test('terms and conditions page renders', () => {
	render(<Terms />);
	expect(screen.queryByText('Terms and Conditions', { selector: 'h1' })).toBeInTheDocument();
});
