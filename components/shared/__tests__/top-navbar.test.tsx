import { expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TopNavbar from '../top-navbar';
import { useSession } from '@/lib/auth-client';

vi.mock('@/lib/auth-client', () => ({
	useSession: vi.fn(),
}));

const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const mockUser: ReturnType<typeof useSession>['data'] = {
	user: {
		id: '12345',
		createdAt: today,
		updatedAt: today,
		name: 'Some Guy',
		email: 'some.guy@test.com',
		emailVerified: true,
	},
	session: {
		id: '67890',
		createdAt: today,
		updatedAt: today,
		userId: '12345',
		expiresAt: tomorrow,
		token: 'abc123',
	},
};

const mockUnauthSession: ReturnType<typeof useSession> = {
	data: null,
	isPending: false,
	isRefetching: false,
	error: null,
	refetch: vi.fn(),
};

const mockAuthSession: ReturnType<typeof useSession> = {
	data: mockUser,
	isPending: false,
	isRefetching: false,
	error: null,
	refetch: vi.fn(),
};

test('renders the navbar', () => {
	vi.mocked(useSession).mockReturnValue(mockUnauthSession);
	render(<TopNavbar />);
	expect(screen.queryAllByText('Search')).toHaveLength(2);
	expect(screen.queryByText('Log in')).toBeInTheDocument();
});

test('renders the navbar with log out button', () => {
	vi.mocked(useSession).mockReturnValue(mockAuthSession);
	render(<TopNavbar />);
	expect(screen.queryByText('Log out')).toBeInTheDocument();
});
