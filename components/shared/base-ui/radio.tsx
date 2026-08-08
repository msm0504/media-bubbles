import { Radio as BaseRadio } from '@base-ui/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { faCircle, faCircleDot } from '@fortawesome/free-regular-svg-icons';
import { type SizeProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { CvaColorConfig } from '@/styles/color-variants';
import cn from '@/util/cn';
import tw from '@/util/tailwind-template';

const RADIO_CVA_CONFIG: CvaColorConfig = {
	variants: {
		color: {
			primary: tw`data-checked:text-primary`,
			secondary: tw`data-checked:text-gray-600`,
			success: tw`data-checked:text-success`,
			info: tw`data-checked:text-info`,
			warning: tw`data-checked:text-warning`,
			error: tw`data-checked:text-error`,
			neutral: tw`data-checked:text-black`,
		},
	},
};

const radioVariants = cva('text-black data-disabled:text-gray-400', {
	...RADIO_CVA_CONFIG,
	defaultVariants: {
		color: 'primary',
	},
});

type RadioProps = BaseRadio.Root.Props &
	VariantProps<typeof radioVariants> & {
		size?: SizeProp;
	};

const Radio: React.FC<RadioProps> = ({ color, className, size = 'lg', ...props }) => (
	<BaseRadio.Root
		className={cn(radioVariants({ color }), className)}
		{...props}
		render={(props, state) => (
			<span {...props}>
				<FontAwesomeIcon icon={state.checked ? faCircleDot : faCircle} size={size} />
			</span>
		)}
	></BaseRadio.Root>
);

export default Radio;
