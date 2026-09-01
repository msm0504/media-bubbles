import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from '@/components/shared/base-ui';

const meta = {
	title: 'Styled Base UI/Alert',
	component: Alert,
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
	args: { description: 'This is a public service announcement. This is only a test.' },
} satisfies Meta<typeof Alert>;

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

export const WithTitle: Story = {
	args: {
		color: 'warning',
		title: 'Warning!',
	},
};

export const Error: Story = {
	args: {
		color: 'error',
	},
};

export const CloseButton: Story = {
	args: {
		color: 'warning',
		title: 'Warning!',
		onClose: () => {},
	},
};
