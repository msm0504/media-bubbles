import { Dropdown } from 'react-bootstrap';
import { signIn } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faXTwitter } from '@fortawesome/free-brands-svg-icons';

import styles from '@/styles/styles.module.css';

type LoginProps = {
	sessionLoading: boolean;
};

export const FacebookLogin: React.FC<LoginProps> = ({ sessionLoading }) => (
	<Dropdown.Item
		className='text-center'
		onClick={() => signIn('facebook')}
		disabled={sessionLoading}
	>
		<FontAwesomeIcon className={`${styles.fbBrandColor} me-2`} icon={faFacebookF} />
		Log in with Facebook
	</Dropdown.Item>
);

export const TwitterLogin: React.FC<LoginProps> = ({ sessionLoading }) => (
	<Dropdown.Item
		className='text-center'
		onClick={() => signIn('twitter')}
		disabled={sessionLoading}
	>
		<FontAwesomeIcon className='me-2' icon={faXTwitter} />
		Log in with Twitter
	</Dropdown.Item>
);
