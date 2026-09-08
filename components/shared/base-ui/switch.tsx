import { Switch as BaseSwitch } from '@base-ui/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons';
import { type SizeProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { CvaColorConfig } from '@/styles/color-variants';
import cn from '@/util/cn';
import tw from '@/util/tailwind-template';

const SWITCH_CVA_CONFIG: CvaColorConfig = {
	variants: {
		color: {
			primary: tw`data-checked:text-primary`,
			success: tw`data-checked:text-success`,
			info: tw`data-checked:text-info`,
			warning: tw`data-checked:text-warning`,
			error: tw`data-checked:text-error`,
			neutral: tw`data-checked:text-black`,
		},
	},
};

const switchVariants = cva('text-black data-disabled:text-slate-400', {
	...SWITCH_CVA_CONFIG,
	defaultVariants: {
		color: 'primary',
	},
});

type SwitchProps = BaseSwitch.Root.Props &
	VariantProps<typeof switchVariants> & {
		size?: SizeProp;
	};

const Switch: React.FC<SwitchProps> = ({ color, className, size = 'xl', ...props }) => (
	<BaseSwitch.Root
		className={cn(switchVariants({ color }), className)}
		{...props}
		render={(props, state) => (
			<span {...props}>
				<FontAwesomeIcon icon={state.checked ? faToggleOn : faToggleOff} size={size} />
			</span>
		)}
	/>
);

export default Switch;
