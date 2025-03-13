'use client';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
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
import { EMAIL_PATTERN, getRequiredMessage } from '@/util/form-utils';
import formatGetQuery from '@/util/format-get-query';

type StepOneProps = { onSuccess?: (email: string) => void };
type StepTwoProps = { email: string };
type StepOneData = { email: string };
type StepTwoData = { token: string };
type UseEmailLoginDialog = { EmailLoginDialog: React.FC; openDialog: () => void };

const LOGIN_URL = `${process.env.NEXT_PUBLIC_URL}/api/auth/callback/mailgun`;

const FormStepOne: React.FC<StepOneProps> = ({ onSuccess }) => {
	const [isProcessing, setProcessing] = useState<boolean>(false);
	const { control, handleSubmit } = useForm<StepOneData>({
		defaultValues: { email: '' },
		mode: 'onBlur',
	});
	const [Alert, showAlert] = useAlerts();

	const submitForm = (formData: StepOneData) => {
		setProcessing(true);
		signIn('mailgun', { redirect: false, ...formData }).then(resp => {
			setProcessing(false);
			if (!resp || resp.error) {
				showAlert('warning', 'Failed to send log in token');
			} else if (typeof onSuccess === 'function') {
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

const FormStepTwo: React.FC<StepTwoProps> = ({ email }) => {
	const { control, handleSubmit } = useForm<StepTwoData>({
		defaultValues: { token: '' },
		mode: 'onBlur',
	});

	if (!email) return null;

	const params: Record<string, unknown> = {
		callbackUrl: encodeURIComponent(window.location.href),
		email,
	};

	const loginWithToken = (formData: StepTwoData) => {
		params.token = formData.token;
		window.location.assign(`${LOGIN_URL}${formatGetQuery(params)}`);
	};

	return (
		<form onSubmit={handleSubmit(loginWithToken)}>
			<DialogContent>
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
				<Button variant='contained' color='primary' type='submit'>
					<strong>Log In</strong>
				</Button>
			</DialogActions>
		</form>
	);
};

const useEmailLoginDialog = (): UseEmailLoginDialog => {
	const [isOpen, toggleOpen] = useState<boolean>(false);

	const EmailLoginDialog = () => {
		const [emailSentTo, setEmailSentTo] = useState<string>();

		return (
			<Dialog fullWidth maxWidth='sm' open={isOpen} onClose={() => toggleOpen(false)}>
				<DialogTitle>Log In With Email</DialogTitle>
				{emailSentTo ? (
					<FormStepTwo email={emailSentTo} />
				) : (
					<FormStepOne onSuccess={email => setEmailSentTo(email)} />
				)}
			</Dialog>
		);
	};

	return { EmailLoginDialog, openDialog: () => toggleOpen(true) };
};

export default useEmailLoginDialog;
