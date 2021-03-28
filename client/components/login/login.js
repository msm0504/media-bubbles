import { Button } from 'reactstrap';
import { signIn, signOut, useSession } from 'next-auth/client';

const Login = () => {
	const [session, loading] = useSession();
	return (
		<div className='d-flex justify-content-end mb-3'>
			{session ? (
				<Button
					color='primary'
					size='sm'
					id='logout-btn'
					disabled={loading}
					onClick={() => signOut({ redirect: false })}
				>
					Log out
				</Button>
			) : (
				<>
					<Button
						color='info'
						size='sm'
						className='twitter-btn mr-2'
						id='twitter-login'
						disabled={loading}
						onClick={() => signIn('twitter')}
					>
						<i className='fa fa-twitter mr-2' aria-hidden='true'></i>
						Log in with Twitter
					</Button>
					<Button
						color='info'
						size='sm'
						className='facebook-btn'
						id='fb-login'
						disabled={loading}
						onClick={() => signIn('facebook')}
					>
						<i className='fa fa-facebook mr-2' aria-hidden='true'></i>
						Log in with Facebook
					</Button>
				</>
			)}
		</div>
	);
};

export default Login;
