'use client';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Dialog, Field } from '@base-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import useAlerts from './use-alerts';
import { Button } from '@/components/shared/base-ui';
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
			<div className='flex flex-col gap-4'>
				<Alert />
				<Controller
					control={control}
					name='email'
					rules={{
						required: getRequiredMessage('email'),
						pattern: { value: EMAIL_PATTERN, message: 'Invalid email format.' },
					}}
					render={({ field, formState: { errors } }) => (
						<Field.Root className='flex flex-col items-start gap-1' invalid={!!errors[field.name]}>
							<Field.Label className='font-bold capitalize'>{field.name}</Field.Label>
							<Field.Control
								{...field}
								className='w-full rounded-xl border border-neutral-950 bg-white px-2 py-1 text-sm text-neutral-950 placeholder:text-neutral-500 focus:outline-2 focus:-outline-offset-1 focus:outline-neutral-950'
								placeholder='johndoe@domain.com'
							/>
							{errors[field.name] ? (
								<Field.Error className='text-sm text-error' match>
									{errors[field.name]?.message as string}
								</Field.Error>
							) : null}
						</Field.Root>
					)}
				/>
				<div className='flex justify-end'>
					<Button variant='contained' color='primary' type='submit' disabled={isProcessing}>
						<strong>Send Log In Token</strong>
						{isProcessing && <FontAwesomeIcon className='ms-2' icon={faSpinner} spinPulse />}
					</Button>
				</div>
			</div>
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
			<div className='flex flex-col gap-4'>
				<Alert />
				<Controller
					control={control}
					name='token'
					rules={{ required: getRequiredMessage('token') }}
					render={({ field, formState: { errors } }) => (
						<Field.Root className='flex flex-col items-start gap-1' invalid={!!errors[field.name]}>
							<Field.Label className='font-bold capitalize'>{field.name}</Field.Label>
							<Field.Control
								{...field}
								className='w-full rounded-xl border border-neutral-950 bg-white px-2 py-1 text-sm text-neutral-950 placeholder:text-neutral-500 focus:outline-2 focus:-outline-offset-1 focus:outline-neutral-950'
							/>
							{errors[field.name] ? (
								<Field.Error className='text-sm text-error' match>
									{errors[field.name]?.message as string}
								</Field.Error>
							) : null}
						</Field.Root>
					)}
				/>
				<div className='flex justify-end'>
					<Button variant='contained' color='primary' type='submit' disabled={isProcessing}>
						<strong>Log In</strong>
						{isProcessing && <FontAwesomeIcon className='ms-2' icon={faSpinner} spinPulse />}
					</Button>
				</div>
			</div>
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
			<Dialog.Root open={isOpen} onOpenChange={toggleOpen}>
				<Dialog.Portal>
					<Dialog.Backdrop className='fixed inset-0 min-h-dvh bg-black/20 data-ending-style:opacity-0 data-starting-style:opacity-0' />
					<Dialog.Popup className='fixed top-1/2 left-1/2 flex w-full max-w-sm -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-xl bg-white p-4 text-neutral-950 shadow-lg outline-none data-ending-style:scale-98 data-ending-style:opacity-0 data-starting-style:scale-98 data-starting-style:opacity-0'>
						<Dialog.Title className='text-xl font-bold'>Log In With Email</Dialog.Title>
						{emailSentTo ? (
							<FormStepTwo onSuccess={() => toggleOpen(false)} />
						) : (
							<FormStepOne onSuccess={email => setEmailSentTo(email)} />
						)}
					</Dialog.Popup>
				</Dialog.Portal>
			</Dialog.Root>
		);
	};

	return { EmailLoginDialog, openDialog: () => toggleOpen(true) };
};

export default useEmailLoginDialog;
