import { Slider as BaseSlider } from '@base-ui/react';
import { cva, type VariantProps } from 'class-variance-authority';
import type { CvaColorConfig } from '@/styles/color-variants';
import cn from '@/util/cn';
import tw from '@/util/tailwind-template';

const SLIDER_IND_CVA_CONFIG: CvaColorConfig = {
	variants: {
		color: {
			primary: tw`not-data-disabled:bg-primary hover:not-data-disabled:bg-primary-hover`,
			success: tw`not-data-disabled:bg-success hover:not-data-disabled:bg-success-hover`,
			info: tw`not-data-disabled:bg-info hover:not-data-disabled:bg-info-hover`,
			warning: tw`not-data-disabled:bg-warning hover:not-data-disabled:bg-warning-hover`,
			error: tw`not-data-disabled:bg-error hover:not-data-disabled:bg-error-hover`,
			neutral: tw`not-data-disabled:bg-slate-800 hover:not-data-disabled:bg-black`,
		},
	},
};

const sliderIndVariants = cva('rounded-xl', {
	...SLIDER_IND_CVA_CONFIG,
	defaultVariants: {
		color: 'primary',
	},
});

type SliderProps = BaseSlider.Root.Props &
	VariantProps<typeof sliderIndVariants> & {
		label: React.ReactNode;
	};

const Slider: React.FC<SliderProps> = ({ color, className, label, ...props }) => (
	<BaseSlider.Root className={cn('min-w-50', className)} {...props}>
		<BaseSlider.Label>{label}</BaseSlider.Label>
		<BaseSlider.Control className='flex w-full'>
			<BaseSlider.Track className='h-4 w-full rounded-xl bg-slate-300 opacity-70 transition-opacity duration-200 outline-none hover:opacity-100 focus:opacity-100'>
				<BaseSlider.Indicator className={sliderIndVariants({ color })} />
				<BaseSlider.Thumb className='h-6 w-6 cursor-pointer appearance-none rounded-full border-2 border-solid bg-white' />
			</BaseSlider.Track>
		</BaseSlider.Control>
	</BaseSlider.Root>
);

export default Slider;
