'use client';
import { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button, ListItemIcon, ListItemText, Menu, MenuItem, MenuList } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareFull } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import styles from '@/styles/main.module.css';

type LoginProps = {
	sessionLoading: boolean;
};

const GoogleLogin: React.FC<LoginProps> = ({ sessionLoading }) => (
	<MenuItem onClick={() => signIn('google')} disabled={sessionLoading}>
		<ListItemIcon sx={theme => ({ color: theme.palette.background.default })}>
			<FontAwesomeIcon className={styles.googleBrandColor} icon={faGoogle} mask={faSquareFull} />
		</ListItemIcon>
		<ListItemText>Log in with Google</ListItemText>
	</MenuItem>
);

const TwitterLogin: React.FC<LoginProps> = ({ sessionLoading }) => (
	<MenuItem onClick={() => signIn('twitter')} disabled={sessionLoading}>
		<ListItemIcon>
			<FontAwesomeIcon className='me-2' icon={faXTwitter} />
		</ListItemIcon>
		<ListItemText>Log in with Twitter</ListItemText>
	</MenuItem>
);

const Login: React.FC = () => {
	const [anchorElLogin, setAnchorElLogin] = useState<null | HTMLElement>(null);
	const { data: session, status } = useSession();
	const loading = status === 'loading';

	const handleOpenLoginMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElLogin(event.currentTarget);
	};

	const handleCloseLoginMenu = () => {
		setAnchorElLogin(null);
	};

	return session ? (
		<Button
			size='large'
			variant='text'
			sx={{ my: 2, display: 'block' }}
			color='light'
			onClick={() => signOut()}
			disabled={loading}
		>
			Log out
		</Button>
	) : (
		<>
			<Button
				size='large'
				variant='text'
				sx={{ my: 2, display: 'block' }}
				color='light'
				aria-label='open login menu'
				aria-controls='menu-login'
				aria-haspopup='true'
				onClick={handleOpenLoginMenu}
			>
				Log in
			</Button>
			<Menu
				id='menu-login'
				anchorEl={anchorElLogin}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				keepMounted
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				open={!!anchorElLogin}
				onClose={handleCloseLoginMenu}
			>
				<MenuList>
					<GoogleLogin sessionLoading={loading} />
					<TwitterLogin sessionLoading={loading} />
				</MenuList>
			</Menu>
		</>
	);
};

export default Login;
