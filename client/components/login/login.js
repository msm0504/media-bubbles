import { Button } from 'react-bootstrap';
import { signIn, useSession } from 'next-auth/client';

const Login = () => {
	const [session, loading] = useSession();
	return !session ? (
		<>
			<Button
				variant='info'
				size='sm'
				className='twitter-btn me-2'
				id='twitter-login'
				disabled={loading}
				onClick={() => signIn('twitter')}
			>
				<i className='fa fa-twitter me-2' aria-hidden='true'></i>
				Log in with Twitter
			</Button>
			<Button
				variant='info'
				size='sm'
				className='facebook-btn'
				id='fb-login'
				disabled={loading}
				onClick={() => signIn('facebook')}
			>
				<i className='fa fa-facebook me-2' aria-hidden='true'></i>
				Log in with Facebook
			</Button>
		</>
	) : null;
};

export default Login;
