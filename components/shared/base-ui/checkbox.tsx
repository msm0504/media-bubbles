import { Checkbox as BaseCheckbox } from '@base-ui/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { faSquare, faCheckSquare } from '@fortawesome/free-regular-svg-icons';
import { type SizeProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { CvaColorConfig } from '@/styles/color-variants';
import cn from '@/util/cn';
import tw from '@/util/tailwind-template';

const CHECKBOX_CVA_CONFIG: CvaColorConfig = {
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

const checkboxVariants = cva('text-black data-disabled:text-slate-400', {
	...CHECKBOX_CVA_CONFIG,
	defaultVariants: {
		color: 'primary',
	},
});

type CheckboxProps = BaseCheckbox.Root.Props &
	VariantProps<typeof checkboxVariants> & {
		size?: SizeProp;
	};

const Checkbox: React.FC<CheckboxProps> = ({ color, className, size = 'lg', ...props }) => (
	<BaseCheckbox.Root
		className={cn(checkboxVariants({ color }), className)}
		{...props}
		render={(props, state) => (
			<span {...props}>
				<FontAwesomeIcon icon={state.checked ? faCheckSquare : faSquare} size={size} />
			</span>
		)}
	/>
);

export default Checkbox;
