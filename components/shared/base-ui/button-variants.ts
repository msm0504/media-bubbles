import type { CvaColorVarConfig } from '@/styles/color-variants';
import tw from '@/util/tailwind-template';

export const BUTTON_CVA_CONFIG: CvaColorVarConfig = {
	variants: {
		color: {
			primary: '',
			secondary: '',
			success: '',
			info: '',
			warning: '',
			error: '',
			neutral: '',
		},
		variant: {
			contained: tw`data-disabled:bg-gray-200 data-disabled:text-gray-400`,
			outlined: tw`border border-solid data-disabled:border-gray-400 data-disabled:text-gray-400`,
			text: tw`data-disabled:text-gray-400`,
		},
	},
	compoundVariants: [
		{
			color: 'primary',
			variant: 'contained',
			class: tw`not-data-disabled:bg-primary not-data-disabled:text-white hover:not-data-disabled:bg-primary-hover`,
		},
		{
			color: 'primary',
			variant: 'outlined',
			class: tw`not-data-disabled:border-primary not-data-disabled:bg-white not-data-disabled:text-primary hover:not-data-disabled:bg-primary-light`,
		},
		{
			color: 'primary',
			variant: 'text',
			class: tw`not-data-disabled:bg-white not-data-disabled:text-primary hover:not-data-disabled:bg-primary-light`,
		},

		{
			color: 'secondary',
			variant: 'contained',
			class: tw`not-data-disabled:bg-gray-600 not-data-disabled:text-white`,
		},
		{
			color: 'secondary',
			variant: 'outlined',
			class: tw`not-data-disabled:border-gray-600 not-data-disabled:bg-white not-data-disabled:text-gray-600`,
		},
		{
			color: 'secondary',
			variant: 'text',
			class: tw`not-data-disabled:bg-white not-data-disabled:text-gray-600`,
		},

		{
			color: 'success',
			variant: 'contained',
			class: tw`not-data-disabled:bg-success not-data-disabled:text-white hover:not-data-disabled:bg-success-hover`,
		},
		{
			color: 'success',
			variant: 'outlined',
			class: tw`not-data-disabled:border-success not-data-disabled:bg-white not-data-disabled:text-success hover:not-data-disabled:bg-success-light`,
		},
		{
			color: 'success',
			variant: 'text',
			class: tw`not-data-disabled:bg-white not-data-disabled:text-success hover:not-data-disabled:bg-success-light`,
		},

		{
			color: 'info',
			variant: 'contained',
			class: tw`not-data-disabled:bg-info not-data-disabled:text-white hover:not-data-disabled:bg-info-hover`,
		},
		{
			color: 'info',
			variant: 'outlined',
			class: tw`not-data-disabled:border-info not-data-disabled:bg-white not-data-disabled:text-info hover:not-data-disabled:bg-info-light`,
		},
		{
			color: 'info',
			variant: 'text',
			class: tw`not-data-disabled:bg-white not-data-disabled:text-info hover:not-data-disabled:bg-info-light`,
		},

		{
			color: 'warning',
			variant: 'contained',
			class: tw`not-data-disabled:bg-warning not-data-disabled:text-white hover:not-data-disabled:bg-warning-hover`,
		},
		{
			color: 'warning',
			variant: 'outlined',
			class: tw`not-data-disabled:border-warning not-data-disabled:bg-white not-data-disabled:text-warning hover:not-data-disabled:bg-warning-light`,
		},
		{
			color: 'warning',
			variant: 'text',
			class: tw`not-data-disabled:bg-white not-data-disabled:text-warning hover:not-data-disabled:bg-warning-light`,
		},

		{
			color: 'error',
			variant: 'contained',
			class: tw`not-data-disabled:bg-error not-data-disabled:text-white hover:not-data-disabled:bg-error-hover`,
		},
		{
			color: 'error',
			variant: 'outlined',
			class: tw`not-data-disabled:border-error not-data-disabled:bg-white not-data-disabled:text-error hover:not-data-disabled:bg-error-light`,
		},
		{
			color: 'error',
			variant: 'text',
			class: tw`not-data-disabled:bg-white not-data-disabled:text-error hover:not-data-disabled:bg-error-light`,
		},

		{
			color: 'neutral',
			variant: 'contained',
			class: tw`not-data-disabled:bg-black not-data-disabled:text-white`,
		},
		{
			color: 'neutral',
			variant: 'outlined',
			class: tw`not-data-disabled:border-black not-data-disabled:bg-white not-data-disabled:text-black`,
		},
		{
			color: 'neutral',
			variant: 'text',
			class: tw`not-data-disabled:bg-white not-data-disabled:text-black`,
		},
	],
};
