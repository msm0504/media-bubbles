type Color = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral';
type Variant = 'contained' | 'outlined' | 'text';

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
/*
export const ALERT_CONFIG: CvaColorConfig = {
	variants: {
		color: {
			primary: tw`bg-primary-light text-primary-dark`,
			secondary: tw`text-gray-600`,
			success: tw`bg-success-light text-success-dark`,
			info: tw`bg-info-light text-info-dark`,
			warning: tw`bg-warning-light text-warning-dark`,
			error: tw`bg-error-light text-error-dark`,
			neutral: tw`text-black`,
		},
	},
};
*/
