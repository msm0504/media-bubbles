import { useSession } from 'next-auth/react';
import { Dropdown, NavItem, NavLink } from 'react-bootstrap';

import { FacebookLogin, TwitterLogin } from './login';
import Logout from './logout';

const LoginNavItem: React.FC = () => {
	const { data: session, status } = useSession();
	const loading = status === 'loading';
	return session ? (
		<Logout sessionLoading={loading} />
	) : (
		<Dropdown className='me-md-4' as={NavItem}>
			<Dropdown.Toggle as={NavLink}>Log in</Dropdown.Toggle>
			<Dropdown.Menu align='end'>
				<TwitterLogin sessionLoading={loading} />
				<FacebookLogin sessionLoading={loading} />
			</Dropdown.Menu>
		</Dropdown>
	);
};

export default LoginNavItem;
