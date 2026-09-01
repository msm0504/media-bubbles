import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Pagination } from '@/components/shared/base-ui';

const meta = {
	title: 'Styled Base UI/Pagination',
	component: Pagination,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		color: {
			control: 'select',
			options: ['primary', 'secondary', 'success', 'info', 'warning', 'error', 'neutral'],
		},
	},
	args: { page: 1, count: 11, showFirstButton: true, showLastButton: true, onChange: fn() },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		color: 'primary',
	},
};

export const Success: Story = {
	args: {
		color: 'success',
	},
};

export const Info: Story = {
	args: {
		color: 'info',
	},
};

export const Warning: Story = {
	args: {
		color: 'warning',
	},
};

export const Error: Story = {
	args: {
		color: 'error',
	},
};

export const Boundary: Story = {
	args: {
		color: 'primary',
		page: 5,
		boundaryCount: 2,
	},
};

export const Sibling: Story = {
	args: {
		color: 'primary',
		page: 5,
		siblingCount: 0,
	},
};
