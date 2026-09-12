import type { ComponentProps } from 'react';
import { default as NextLink } from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import type { CvaColorConfig } from '@/styles/color-variants';
import cn from '@/util/cn';
import tw from '@/util/tailwind-template';

const LINK_CVA_CONFIG: CvaColorConfig = {
	variants: {
		color: {
			primary: tw`not-data-disabled:text-primary hover:not-data-disabled:text-primary-hover focus-visible:outline-primary`,
			success: tw`not-data-disabled:text-success hover:not-data-disabled:text-success-hover focus-visible:outline-success`,
			info: tw`not-data-disabled:text-info hover:not-data-disabled:text-info-hover focus-visible:outline-info`,
			warning: tw`not-data-disabled:text-warning hover:not-data-disabled:text-warning-hover focus-visible:outline-warning`,
			error: tw`not-data-disabled:text-error hover:not-data-disabled:text-error-hover focus-visible:outline-error`,
			neutral: tw`not-data-disabled:text-slate-700 hover:not-data-disabled:text-slate-950 dark:not-data-disabled:text-slate-300 dark:hover:not-data-disabled:text-white`,
		},
	},
};

const linkVariants = cva(
	'no-underline hover:not-data-disabled:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 data-disabled:text-slate-400 dark:data-disabled:text-slate-600',
	{
		...LINK_CVA_CONFIG,
		defaultVariants: {
			color: 'primary',
		},
	}
);

type LinkProps = ComponentProps<typeof NextLink> & VariantProps<typeof linkVariants>;

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
