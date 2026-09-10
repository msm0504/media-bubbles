import { ComponentProps } from 'react';
import cn from '@/util/cn';

const Paper: React.FC<ComponentProps<'div'>> = ({ children, className, ...props }) => (
	<div
		className={cn(
			'rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-xl shadow-slate-200/70 backdrop-blur-md dark:border-slate-700/80 dark:bg-slate-900/85 dark:shadow-black/20',
			className
		)}
		{...props}
	>
		{children}
	</div>
);

export default Paper;
