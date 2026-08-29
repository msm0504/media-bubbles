import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, render, fireEvent, screen } from '@testing-library/react';
import Login from '../login';
import { useSession } from '@/lib/auth-client';
import { mockPendSession, mockUnauthSession, mockUserSession } from '@/lib/__mocks__/mock-sessions';
import { NavigationMenu } from '@base-ui/react';

afterEach(cleanup);

const renderLogin = () =>
	render(
		<NavigationMenu.Root>
			<NavigationMenu.List>
				<Login />
			</NavigationMenu.List>
			<NavigationMenu.Portal>
				<NavigationMenu.Positioner>
					<NavigationMenu.Popup>
						<NavigationMenu.Viewport />
					</NavigationMenu.Popup>
				</NavigationMenu.Positioner>
			</NavigationMenu.Portal>
		</NavigationMenu.Root>
	);

test('displays log in buttons if no session', async () => {
	vi.mocked(useSession).mockReturnValue(mockUnauthSession);
	renderLogin();
	expect(screen.queryByText('Log in')).toBeInTheDocument();
	expect(screen.queryByText('Log out')).not.toBeInTheDocument();
	fireEvent.click(screen.getByText('Log in'));
	expect(await screen.findByText('Log in with Google', { exact: false })).toBeInTheDocument();
});

test('locks log in buttons if auth library is loading session', async () => {
	vi.mocked(useSession).mockReturnValue(mockPendSession);
	renderLogin();
	fireEvent.click(screen.getByText('Log in'));
	(await screen.findAllByText(/Log in with.*$/, { exact: false })).forEach(el =>
		expect(el.closest('button')).toBeDisabled()
	);
});

test('displays log out button if there is a session', () => {
	vi.mocked(useSession).mockReturnValue(mockUserSession);
	renderLogin();
	expect(screen.queryByText('Log in')).not.toBeInTheDocument();
	expect(screen.queryByText('Log out')).toBeInTheDocument();
});
