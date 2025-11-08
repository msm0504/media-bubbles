'use client';
import { useState } from 'react';
import { Button, ListItemIcon, ListItemText, Menu, MenuItem, MenuList } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareFull } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import useEmailLoginDialog from '@/hooks/use-email-login-dialog';
import { signIn, signOut, useSession } from '@/lib/auth-client';
import styles from '@/styles/main.module.css';

type LoginProps = {
	sessionLoading: boolean;
	closeMenu: () => void;
};

const GoogleLogin: React.FC<LoginProps> = ({ sessionLoading }) => (
	<MenuItem
		onClick={() =>
			signIn.social({
				provider: 'google',
				callbackURL: window.location.href,
				newUserCallbackURL: window.location.href,
			})
		}
		disabled={sessionLoading}
	>
		<ListItemIcon sx={theme => ({ color: theme.palette.background.default })}>
			<FontAwesomeIcon className={styles.googleBrandColor} icon={faGoogle} mask={faSquareFull} />
		</ListItemIcon>
		<ListItemText>Log in with Google</ListItemText>
	</MenuItem>
);

const EmailLogin: React.FC<LoginProps> = ({ sessionLoading, closeMenu }) => {
	const { EmailLoginDialog, openDialog } = useEmailLoginDialog();

	return (
		<>
			<EmailLoginDialog />
			<MenuItem
				onClick={() => {
					openDialog();
					closeMenu();
				}}
				disabled={sessionLoading}
			>
				<ListItemIcon>
					<FontAwesomeIcon className='me-2' icon={faPaperPlane} />
				</ListItemIcon>
				<ListItemText>Log in with Email</ListItemText>
			</MenuItem>
		</>
	);
};

const Login: React.FC = () => {
	const [anchorElLogin, setAnchorElLogin] = useState<null | HTMLElement>(null);
	const { data: session, isPending } = useSession();

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
			disabled={isPending}
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
					<GoogleLogin sessionLoading={isPending} closeMenu={handleCloseLoginMenu} />
					<EmailLogin sessionLoading={isPending} closeMenu={handleCloseLoginMenu} />
				</MenuList>
			</Menu>
		</>
	);
};

export default Login;
