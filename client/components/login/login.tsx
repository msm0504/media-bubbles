import { Button } from 'react-bootstrap';
import { signIn } from 'next-auth/client';

type LoginProps = {
	sessionLoading: boolean;
};

export const FacebookLogin: React.FC<LoginProps> = ({ sessionLoading }) => (
	<Button
		variant='info'
		size='sm'
		className='facebook-btn w-100'
		id='fb-login'
		disabled={sessionLoading}
		onClick={() => signIn('facebook')}
	>
		<i className='fa fa-facebook me-2' aria-hidden='true'></i>
		Log in with Facebook
	</Button>
);

export const TwitterLogin: React.FC<LoginProps> = ({ sessionLoading }) => (
	<Button
		variant='info'
		size='sm'
		className='twitter-btn w-100'
		id='twitter-login'
		disabled={sessionLoading}
		onClick={() => signIn('twitter')}
	>
		<i className='fa fa-twitter me-2' aria-hidden='true'></i>
		Log in with Twitter
	</Button>
);
