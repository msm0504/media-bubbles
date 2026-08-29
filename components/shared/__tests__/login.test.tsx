import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, render, fireEvent, screen } from '@testing-library/react';
import Login from '../login';
import { useSession } from '@/lib/auth-client';
import { mockPendSession, mockUnauthSession, mockUserSession } from '@/lib/__mocks__/mock-sessions';
import { NavigationMenu } from '@base-ui/react';

afterEach(cleanup);

test('displays log in buttons if no session', async () => {
	vi.mocked(useSession).mockReturnValue(mockUnauthSession);
	render(<NavigationMenu.Root><NavigationMenu.List><Login /></NavigationMenu.List></NavigationMenu.Root>);
	expect(screen.queryByText('Log in')).toBeInTheDocument();
	expect(screen.queryByText('Log out')).not.toBeInTheDocument();
	fireEvent.click(screen.getByText('Log in'));
	expect(await screen.findByText('Log in with Google', { exact: false })).toBeInTheDocument();
});

test('locks log in buttons if auth library is loading session', async () => {
	vi.mocked(useSession).mockReturnValue(mockPendSession);
	render(<NavigationMenu.Root><NavigationMenu.List><Login /></NavigationMenu.List></NavigationMenu.Root>);
	fireEvent.click(screen.getByText('Log in'));
	(await screen.findAllByRole('menuitem')).forEach(el => expect(el).toHaveClass('disabled'));
});

test('displays log out button if there is a session', () => {
	vi.mocked(useSession).mockReturnValue(mockUserSession);
	render(<NavigationMenu.Root><NavigationMenu.List><Login /></NavigationMenu.List></NavigationMenu.Root>);
	expect(screen.queryByText('Log in')).not.toBeInTheDocument();
	expect(screen.queryByText('Log out')).toBeInTheDocument();
});
