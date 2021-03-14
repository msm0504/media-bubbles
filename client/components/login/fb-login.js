import { Button } from 'reactstrap';
import { signIn, signOut, useSession } from 'next-auth/client';

const FbLogin = () => {
	const [session, loading] = useSession();
	return (
		<div className='d-flex justify-content-end m-0'>
			<div id='fb-root'></div>
			<Button
				color='info'
				className='facebook-btn'
				id='fb-login'
				disabled={loading}
				onClick={() => (session ? signOut('facebook') : signIn('facebook'))}
			>
				<i className='fa fa-lg fa-facebook mr-2' aria-hidden='true'></i>
				<strong>{session ? 'Log out' : 'Log in With Facebook'}</strong>
			</Button>
		</div>
	);
};

export default FbLogin;
