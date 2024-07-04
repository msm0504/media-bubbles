import { Dropdown } from 'react-bootstrap';
import { signIn } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareFull } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faXTwitter } from '@fortawesome/free-brands-svg-icons';

import styles from '@/styles/styles.module.css';

type LoginProps = {
	sessionLoading: boolean;
};

export const GoogleLogin: React.FC<LoginProps> = ({ sessionLoading }) => (
	<Dropdown.Item className='text-center' onClick={() => signIn('google')} disabled={sessionLoading}>
		<FontAwesomeIcon
			className={`${styles.googleBrandColor} me-2 text-light`}
			icon={faGoogle}
			mask={faSquareFull}
		/>
		Log in with Google
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
