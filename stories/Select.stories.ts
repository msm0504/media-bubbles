import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from '@/components/shared/base-ui';

const meta = {
	title: 'Styled Base UI/Select',
	component: Select,
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
	args: {
		items: [
			{ label: 'Gala', value: 'gala' },
			{ label: 'Fuji', value: 'fuji' },
			{ label: 'Honeycrisp', value: 'honeycrisp' },
			{ label: 'Granny Smith', value: 'granny-smith' },
			{ label: 'Pink Lady', value: 'pink-lady' },
		],
		label: 'Apples',
	},
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Contained: Story = {
	args: {
		variant: 'contained',
	},
};

export const Primary: Story = {
	args: {
		color: 'primary',
		variant: 'contained',
	},
};

export const Success: Story = {
	args: {
		color: 'success',
		variant: 'contained',
	},
};

export const Info: Story = {
	args: {
		color: 'info',
		variant: 'contained',
	},
};

export const Warning: Story = {
	args: {
		color: 'warning',
		variant: 'contained',
	},
};

export const Error: Story = {
	args: {
		color: 'error',
		variant: 'contained',
	},
};
