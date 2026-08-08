import type { PropsWithChildren } from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { BUTTON_CVA_CONFIG } from './button-variants';
import cn from '@/util/cn';

const buttonVariants = cva('flex h-8 items-center justify-center gap-2 rounded-xl px-4 py-5', {
	...BUTTON_CVA_CONFIG,
	defaultVariants: {
		color: 'primary',
		variant: 'contained',
	},
});

type ButtonProps = BaseButton.Props & VariantProps<typeof buttonVariants> & PropsWithChildren;

const Button: React.FC<ButtonProps> = ({ color, variant, className, children, ...props }) => (
	<BaseButton className={cn(buttonVariants({ color, variant }), className)} {...props}>
		{children}
	</BaseButton>
);

export default Button;
