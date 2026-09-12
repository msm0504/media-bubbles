import type { CvaColorVarConfig } from '@/styles/color-variants';
import tw from '@/util/tailwind-template';

export const BUTTON_CVA_CONFIG: CvaColorVarConfig = {
	variants: {
		color: {
			primary: '',
			success: '',
			info: '',
			warning: '',
			error: '',
			neutral: '',
		},
		variant: {
			contained: tw`data-disabled:bg-slate-200 data-disabled:text-slate-400`,
			outlined: tw`border border-solid data-disabled:border-slate-400 data-disabled:text-slate-400`,
			text: tw`data-disabled:text-slate-400`,
		},
	},
	compoundVariants: [
		{
			color: 'primary',
			variant: 'contained',
			class: tw`not-data-disabled:bg-primary not-data-disabled:text-white hover:not-data-disabled:bg-primary-hover focus-visible:outline-primary dark:not-data-disabled:bg-purple-500 dark:hover:not-data-disabled:bg-purple-400`,
		},
		{
			color: 'primary',
			variant: 'outlined',
			class: tw`not-data-disabled:border-primary not-data-disabled:bg-white not-data-disabled:text-primary hover:not-data-disabled:bg-primary-light focus-visible:outline-primary dark:not-data-disabled:border-purple-400 dark:not-data-disabled:bg-slate-950 dark:not-data-disabled:text-purple-300 dark:hover:not-data-disabled:bg-purple-950`,
		},
		{
			color: 'primary',
			variant: 'text',
			class: tw`not-data-disabled:bg-inherit not-data-disabled:text-primary hover:not-data-disabled:bg-primary-light focus-visible:outline-primary dark:not-data-disabled:text-purple-300 dark:hover:not-data-disabled:bg-purple-950`,
		},

		{
			color: 'success',
			variant: 'contained',
			class: tw`not-data-disabled:bg-success not-data-disabled:text-white hover:not-data-disabled:bg-success-hover focus-visible:outline-success dark:not-data-disabled:bg-green-500 dark:hover:not-data-disabled:bg-green-400`,
		},
		{
			color: 'success',
			variant: 'outlined',
			class: tw`not-data-disabled:border-success not-data-disabled:bg-white not-data-disabled:text-success hover:not-data-disabled:bg-success-light focus-visible:outline-success dark:not-data-disabled:border-green-400 dark:not-data-disabled:bg-slate-950 dark:not-data-disabled:text-green-300 dark:hover:not-data-disabled:bg-green-950`,
		},
		{
			color: 'success',
			variant: 'text',
			class: tw`not-data-disabled:bg-inherit not-data-disabled:text-success hover:not-data-disabled:bg-success-light focus-visible:outline-success dark:not-data-disabled:text-green-300 dark:hover:not-data-disabled:bg-green-950`,
		},

		{
			color: 'info',
			variant: 'contained',
			class: tw`not-data-disabled:bg-info not-data-disabled:text-white hover:not-data-disabled:bg-info-hover focus-visible:outline-info dark:not-data-disabled:bg-blue-500 dark:hover:not-data-disabled:bg-blue-400`,
		},
		{
			color: 'info',
			variant: 'outlined',
			class: tw`not-data-disabled:border-info not-data-disabled:bg-white not-data-disabled:text-info hover:not-data-disabled:bg-info-light focus-visible:outline-info dark:not-data-disabled:border-blue-400 dark:not-data-disabled:bg-slate-950 dark:not-data-disabled:text-blue-300 dark:hover:not-data-disabled:bg-blue-950`,
		},
		{
			color: 'info',
			variant: 'text',
			class: tw`not-data-disabled:bg-inherit not-data-disabled:text-info hover:not-data-disabled:bg-info-light focus-visible:outline-info dark:not-data-disabled:text-blue-300 dark:hover:not-data-disabled:bg-blue-950`,
		},

		{
			color: 'warning',
			variant: 'contained',
			class: tw`not-data-disabled:bg-warning not-data-disabled:text-white hover:not-data-disabled:bg-warning-hover focus-visible:outline-warning dark:not-data-disabled:bg-yellow-600 dark:hover:not-data-disabled:bg-yellow-500`,
		},
		{
			color: 'warning',
			variant: 'outlined',
			class: tw`not-data-disabled:border-warning not-data-disabled:bg-white not-data-disabled:text-warning hover:not-data-disabled:bg-warning-light focus-visible:outline-warning dark:not-data-disabled:border-yellow-500 dark:not-data-disabled:bg-slate-950 dark:not-data-disabled:text-yellow-300 dark:hover:not-data-disabled:bg-yellow-950`,
		},
		{
			color: 'warning',
			variant: 'text',
			class: tw`not-data-disabled:bg-inherit not-data-disabled:text-warning hover:not-data-disabled:bg-warning-light focus-visible:outline-warning dark:not-data-disabled:text-yellow-300 dark:hover:not-data-disabled:bg-yellow-950`,
		},

		{
			color: 'error',
			variant: 'contained',
			class: tw`not-data-disabled:bg-error not-data-disabled:text-white hover:not-data-disabled:bg-error-hover focus-visible:outline-error dark:not-data-disabled:bg-red-500 dark:hover:not-data-disabled:bg-red-400`,
		},
		{
			color: 'error',
			variant: 'outlined',
			class: tw`not-data-disabled:border-error not-data-disabled:bg-white not-data-disabled:text-error hover:not-data-disabled:bg-error-light focus-visible:outline-error dark:not-data-disabled:border-red-400 dark:not-data-disabled:bg-slate-950 dark:not-data-disabled:text-red-300 dark:hover:not-data-disabled:bg-red-950`,
		},
		{
			color: 'error',
			variant: 'text',
			class: tw`not-data-disabled:bg-inherit not-data-disabled:text-error hover:not-data-disabled:bg-error-light focus-visible:outline-error dark:not-data-disabled:text-red-300 dark:hover:not-data-disabled:bg-red-950`,
		},

		{
			color: 'neutral',
			variant: 'contained',
			class: tw`not-data-disabled:bg-slate-950 not-data-disabled:text-white hover:not-data-disabled:bg-slate-800 focus-visible:outline-slate-950 dark:not-data-disabled:bg-slate-100 dark:not-data-disabled:text-slate-950 dark:hover:not-data-disabled:bg-white dark:focus-visible:outline-slate-300`,
		},
		{
			color: 'neutral',
			variant: 'outlined',
			class: tw`not-data-disabled:border-slate-950 not-data-disabled:bg-white not-data-disabled:text-slate-950 hover:not-data-disabled:bg-slate-100 focus-visible:outline-slate-950 dark:not-data-disabled:border-slate-300 dark:not-data-disabled:bg-slate-950 dark:not-data-disabled:text-slate-100 dark:hover:not-data-disabled:bg-slate-800 dark:focus-visible:outline-slate-300`,
		},
		{
			color: 'neutral',
			variant: 'text',
			class: tw`not-data-disabled:bg-inherit not-data-disabled:text-slate-950 hover:not-data-disabled:bg-slate-100 focus-visible:outline-slate-950 dark:not-data-disabled:text-slate-100 dark:hover:not-data-disabled:bg-slate-800 dark:focus-visible:outline-slate-300`,
		},
	],
};
