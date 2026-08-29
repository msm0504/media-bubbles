import { useMemo } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
	faCircleCheck,
	faCircleExclamation,
	faCircleInfo,
	faTriangleExclamation,
	faX,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from './button';
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
	onClose?: () => void;
};

const Alert: React.FC<AlertProps> = ({ className = '', color, description, onClose, title }) => {
	const Icon = useMemo(() => {
		switch (color) {
			case 'primary':
				return <FontAwesomeIcon className='text-primary-dark' icon={faCircleInfo} size='xl' />;
			case 'success':
				return <FontAwesomeIcon className='text-success-dark' icon={faCircleCheck} size='xl' />;
			case 'info':
				return <FontAwesomeIcon className='text-info-dark' icon={faCircleInfo} size='xl' />;
			case 'warning':
				return (
					<FontAwesomeIcon className='text-warning-dark' icon={faTriangleExclamation} size='xl' />
				);
			case 'error':
				return <FontAwesomeIcon className='text-error-dark' icon={faCircleExclamation} size='xl' />;
			case 'neutral':
				return <FontAwesomeIcon className='text-black' icon={faCircleInfo} size='xl' />;
			default:
				return null;
		}
	}, [color]);

	return (
		<div role='alert' className={cn(alertVariants({ color }), className)}>
			{Icon}
			<div className='flex grow flex-col'>
				{title ? <h2 className='text-lg font-bold'>{title}</h2> : null}
				<p>{description}</p>
			</div>
			{typeof onClose === 'function' ? (
				<Button color={color} variant='text' onClick={onClose}>
					<FontAwesomeIcon aria-label='close alert' size='sm' icon={faX} />
				</Button>
			) : null}
		</div>
	);
};

export default Alert;
