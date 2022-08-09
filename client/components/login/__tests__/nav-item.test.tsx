import { cleanup, render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';

import LoginNavItem from '../nav-item';

jest.mock('next-auth/react');

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const mockUser: Session = {
	user: {
		id: '12346',
		isAdmin: false,
		name: 'Some Guy',
		email: 'some.guy@test.com'
	},
	expires: tomorrow.toDateString()
};

afterEach(cleanup);

test('displays log in buttons if no session', async () => {
	(useSession as jest.Mock).mockReturnValue({ data: null, status: 'unauthenticated' });
	render(<LoginNavItem />);
	expect(screen.queryByText('Log in')).toBeInTheDocument();
	expect(screen.queryByText('Log out')).not.toBeInTheDocument();
	fireEvent.click(screen.getByText('Log in'));
	expect(await screen.findByText('Log in with Facebook', { exact: false })).toBeInTheDocument();
	expect(await screen.findByText('Log in with Twitter', { exact: false })).toBeInTheDocument();
});

test('locks log in buttons if auth library is loading session', async () => {
	(useSession as jest.Mock).mockReturnValue({ data: null, status: 'loading' });
	render(<LoginNavItem />);
	fireEvent.click(screen.getByText('Log in'));
	expect(await screen.findByText('Log in with Facebook', { exact: false })).toBeDisabled();
	expect(await screen.findByText('Log in with Twitter', { exact: false })).toBeDisabled();
});

test('displays log out button if there is a session', () => {
	(useSession as jest.Mock).mockReturnValue({ data: mockUser, status: 'authenticated' });
	render(<LoginNavItem />);
	expect(screen.queryByText('Log in')).not.toBeInTheDocument();
	expect(screen.queryByText('Log out')).toBeInTheDocument();
});

test('locks log out button if auth library is loading session', () => {
	(useSession as jest.Mock).mockReturnValue({ data: mockUser, status: 'loading' });
	render(<LoginNavItem />);
	expect(screen.getByText('Log out')).toHaveClass('disabled');
});
