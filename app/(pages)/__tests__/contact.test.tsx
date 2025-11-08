import { afterAll, afterEach, beforeAll, expect, test, vi } from 'vitest';
import { cleanup, render, fireEvent, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { capitalize } from '@mui/material';
import FIELD_LIST from '../contact/field-list';
import Feedback from '../contact/page';
import { AppProviders } from '@/contexts';
import { useSession } from '@/lib/auth-client';

vi.mock('@/lib/auth-client', () => ({
	useSession: vi.fn(),
}));
const server = setupServer();

const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const mockUser: ReturnType<typeof useSession>['data'] = {
	user: {
		id: '12345',
		createdAt: today,
		updatedAt: today,
		name: 'Some Guy',
		email: 'some.guy@test.com',
		emailVerified: true,
	},
	session: {
		id: '67890',
		createdAt: today,
		updatedAt: today,
		userId: '12345',
		expiresAt: tomorrow,
		token: 'abc123',
	},
};

const mockUnauthSession: ReturnType<typeof useSession> = {
	data: null,
	isPending: false,
	isRefetching: false,
	error: null,
	refetch: vi.fn(),
};

const mockAuthSession: ReturnType<typeof useSession> = {
	data: mockUser,
	isPending: false,
	isRefetching: false,
	error: null,
	refetch: vi.fn(),
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
	vi.mocked(useSession).mockReturnValue(mockUnauthSession);
	render(<Feedback />);
	FIELD_LIST.forEach(field =>
		field.type === 'text'
			? expect(screen.queryByLabelText(capitalize(field.name))).toBeInTheDocument()
			: expect(screen.queryByText(capitalize(field.name))).toBeInTheDocument()
	);
});

test('displays correct error messages for invalid input', async () => {
	vi.mocked(useSession).mockReturnValue(mockUnauthSession);
	render(<Feedback />);
	const emailInput = screen.getByLabelText('Email');

	fireEvent.blur(emailInput);
	expect(await screen.findByText('Email is required')).toBeInTheDocument();

	fireEvent.change(emailInput, { target: { value: 'test@gmail.' } });
	fireEvent.blur(emailInput);
	expect(await screen.findByText('Invalid email format.')).toBeInTheDocument();

	fireEvent.click(screen.getByText('Send Message'));
	expect(await screen.findByText('Name is required')).toBeInTheDocument();
	expect(await screen.findByText('Message is required')).toBeInTheDocument();
});

test('displays success alert after successful submit', async () => {
	vi.mocked(useSession).mockReturnValue(mockAuthSession);
	server.use(
		http.post('http://test.com/api/feedback', () => HttpResponse.json({ feedbackSent: true }))
	);
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
	vi.mocked(useSession).mockReturnValue(mockAuthSession);
	server.use(
		http.post('http://test.com/api/feedback', () => HttpResponse.json({ feedbackSent: false }))
	);
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
