import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '../footer';

test('renders the footer', () => {
	render(<Footer />);
	expect(screen.queryByText('Privacy Policy')).toBeInTheDocument();
});
