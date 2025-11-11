import { vi } from 'vitest';
import { useSession } from '../auth-client';

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
		role: 'user',
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

const mockAdmin: ReturnType<typeof useSession>['data'] = {
	user: {
		id: '12346',
		createdAt: today,
		updatedAt: today,
		name: 'Some Admin',
		email: 'some.admin@test.com',
		emailVerified: true,
		role: 'admin',
	},
	session: {
		id: '67891',
		createdAt: today,
		updatedAt: today,
		userId: '12346',
		expiresAt: tomorrow,
		token: 'abc123',
	},
};

export const mockUnauthSession: ReturnType<typeof useSession> = {
	data: null,
	isPending: false,
	isRefetching: false,
	error: null,
	refetch: vi.fn(),
};

export const mockPendSession: ReturnType<typeof useSession> = {
	data: null,
	isPending: true,
	isRefetching: false,
	error: null,
	refetch: vi.fn(),
};

export const mockUserSession: ReturnType<typeof useSession> = {
	data: mockUser,
	isPending: false,
	isRefetching: false,
	error: null,
	refetch: vi.fn(),
};

export const mockAdminSession: ReturnType<typeof useSession> = {
	data: mockAdmin,
	isPending: false,
	isRefetching: false,
	error: null,
	refetch: vi.fn(),
};
