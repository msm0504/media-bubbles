'use client';
import { NavigationMenu } from '@base-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareFull } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { Button } from './base-ui';
import useEmailLoginDialog from '@/hooks/use-email-login-dialog';
import { signIn, signOut, useSession } from '@/lib/auth-client';

type LoginProps = {
	sessionLoading: boolean;
};

const GoogleLogin: React.FC<LoginProps> = ({ sessionLoading }) => (
	<li>
		<Button
			color='neutral'
			variant='text'
			onClick={() =>
				signIn.social({
					provider: 'google',
					callbackURL: window.location.href,
					newUserCallbackURL: window.location.href,
				})
			}
			disabled={sessionLoading}
		>
			<FontAwesomeIcon
				className='bg-conic-[from_-45deg,#ea4335_110deg,#4285f4_90deg_180deg,#34a853_180deg_270deg,#fbbc05_270deg] bg-size-[150%_150%] bg-position-[73%_55%] bg-no-repeat'
				icon={faGoogle}
				mask={faSquareFull}
				inverse
				widthAuto
			/>
			Log in with Google
		</Button>
	</li>
);

const EmailLogin: React.FC<LoginProps & { openDialog: () => void }> = ({
	openDialog,
	sessionLoading,
}) => {
	return (
		<Button color='neutral' variant='text' onClick={openDialog} disabled={sessionLoading}>
			<FontAwesomeIcon icon={faPaperPlane} />
			Log in with Email
		</Button>
	);
};

const Login: React.FC = () => {
	const { data: session, isPending } = useSession();
	const { EmailLoginDialog, openDialog } = useEmailLoginDialog();

	return (
		<>
			<NavigationMenu.Item>
				{session ? (
					<Button
						className='my-2 text-lg'
						color='neutral'
						variant='contained'
						onClick={() => signOut()}
						disabled={isPending}
					>
						Log out
					</Button>
				) : (
					<>
						<NavigationMenu.Trigger
							render={props => (
								<Button className='my-2 text-lg' {...props} color='neutral' variant='contained'>
									Log in
								</Button>
							)}
						/>
						<NavigationMenu.Content>
							<ul>
								<GoogleLogin sessionLoading={isPending} />
								<EmailLogin sessionLoading={isPending} openDialog={openDialog} />
							</ul>
						</NavigationMenu.Content>
					</>
				)}
			</NavigationMenu.Item>
			<EmailLoginDialog />
		</>
	);
};

export default Login;
