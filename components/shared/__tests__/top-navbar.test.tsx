import { expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TopNavbar from '../top-navbar';
import { useSession } from '@/lib/auth-client';
import { mockUnauthSession, mockUserSession } from '@/lib/__mocks__/mock-sessions';

test('renders the navbar', () => {
	vi.mocked(useSession).mockReturnValue(mockUnauthSession);
	render(<TopNavbar />);
	expect(screen.queryAllByText('Search')).toHaveLength(2);
	expect(screen.queryByText('Log in')).toBeInTheDocument();
});

test('renders the navbar with log out button', () => {
	vi.mocked(useSession).mockReturnValue(mockUserSession);
	render(<TopNavbar />);
	expect(screen.queryByText('Log out')).toBeInTheDocument();
});
