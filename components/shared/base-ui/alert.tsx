import { useMemo } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
	faCircleCheck,
	faCircleExclamation,
	faCircleInfo,
	faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { CvaColorConfig } from '@/styles/color-variants';
import cn from '@/util/cn';
import tw from '@/util/tailwind-template';

const ALERT_CONFIG: CvaColorConfig = {
	variants: {
		color: {
			primary: tw`bg-primary-light text-primary-dark`,
			success: tw`bg-success-light text-success-dark`,
			info: tw`bg-info-light text-info-dark`,
			warning: tw`bg-warning-light text-warning-dark`,
			error: tw`bg-error-light text-error-dark`,
			neutral: tw`bg-white text-black`,
		},
	},
};

const alertVariants = cva('m-0 flex w-full items-center gap-4 rounded-sm p-5', {
	...ALERT_CONFIG,
	defaultVariants: {
		color: 'success',
	},
});

type AlertProps = VariantProps<typeof alertVariants> & {
	className?: string | string[];
	title?: React.ReactNode;
	description: React.ReactNode;
};

const Alert: React.FC<AlertProps> = ({ className = '', color, description, title }) => {
	const Icon = useMemo(() => {
		switch (color) {
			case 'primary':
				return <FontAwesomeIcon className='text-primary-dark' icon={faCircleInfo} size='lg' />;
			case 'success':
				return <FontAwesomeIcon className='text-success-dark' icon={faCircleCheck} size='lg' />;
			case 'info':
				return <FontAwesomeIcon className='text-info-dark' icon={faCircleInfo} size='lg' />;
			case 'warning':
				return (
					<FontAwesomeIcon className='text-warning-dark' icon={faTriangleExclamation} size='lg' />
				);
			case 'error':
				return <FontAwesomeIcon className='text-error-dark' icon={faCircleExclamation} size='lg' />;
			case 'neutral':
				return <FontAwesomeIcon className='text-black' icon={faCircleInfo} size='lg' />;
			default:
				return null;
		}
	}, [color]);

	return (
		<div className={cn(alertVariants({ color }), className)}>
			{Icon}
			<div className='flex flex-col'>
				{title ? <h2 className='text-lg font-bold'>{title}</h2> : null}
				<p>{description}</p>
			</div>
		</div>
	);
};

export default Alert;
