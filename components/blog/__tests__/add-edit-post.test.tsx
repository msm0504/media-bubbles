import { beforeAll, afterAll, afterEach, expect, test, vi } from 'vitest';
import { cleanup, render, fireEvent, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import AddEditBlogPost from '../add-edit-post';
import FIELD_LIST from '../field-list';
import { AppProviders } from '@/contexts';
import { useSession } from '@/lib/auth-client';
import {
	mockAdminSession,
	mockUnauthSession,
	mockUserSession,
} from '@/lib/__mocks__/mock-sessions';

const server = setupServer();

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
	vi.mocked(useSession).mockReturnValue(mockUnauthSession);
	render(<AddEditBlogPost />);
	expect(screen.queryByText('You shall not post!')).toBeInTheDocument();
});

test('blocks access if not user is not admin', () => {
	vi.mocked(useSession).mockReturnValue(mockUserSession);
	render(<AddEditBlogPost />);
	expect(screen.queryByText('You shall not post!')).toBeInTheDocument();
});

test('renders correct input fields', () => {
	vi.mocked(useSession).mockReturnValue(mockAdminSession);
	render(<AddEditBlogPost />);
	FIELD_LIST.forEach(field =>
		expect(screen.queryByLabelText(new RegExp(`^${field.name}$`, 'i'))).toBeInTheDocument()
	);
});

test('displays correct error messages for invalid input', async () => {
	vi.mocked(useSession).mockReturnValue(mockAdminSession);
	render(<AddEditBlogPost />);
	const slugInput = screen.getByLabelText('Slug');

	fireEvent.blur(slugInput);
	expect(await screen.findByText('Slug is required')).toBeInTheDocument();

	fireEvent.change(slugInput, { target: { value: 's$ug' } });
	fireEvent.blur(slugInput);
	expect(
		await screen.findByText('Slug can only contain lowercase letters, numbers, and dashes.')
	).toBeInTheDocument();

	fireEvent.click(screen.getByText('Save Post'));
	expect(await screen.findByText('Title is required')).toBeInTheDocument();
	expect(await screen.findByText('Content is required')).toBeInTheDocument();
});

test('renders preview modal after button click', () => {
	vi.mocked(useSession).mockReturnValue(mockAdminSession);
	render(<AddEditBlogPost />);
	expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	fireEvent.click(screen.getByText('Preview'));
	expect(screen.queryByRole('dialog')).toBeInTheDocument();
});

test('displays success alert after successful submit', async () => {
	const mockItemId = 'item123';
	vi.mocked(useSession).mockReturnValue(mockAdminSession);
	server.use(
		http.post('http://test.com/api/blog-posts', () => HttpResponse.json({ itemId: mockItemId }))
	);
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
	vi.mocked(useSession).mockReturnValue(mockAdminSession);
	server.use(http.post('http://test.com/api/blog-posts', () => HttpResponse.json({})));
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
