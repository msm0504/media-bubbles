import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '@/components/shared/base-ui';

const meta = {
	title: 'Styled Base UI/Button',
	component: Button,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		disabled: { control: 'boolean' },
		color: {
			control: 'select',
			options: ['primary', 'secondary', 'success', 'info', 'warning', 'error', 'neutral'],
		},
		variant: {
			control: 'select',
			option: ['contained', 'outlined', 'text'],
		},
	},
	args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		color: 'primary',
		children: 'Button',
	},
};

export const Outlined: Story = {
	args: {
		color: 'primary',
		variant: 'outlined',
		children: 'Button',
	},
};

export const Text: Story = {
	args: {
		color: 'primary',
		variant: 'text',
		children: 'Button',
	},
};

export const Success: Story = {
	args: {
		color: 'success',
		children: 'Button',
	},
};

export const Info: Story = {
	args: {
		color: 'info',
		children: 'Button',
	},
};

export const Warning: Story = {
	args: {
		color: 'warning',
		children: 'Button',
	},
};

export const Error: Story = {
	args: {
		color: 'error',
		children: 'Button',
	},
};
