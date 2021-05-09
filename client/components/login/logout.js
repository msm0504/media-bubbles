import { Button } from 'react-bootstrap';
import { signOut, useSession } from 'next-auth/client';

const Logout = () => {
	const [session, loading] = useSession();
	return session ? (
		<div className='d-flex justify-content-end mb-3'>
			<Button
				variant='primary'
				size='sm'
				id='logout-btn'
				disabled={loading}
				onClick={() => signOut({ redirect: false })}
			>
				Log out
			</Button>
		</div>
	) : null;
};

export default Logout;
