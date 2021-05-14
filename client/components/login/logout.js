import { Nav } from 'react-bootstrap';
import { signOut } from 'next-auth/client';

const Logout = ({ sessionLoading }) => (
	<Nav.Link
		className='me-md-4'
		href='#'
		disabled={sessionLoading}
		onSelect={() => signOut({ redirect: false })}
	>
		Log out
	</Nav.Link>
);

export default Logout;
