import type { ComponentProps } from 'react';
import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { BUTTON_CVA_CONFIG } from './button-variants';
import cn from '@/util/cn';

const linkVariants = cva(
	'flex h-8 items-center justify-center gap-2 rounded-xl px-4 py-5 no-underline',
	{
		...BUTTON_CVA_CONFIG,
		defaultVariants: {
			color: 'primary',
			variant: 'contained',
		},
	}
);

type LinkButtonProps = ComponentProps<typeof Link> & VariantProps<typeof linkVariants>;

const LinkButton: React.FC<LinkButtonProps> = ({
	color,
	variant,
	className,
	children,
	href,
	...props
}) =>
	href.toString().startsWith('/') ? (
		<Link className={cn(linkVariants({ color, variant }), className)} href={href} {...props}>
			{children}
		</Link>
	) : (
		<a
			className={cn(linkVariants({ color, variant }), className)}
			href={href.toString()}
			{...props}
		>
			{children}
		</a>
	);

export default LinkButton;
