import { useEffect } from 'react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { cleanup, render, fireEvent, screen } from '@testing-library/react';
import { signIn } from 'next-auth/react';
import useEmailLoginDialog from '../use-email-login-dialog';

vi.mock('next-auth/react', () => ({
	signIn: vi.fn(),
}));

beforeEach(() => {
	const Wrapper = () => {
		const { EmailLoginDialog, openDialog } = useEmailLoginDialog();

		useEffect(() => {
			openDialog();
		}, [openDialog]);

		return <EmailLoginDialog />;
	};
	render(<Wrapper />);
});

afterEach(cleanup);

test('renders the component', () => {
	expect(screen.queryByText('Log In With Email')).toBeInTheDocument();
});

test('validates email input on step 1', async () => {
	const emailInput = screen.getByLabelText('Email');
	fireEvent.blur(emailInput);
	expect(await screen.findByText('Email is required')).toBeInTheDocument();
	fireEvent.change(emailInput, { target: { value: 'test@gmail.' } });
	fireEvent.blur(emailInput);
	expect(await screen.findByText('Invalid email format.')).toBeInTheDocument();
});

test('displays alert if signin returns no response', async () => {
	vi.mocked(signIn).mockResolvedValue(undefined);
	const emailInput = screen.getByLabelText('Email');
	fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
	fireEvent.click(screen.getByText('Send Log In Token'));
	expect(await screen.findByText('Failed to send log in token')).toBeInTheDocument();
});

test('displays alert if signin returns error', async () => {
	vi.mocked(signIn).mockResolvedValue({
		error: 'some error',
		code: undefined,
		status: 200,
		ok: true,
		url: null,
	});

	const emailInput = screen.getByLabelText('Email');
	fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
	fireEvent.click(screen.getByText('Send Log In Token'));
	expect(await screen.findByText('Failed to send log in token')).toBeInTheDocument();
});

test('displays step 2 signin successful', async () => {
	vi.mocked(signIn).mockResolvedValue({
		error: undefined,
		code: undefined,
		status: 200,
		ok: true,
		url: 'someurl.test',
	});

	const emailInput = screen.getByLabelText('Email');
	fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
	fireEvent.click(screen.getByText('Send Log In Token'));
	expect(await screen.findByLabelText('Token')).toBeInTheDocument();
});

test('validates token input on step 2', async () => {
	vi.mocked(signIn).mockResolvedValue({
		error: undefined,
		code: undefined,
		status: 200,
		ok: true,
		url: 'someurl.test',
	});

	const emailInput = screen.getByLabelText('Email');
	fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
	fireEvent.click(screen.getByText('Send Log In Token'));

	const tokenInput = await screen.findByLabelText('Token');
	fireEvent.blur(tokenInput);
	expect(await screen.findByText('Token is required')).toBeInTheDocument();
});
