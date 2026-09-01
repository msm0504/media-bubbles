import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Checkbox } from '@/components/shared/base-ui';

const meta = {
	title: 'Styled Base UI/Checkbox',
	component: Checkbox,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		color: {
			control: 'select',
			options: ['primary', 'secondary', 'success', 'info', 'warning', 'error', 'neutral'],
		},
		size: { control: 'text' },
	},
	args: { onClick: fn() },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		color: 'primary',
	},
};

export const Large: Story = {
	args: {
		size: 'xl',
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

export const Disabled: Story = {
	args: {
		disabled: true,
	},
};
