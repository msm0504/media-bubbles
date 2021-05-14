import { useSession } from 'next-auth/client';
import { NavDropdown } from 'react-bootstrap';

import { FacebookLogin, TwitterLogin } from './login';
import Logout from './logout';

const LoginNavItem = () => {
	const [session, loading] = useSession();
	return session ? (
		<Logout sessionLoading={loading} />
	) : (
		<NavDropdown className='me-md-4 end-0' title='Log in' id='login-nav-dropdown' alignRight>
			<NavDropdown.Item>
				<TwitterLogin sessionLoading={loading} />
			</NavDropdown.Item>
			<NavDropdown.Item>
				<FacebookLogin sessionLoading={loading} />
			</NavDropdown.Item>
		</NavDropdown>
	);
};

export default LoginNavItem;
