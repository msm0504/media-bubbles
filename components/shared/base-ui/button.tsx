import type { ComponentProps } from 'react';
import Link from 'next/link';
import { Button as BaseButton } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { BUTTON_CVA_CONFIG } from './button-variants';
import cn from '@/util/cn';

const buttonVariants = cva(
	'flex h-8 items-center justify-center gap-2 rounded-full px-4 py-5 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2',
	{
		...BUTTON_CVA_CONFIG,
		defaultVariants: {
			color: 'primary',
			variant: 'contained',
		},
	}
);

type ButtonProps = VariantProps<typeof buttonVariants> & BaseButton.Props;
type LinkProps = VariantProps<typeof buttonVariants> & ComponentProps<typeof Link>;
type ActionProps = ButtonProps | LinkProps;

const isLink = (props: ActionProps): props is LinkProps => {
	return !!(props as LinkProps).href;
};
const isButton = (props: ActionProps): props is ButtonProps => {
	return !!(props as ButtonProps).onClick || props.type === 'submit';
};

const Button: React.FC<ActionProps> = ({ color, variant, className, children, ...props }) => {
	if (isLink(props)) {
		return props.href?.toString().startsWith('/') ? (
			<Link
				className={cn(buttonVariants({ color, variant }), className, 'no-underline')}
				{...props}
			>
				{children}
			</Link>
		) : (
			<a
				className={cn(buttonVariants({ color, variant }), className, 'no-underline')}
				{...props}
				href={props.href?.toString()}
			>
				{children}
			</a>
		);
	}

	if (isButton(props)) {
		return (
			<BaseButton className={cn(buttonVariants({ color, variant }), className)} {...props}>
				{children}
			</BaseButton>
		);
	}

	return null;
};

export default Button;
