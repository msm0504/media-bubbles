'use client';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	capitalize,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import useAlerts from './use-alerts';
import { authClient, signIn } from '@/lib/auth-client';
import { EMAIL_PATTERN, getRequiredMessage } from '@/util/form-utils';

type StepOneProps = { onSuccess: (email: string) => void };
type StepTwoProps = { onSuccess: () => void };
type StepOneData = { email: string };
type StepTwoData = { token: string };
type UseEmailLoginDialog = { EmailLoginDialog: React.FC; openDialog: () => void };

const FormStepOne: React.FC<StepOneProps> = ({ onSuccess }) => {
	const [isProcessing, setProcessing] = useState<boolean>(false);
	const { control, handleSubmit } = useForm<StepOneData>({
		defaultValues: { email: '' },
		mode: 'onBlur',
	});
	const [Alert, showAlert] = useAlerts();

	const submitForm = (formData: StepOneData) => {
		setProcessing(true);
		signIn
			.magicLink({
				email: formData.email,
				callbackURL: window.location.href,
				newUserCallbackURL: window.location.href,
			})
			.then(resp => {
				setProcessing(false);
				if (!resp || resp.error) {
					showAlert('warning', 'Failed to send log in token');
				} else {
					onSuccess(formData.email);
				}
			});
	};

	return (
		<form onSubmit={handleSubmit(submitForm)}>
			<DialogContent>
				<Alert />
				<Controller
					control={control}
					name='email'
					rules={{
						required: getRequiredMessage('email'),
						pattern: { value: EMAIL_PATTERN, message: 'Invalid email format.' },
					}}
					render={({ field, formState: { errors } }) => (
						<TextField
							{...field}
							fullWidth
							label={capitalize(field.name)}
							placeholder='johndoe@domain.com'
							error={!!errors[field.name]}
							helperText={(errors[field.name]?.message as string) || ' '}
						/>
					)}
				/>
			</DialogContent>
			<DialogActions>
				<Button
					variant='contained'
					color='primary'
					type='submit'
					disabled={isProcessing}
					endIcon={isProcessing && <FontAwesomeIcon className='ms-2' icon={faSpinner} pulse />}
				>
					<strong>Send Log In Token</strong>
				</Button>
			</DialogActions>
		</form>
	);
};

const FormStepTwo: React.FC<StepTwoProps> = ({ onSuccess }) => {
	const [isProcessing, setProcessing] = useState<boolean>(false);
	const { control, handleSubmit } = useForm<StepTwoData>({
		defaultValues: { token: '' },
		mode: 'onBlur',
	});
	const [Alert, showAlert] = useAlerts();
	const { refetch } = authClient.useSession();

	const loginWithToken = (formData: StepTwoData) => {
		setProcessing(true);
		authClient.magicLink
			.verify({
				query: {
					token: formData.token,
					callbackURL: `${window.location.href}/#`,
					newUserCallbackURL: window.location.href,
				},
			})
			.then(resp => {
				setProcessing(false);
				if (!resp || resp.error) {
					showAlert('warning', 'Failed to verify log in token');
				} else {
					refetch();
					onSuccess();
				}
			});
	};

	return (
		<form onSubmit={handleSubmit(loginWithToken)}>
			<DialogContent>
				<Alert />
				<Controller
					control={control}
					name='token'
					rules={{ required: getRequiredMessage('token') }}
					render={({ field, formState: { errors } }) => (
						<TextField
							{...field}
							fullWidth
							label={capitalize(field.name)}
							error={!!errors[field.name]}
							helperText={(errors[field.name]?.message as string) || ' '}
						/>
					)}
				/>
			</DialogContent>
			<DialogActions>
				<Button
					variant='contained'
					color='primary'
					type='submit'
					disabled={isProcessing}
					endIcon={isProcessing && <FontAwesomeIcon className='ms-2' icon={faSpinner} pulse />}
				>
					<strong>Log In</strong>
				</Button>
			</DialogActions>
		</form>
	);
};

const useEmailLoginDialog = (): UseEmailLoginDialog => {
	const [isOpen, toggleOpen] = useState<boolean>(false);
	const [emailSentTo, setEmailSentTo] = useState<string>();

	useEffect(() => {
		// when dialog is opened, reset to step 1
		if (isOpen) {
			setEmailSentTo(undefined);
		}
	}, [isOpen]);

	const EmailLoginDialog: React.FC = () => {
		return (
			<Dialog fullWidth maxWidth='sm' open={isOpen} onClose={() => toggleOpen(false)}>
				<DialogTitle>Log In With Email</DialogTitle>
				{emailSentTo ? (
					<FormStepTwo onSuccess={() => toggleOpen(false)} />
				) : (
					<FormStepOne onSuccess={email => setEmailSentTo(email)} />
				)}
			</Dialog>
		);
	};

	return { EmailLoginDialog, openDialog: () => toggleOpen(true) };
};

export default useEmailLoginDialog;
