import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, render, fireEvent, screen } from '@testing-library/react';
import Login from '../login';
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

const mockPendSession: ReturnType<typeof useSession> = {
	data: null,
	isPending: true,
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

afterEach(cleanup);

test('displays log in buttons if no session', async () => {
	vi.mocked(useSession).mockReturnValue(mockUnauthSession);
	render(<Login />);
	expect(screen.queryByText('Log in')).toBeInTheDocument();
	expect(screen.queryByText('Log out')).not.toBeInTheDocument();
	fireEvent.click(screen.getByText('Log in'));
	expect(await screen.findByText('Log in with Google', { exact: false })).toBeInTheDocument();
});

test('locks log in buttons if auth library is loading session', async () => {
	vi.mocked(useSession).mockReturnValue(mockPendSession);
	render(<Login />);
	fireEvent.click(screen.getByText('Log in'));
	(await screen.findAllByRole('menuitem')).forEach(el => expect(el).toHaveClass('Mui-disabled'));
});

test('displays log out button if there is a session', () => {
	vi.mocked(useSession).mockReturnValue(mockAuthSession);
	render(<Login />);
	expect(screen.queryByText('Log in')).not.toBeInTheDocument();
	expect(screen.queryByText('Log out')).toBeInTheDocument();
});
