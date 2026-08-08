import type { ComponentProps, PropsWithChildren } from 'react';
import { default as NextLink } from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import type { CvaColorConfig } from '@/styles/color-variants';
import cn from '@/util/cn';
import tw from '@/util/tailwind-template';

const LINK_CVA_CONFIG: CvaColorConfig = {
	variants: {
		color: {
			primary: tw`not-data-disabled:text-primary hover:not-data-disabled:text-primary-hover`,
			secondary: tw`not-data-disabled:text-gray-600`,
			success: tw`not-data-disabled:text-success hover:not-data-disabled:text-success-hover`,
			info: tw`not-data-disabled:text-info hover:not-data-disabled:text-info-hover`,
			warning: tw`not-data-disabled:text-warning hover:not-data-disabled:text-warning-hover`,
			error: tw`not-data-disabled:text-error hover:not-data-disabled:text-error-hover`,
			neutral: tw`text-black`,
		},
	},
};

const linkVariants = cva(
	'no-underline hover:not-data-disabled:underline data-disabled:text-gray-400',
	{
		...LINK_CVA_CONFIG,
		defaultVariants: {
			color: 'primary',
		},
	}
);

type LinkProps = ComponentProps<typeof NextLink> &
	VariantProps<typeof linkVariants> &
	PropsWithChildren;

const Link: React.FC<LinkProps> = ({ color, className, children, href, ...props }) =>
	href.toString().startsWith('/') ? (
		<NextLink className={cn(linkVariants({ color }), className)} href={href} {...props}>
			{children}
		</NextLink>
	) : (
		<a className={cn(linkVariants({ color }), className)} href={href.toString()} {...props}>
			{children}
		</a>
	);

export default Link;
