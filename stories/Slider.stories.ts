import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Slider } from '@/components/shared/base-ui';
import tw from '@/util/tailwind-template';

const meta = {
	title: 'Styled Base UI/Slider',
	component: Slider,
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
	args: {
		label: 'Slider',
		className: tw`items-left flex flex-col justify-center gap-2`,
		onClick: fn(),
	},
} satisfies Meta<typeof Slider>;

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

export const Disabled: Story = {
	args: {
		disabled: true,
	},
};
