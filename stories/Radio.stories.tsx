import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { RadioGroup } from '@base-ui/react';
import { Radio } from '@/components/shared/base-ui';

const meta = {
	title: 'Styled Base UI/Radio',
	component: props => (
		<RadioGroup className='flex flex-col items-start gap-1'>
			<label className='flex items-center gap-2'>
				<Radio {...props} value='option1' />
				Option 1
			</label>
			<label className='flex items-center gap-2'>
				<Radio {...props} value='option2' />
				Option 2
			</label>
		</RadioGroup>
	),
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
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		value: '',
		color: 'primary',
	},
};

export const Large: Story = {
	args: {
		value: '',
		size: 'xl',
	},
};

export const Success: Story = {
	args: {
		value: '',
		color: 'success',
	},
};

export const Info: Story = {
	args: {
		value: '',
		color: 'info',
	},
};

export const Warning: Story = {
	args: {
		value: '',
		color: 'warning',
	},
};

export const Error: Story = {
	args: {
		value: '',
		color: 'error',
	},
};

export const Disabled: Story = {
	args: {
		value: '',
		disabled: true,
	},
};
