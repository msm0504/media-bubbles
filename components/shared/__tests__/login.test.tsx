import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, render, fireEvent, screen } from '@testing-library/react';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import Login from '../login';

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

afterEach(cleanup);

test('displays log in buttons if no session', async () => {
	vi.mocked(useSession).mockReturnValue({ data: null, status: 'unauthenticated', update: vi.fn() });
	render(<Login />);
	expect(screen.queryByText('Log in')).toBeInTheDocument();
	expect(screen.queryByText('Log out')).not.toBeInTheDocument();
	fireEvent.click(screen.getByText('Log in'));
	expect(await screen.findByText('Log in with Google', { exact: false })).toBeInTheDocument();
	expect(await screen.findByText('Log in with Twitter', { exact: false })).toBeInTheDocument();
});

test('locks log in buttons if auth library is loading session', async () => {
	vi.mocked(useSession).mockReturnValue({ data: null, status: 'loading', update: vi.fn() });
	render(<Login />);
	fireEvent.click(screen.getByText('Log in'));
	(await screen.findAllByRole('menuitem')).forEach(el => expect(el).toHaveClass('Mui-disabled'));
});

test('displays log out button if there is a session', () => {
	vi.mocked(useSession).mockReturnValue({
		data: mockUser,
		status: 'authenticated',
		update: vi.fn(),
	});
	render(<Login />);
	expect(screen.queryByText('Log in')).not.toBeInTheDocument();
	expect(screen.queryByText('Log out')).toBeInTheDocument();
});
