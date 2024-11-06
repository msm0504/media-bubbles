import { afterAll, afterEach, beforeAll, expect, test, vi } from 'vitest';
import { cleanup, render, fireEvent, screen, waitFor } from '@testing-library/react';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import FIELD_LIST from '../contact/field-list';
import Feedback from '../contact/page';
import { AppProviders } from '@/contexts';

vi.mock('next-auth/react', () => ({
	useSession: vi.fn(),
}));
const server = setupServer();

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const mockUser: Session = {
	user: {
		id: '12346',
		isAdmin: false,
		name: 'Some Guy',
		email: 'some.guy@test.com',
	},
	expires: tomorrow.toDateString(),
};

beforeAll(() => {
	Element.prototype.scrollIntoView = vi.fn();
	server.listen();
});

afterEach(() => {
	cleanup();
	server.resetHandlers();
});

afterAll(() => server.close());

test('renders correct input fields', () => {
	vi.mocked(useSession).mockReturnValue({ data: null, status: 'unauthenticated', update: vi.fn() });
	render(<Feedback />);
	FIELD_LIST.forEach(field =>
		field.type === 'text'
			? expect(screen.queryByLabelText(new RegExp(`^${field.name}$`, 'i'))).toBeInTheDocument()
			: expect(screen.queryByText(new RegExp(`^${field.name}$`, 'i'))).toBeInTheDocument()
	);
});

test('displays correct error messages for invalid input', () => {
	vi.mocked(useSession).mockReturnValue({ data: null, status: 'unauthenticated', update: vi.fn() });
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
	vi.mocked(useSession).mockReturnValue({
		data: mockUser,
		status: 'authenticated',
		update: vi.fn(),
	});
	server.use(http.post('/test/api/feedback', () => HttpResponse.json({ feedbackSent: true })));
	render(
		<AppProviders>
			<Feedback />
		</AppProviders>
	);

	fireEvent.change(screen.getByLabelText('Message'), {
		target: { value: 'This site is amazing!' },
	});

	fireEvent.click(screen.getByText('Send Message'));
	await waitFor(() => screen.getByRole('alert'));
	expect(screen.queryByText('Message sent successfully.')).toBeInTheDocument();
});

test('displays error alert after failed submit', async () => {
	vi.mocked(useSession).mockReturnValue({
		data: mockUser,
		status: 'authenticated',
		update: vi.fn(),
	});
	server.use(http.post('/test/api/feedback', () => HttpResponse.json({ feedbackSent: false })));
	render(
		<AppProviders>
			<Feedback />
		</AppProviders>
	);

	fireEvent.change(screen.getByLabelText('Message'), {
		target: { value: 'This site is amazing!' },
	});

	fireEvent.click(screen.getByText('Send Message'));
	await waitFor(() => screen.getByRole('alert'));
	expect(
		screen.queryByText('Sending this message failed. Please try again later.')
	).toBeInTheDocument();
});
