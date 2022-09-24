import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Home from '../pages/index';

jest.mock('next/router', () => ({
	useRouter: () => ({ query: '' })
}));

afterAll(cleanup);

test('home page renders', () => {
	render(<Home />);
	expect(screen.queryByText('Media Bubbles', { selector: 'h1' })).toBeInTheDocument();
});
