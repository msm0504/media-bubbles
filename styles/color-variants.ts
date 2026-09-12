import { cva } from 'class-variance-authority';

export type Color = 'primary' | 'success' | 'info' | 'warning' | 'error' | 'neutral';
export type Variant = 'contained' | 'outlined' | 'text';

export type CvaColorConfig = {
	variants: {
		color: Record<Color, string>;
	};
};

export type CvaColorVarConfig = {
	variants: {
		color: Record<Color, string>;
		variant: Record<Variant, string>;
	};
	compoundVariants: {
		color: Color;
		variant: Variant;
		class: string;
	}[];
};

export const textVariants = cva('', {
	variants: {
		color: {
			primary: 'text-primary',
			success: 'text-success',
			info: 'text-info',
			warning: 'text-warning',
			error: 'text-error',
			neutral: 'text-black',
		},
	},
	defaultVariants: {
		color: 'neutral',
	},
});

export const backgroundVariants = cva('', {
	variants: {
		color: {
			primary: 'bg-primary',
			success: 'bg-success',
			info: 'bg-info',
			warning: 'bg-warning',
			error: 'bg-error',
			neutral: 'bg-black',
		},
	},
	defaultVariants: {
		color: 'primary',
	},
});
