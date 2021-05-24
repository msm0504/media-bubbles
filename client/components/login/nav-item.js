import { useSession } from 'next-auth/client';
import { Dropdown, NavItem, NavLink } from 'react-bootstrap';

import { FacebookLogin, TwitterLogin } from './login';
import Logout from './logout';

const LoginNavItem = () => {
	const [session, loading] = useSession();
	return session ? (
		<Logout sessionLoading={loading} />
	) : (
		<Dropdown className='me-md-4' as={NavItem}>
			<Dropdown.Toggle as={NavLink}>Log in</Dropdown.Toggle>
			<Dropdown.Menu className='end-0'>
				<Dropdown.Item>
					<TwitterLogin sessionLoading={loading} />
				</Dropdown.Item>
				<Dropdown.Item>
					<FacebookLogin sessionLoading={loading} />
				</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	);
};

export default LoginNavItem;
