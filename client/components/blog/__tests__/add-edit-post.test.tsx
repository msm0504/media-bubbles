import { cleanup, render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';

import AddEditBlogPost, { fieldList } from '../add-edit-post';
import { AppProviders } from '../../../contexts';
import { callApi } from '../../../services/api-service';

jest.mock('next/router');
jest.mock('next-auth/client');
jest.mock('../../../services/api-service');

const mockUser: Session = {
	user: {
		id: '12346',
		isAdmin: false,
		name: 'Some Guy',
		email: 'some.guy@test.com'
	}
};

const mockAdmin: Session = {
	user: {
		id: '12345',
		isAdmin: true,
		name: 'John Doe',
		email: 'john.doe@test.com'
	}
};

beforeAll(() => {
	Element.prototype.scrollIntoView = jest.fn();
	(useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
});

afterEach(cleanup);

test('blocks access if not logged in', () => {
	(useSession as jest.Mock).mockReturnValue([null, false]);
	render(<AddEditBlogPost />);
	expect(screen.queryByText('You shall not post!')).toBeInTheDocument();
});

test('blocks access if not user is not admin', () => {
	(useSession as jest.Mock).mockReturnValue([mockUser, false]);
	render(<AddEditBlogPost />);
	expect(screen.queryByText('You shall not post!')).toBeInTheDocument();
});

test('renders correct input fields', () => {
	(useSession as jest.Mock).mockReturnValue([mockAdmin, false]);
	render(<AddEditBlogPost />);
	fieldList.forEach(field =>
		expect(screen.queryByLabelText(new RegExp(`^${field.name}$`, 'i'))).toBeInTheDocument()
	);
});

test('displays correct error messages for invalid input', () => {
	(useSession as jest.Mock).mockReturnValue([mockAdmin, false]);
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
	(useSession as jest.Mock).mockReturnValue([mockAdmin, false]);
	render(<AddEditBlogPost />);
	expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	fireEvent.click(screen.getByText('Preview'));
	expect(screen.queryByRole('dialog')).toBeInTheDocument();
});

test('displays success alert after successful submit', async () => {
	const mockItemId = 'item123';
	(useSession as jest.Mock).mockReturnValue([mockAdmin, false]);
	(callApi as jest.Mock).mockReturnValue(new Promise(resolve => resolve({ itemId: mockItemId })));
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
	(useSession as jest.Mock).mockReturnValue([mockAdmin, false]);
	(callApi as jest.Mock).mockReturnValue(new Promise(resolve => resolve({})));
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
