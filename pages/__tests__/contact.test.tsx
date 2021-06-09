import { cleanup, render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/client';

import Feedback, { fieldList } from '../contact';
import { AppProviders } from '../../client/contexts';
import { callApi } from '../../client/services/api-service';

jest.mock('next-auth/client');
jest.mock('../../client/services/api-service');

const mockUser: Session = {
	user: {
		id: '12346',
		isAdmin: false,
		name: 'Some Guy',
		email: 'some.guy@test.com'
	}
};

beforeAll(() => {
	Element.prototype.scrollIntoView = jest.fn();
});

afterEach(cleanup);

test('renders correct input fields', () => {
	(useSession as jest.Mock).mockReturnValue([null, false]);
	render(<Feedback />);
	fieldList.forEach(field =>
		field.type === 'text'
			? expect(screen.queryByLabelText(new RegExp(`^${field.name}$`, 'i'))).toBeInTheDocument()
			: expect(screen.queryByText(new RegExp(`^${field.name}$`, 'i'))).toBeInTheDocument()
	);
});

test('displays correct error messages for invalid input', () => {
	(useSession as jest.Mock).mockReturnValue([null, false]);
	render(<Feedback />);
	const emailInput = screen.getByLabelText('Email');

	fireEvent.blur(emailInput);
	expect(screen.queryByText('Email is required')).toBeInTheDocument();

	fireEvent.change(emailInput, { target: { value: 'test@gmail.' } });
	fireEvent.blur(emailInput);
	expect(screen.queryByText('Invalid email format.')).toBeInTheDocument();

	fireEvent.click(screen.getByText('Send Message'));
	expect(screen.queryByText('Name is required')).toBeInTheDocument();
	expect(screen.queryByText('Message is required')).toBeInTheDocument();
});

test('displays success alert after successful submit', async () => {
	(useSession as jest.Mock).mockReturnValue([mockUser, false]);
	(callApi as jest.Mock).mockReturnValue(new Promise(resolve => resolve({ feedbackSent: true })));
	render(
		<AppProviders>
			<Feedback />
		</AppProviders>
	);

	fireEvent.change(screen.getByLabelText('Message'), {
		target: { value: 'This site is amazing!' }
	});

	fireEvent.click(screen.getByText('Send Message'));
	await waitFor(() => screen.getByRole('alert'));
	expect(screen.queryByText('Message sent successfully.')).toBeInTheDocument();
});

test('displays error alert after failed submit', async () => {
	(useSession as jest.Mock).mockReturnValue([mockUser, false]);
	(callApi as jest.Mock).mockReturnValue(new Promise(resolve => resolve({ feedbackSent: false })));
	render(
		<AppProviders>
			<Feedback />
		</AppProviders>
	);

	fireEvent.change(screen.getByLabelText('Message'), {
		target: { value: 'This site is amazing!' }
	});

	fireEvent.click(screen.getByText('Send Message'));
	await waitFor(() => screen.getByRole('alert'));
	expect(
		screen.queryByText('Sending this message failed. Please try again later.')
	).toBeInTheDocument();
});
