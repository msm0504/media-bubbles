import { ComponentProps } from 'react';
import cn from '@/util/cn';

const Paper: React.FC<ComponentProps<'div'>> = ({ children, className, ...props }) => (
	<div
		className={cn(
			'rounded-4xl border border-slate-300 bg-white p-6 opacity-80 shadow-2xl shadow-slate-200 backdrop-blur-md',
			className
		)}
		{...props}
	>
		{children}
	</div>
);

export default Paper;
