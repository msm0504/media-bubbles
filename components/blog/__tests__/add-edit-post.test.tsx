import { beforeAll, afterAll, afterEach, expect, test, vi } from 'vitest';
import { cleanup, render, fireEvent, screen, waitFor } from '@testing-library/react';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import AddEditBlogPost, { fieldList } from '../add-edit-post';
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

const mockAdmin: Session = {
	user: {
		id: '12345',
		isAdmin: true,
		name: 'John Doe',
		email: 'john.doe@test.com',
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

test('blocks access if not logged in', () => {
	vi.mocked(useSession).mockReturnValue({ data: null, status: 'unauthenticated', update: vi.fn() });
	render(<AddEditBlogPost />);
	expect(screen.queryByText('You shall not post!')).toBeInTheDocument();
});

test('blocks access if not user is not admin', () => {
	vi.mocked(useSession).mockReturnValue({
		data: mockUser,
		status: 'authenticated',
		update: vi.fn(),
	});
	render(<AddEditBlogPost />);
	expect(screen.queryByText('You shall not post!')).toBeInTheDocument();
});

test('renders correct input fields', () => {
	vi.mocked(useSession).mockReturnValue({
		data: mockAdmin,
		status: 'authenticated',
		update: vi.fn(),
	});
	render(<AddEditBlogPost />);
	fieldList.forEach(field =>
		expect(screen.queryByLabelText(new RegExp(`^${field.name}$`, 'i'))).toBeInTheDocument()
	);
});

test('displays correct error messages for invalid input', () => {
	vi.mocked(useSession).mockReturnValue({
		data: mockAdmin,
		status: 'authenticated',
		update: vi.fn(),
	});
	render(<AddEditBlogPost />);
	const slugInput = screen.getByLabelText('Slug');

	fireEvent.blur(slugInput);
	expect(screen.queryByText('Slug is required')).toBeInTheDocument();

	fireEvent.change(slugInput, { target: { value: 's$ug' } });
	fireEvent.blur(slugInput);
	expect(
		screen.queryByText('Slug can only contain lowercase letters, numbers, and dashes.')
	).toBeInTheDocument();

	fireEvent.click(screen.getByText('Save Post'));
	expect(screen.queryByText('Title is required')).toBeInTheDocument();
	expect(screen.queryByText('Content is required')).toBeInTheDocument();
});

test('renders preview modal after button click', () => {
	vi.mocked(useSession).mockReturnValue({
		data: mockAdmin,
		status: 'authenticated',
		update: vi.fn(),
	});
	render(<AddEditBlogPost />);
	expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	fireEvent.click(screen.getByText('Preview'));
	expect(screen.queryByRole('dialog')).toBeInTheDocument();
});

test('displays success alert after successful submit', async () => {
	const mockItemId = 'item123';
	vi.mocked(useSession).mockReturnValue({
		data: mockAdmin,
		status: 'authenticated',
		update: vi.fn(),
	});
	server.use(http.post('/test/api/blog-posts', () => HttpResponse.json({ itemId: mockItemId })));
	render(
		<AppProviders>
			<AddEditBlogPost />
		</AppProviders>
	);

	fireEvent.change(screen.getByLabelText('Slug'), { target: { value: 'slug' } });
	fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Title!' } });
	fireEvent.change(screen.getByLabelText('Content'), { target: { value: 'Content!' } });

	fireEvent.click(screen.getByText('Save Post'));
	await waitFor(() => screen.getByRole('alert'));
	expect(screen.queryByText(`Blog post ${mockItemId} saved successfully.`)).toBeInTheDocument();
});

test('displays error alert after failed submit', async () => {
	vi.mocked(useSession).mockReturnValue({
		data: mockAdmin,
		status: 'authenticated',
		update: vi.fn(),
	});
	server.use(http.post('/test/api/blog-posts', () => HttpResponse.json({})));
	render(
		<AppProviders>
			<AddEditBlogPost />
		</AppProviders>
	);

	fireEvent.change(screen.getByLabelText('Slug'), { target: { value: 'slug' } });
	fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Title!' } });
	fireEvent.change(screen.getByLabelText('Content'), { target: { value: 'Content!' } });

	fireEvent.click(screen.getByText('Save Post'));
	await waitFor(() => screen.getByRole('alert'));
	expect(
		screen.queryByText('Saving blog post failed. Please try again later.')
	).toBeInTheDocument();
});
