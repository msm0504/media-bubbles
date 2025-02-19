import { expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import TopNavbar from '../top-navbar';

vi.mock('next-auth/react', () => ({
	useSession: vi.fn(),
}));

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const mockUser: Session = {
	user: {
		id: '12346',
		isAdmin: false,
		name: 'Some Guy',
		email: 'some.guy@test.com',
	},
	expires: tomorrow.toDateString(),
};

test('renders the navbar', () => {
	vi.mocked(useSession).mockReturnValue({ data: null, status: 'unauthenticated', update: vi.fn() });
	render(<TopNavbar />);
	expect(screen.queryAllByText('Search')).toHaveLength(2);
	expect(screen.queryByText('Log in')).toBeInTheDocument();
});

test('renders the navbar with log out button', () => {
	vi.mocked(useSession).mockReturnValue({
		data: mockUser,
		status: 'authenticated',
		update: vi.fn(),
	});
	render(<TopNavbar />);
	expect(screen.queryByText('Log out')).toBeInTheDocument();
});
