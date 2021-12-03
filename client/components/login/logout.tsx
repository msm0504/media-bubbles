import { Nav } from 'react-bootstrap';
import { signOut } from 'next-auth/client';

type LogoutProps = {
	sessionLoading: boolean;
};

const Logout: React.FC<LogoutProps> = ({ sessionLoading }) => (
	<Nav.Link
		className='me-md-4'
		href='#'
		disabled={sessionLoading}
		onClick={() => signOut({ redirect: false })}
	>
		Log out
	</Nav.Link>
);

export default Logout;
