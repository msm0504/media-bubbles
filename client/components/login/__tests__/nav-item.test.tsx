import { cleanup, render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/client';

import LoginNavItem from '../nav-item';

jest.mock('next-auth/client');

const mockUser: Session = {
	user: {
		id: '12346',
		isAdmin: false,
		name: 'Some Guy',
		email: 'some.guy@test.com'
	}
};

afterEach(cleanup);

test('displays log in buttons if no session', async () => {
	(useSession as jest.Mock).mockReturnValue([null, false]);
	render(<LoginNavItem />);
	expect(screen.queryByText('Log in')).toBeInTheDocument();
	expect(screen.queryByText('Log out')).not.toBeInTheDocument();
	fireEvent.click(screen.getByText('Log in'));
	expect(await screen.findByText('Log in with Facebook', { exact: false })).toBeInTheDocument();
	expect(await screen.findByText('Log in with Twitter', { exact: false })).toBeInTheDocument();
});

test('locks log in buttons if auth library is loading session', async () => {
	(useSession as jest.Mock).mockReturnValue([null, true]);
	render(<LoginNavItem />);
	fireEvent.click(screen.getByText('Log in'));
	expect(await screen.findByText('Log in with Facebook', { exact: false })).toBeDisabled();
	expect(await screen.findByText('Log in with Twitter', { exact: false })).toBeDisabled();
});

test('displays log out button if there is a session', () => {
	(useSession as jest.Mock).mockReturnValue([mockUser, false]);
	render(<LoginNavItem />);
	expect(screen.queryByText('Log in')).not.toBeInTheDocument();
	expect(screen.queryByText('Log out')).toBeInTheDocument();
});

test('locks log out button if auth library is loading session', () => {
	(useSession as jest.Mock).mockReturnValue([mockUser, true]);
	render(<LoginNavItem />);
	expect(screen.getByText('Log out')).toHaveClass('disabled');
});
