import { Dropdown } from 'react-bootstrap';
import { signIn } from 'next-auth/react';

type LoginProps = {
	sessionLoading: boolean;
};

export const FacebookLogin: React.FC<LoginProps> = ({ sessionLoading }) => (
	<Dropdown.Item
		className='text-center'
		onClick={() => signIn('facebook')}
		disabled={sessionLoading}
	>
		<i className='fa fa-facebook me-2' aria-hidden='true'></i>
		Log in with Facebook
	</Dropdown.Item>
);

export const TwitterLogin: React.FC<LoginProps> = ({ sessionLoading }) => (
	<Dropdown.Item
		className='text-center'
		onClick={() => signIn('twitter')}
		disabled={sessionLoading}
	>
		<i className='fa fa-twitter me-2' aria-hidden='true'></i>
		Log in with Twitter
	</Dropdown.Item>
);
