import { Dropdown } from 'react-bootstrap';
import { signIn } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { brands } from '@fortawesome/fontawesome-svg-core/import.macro';

type LoginProps = {
	sessionLoading: boolean;
};

export const FacebookLogin: React.FC<LoginProps> = ({ sessionLoading }) => (
	<Dropdown.Item
		className='text-center'
		onClick={() => signIn('facebook')}
		disabled={sessionLoading}
	>
		<FontAwesomeIcon className='brand-color me-2' icon={brands('facebook-f')} />
		Log in with Facebook
	</Dropdown.Item>
);

export const TwitterLogin: React.FC<LoginProps> = ({ sessionLoading }) => (
	<Dropdown.Item
		className='text-center'
		onClick={() => signIn('twitter')}
		disabled={sessionLoading}
	>
		<FontAwesomeIcon className='me-2' icon={brands('x-twitter')} />
		Log in with Twitter
	</Dropdown.Item>
);
