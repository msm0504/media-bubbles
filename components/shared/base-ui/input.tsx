import { Input as BaseInput } from '@base-ui/react';
import cn from '@/util/cn';
import tw from '@/util/tailwind-template';

const DEFAULT_CLASSES = tw`w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 shadow-sm transition-colors placeholder:text-slate-500 focus:outline-2 focus:-outline-offset-1 focus:outline-primary disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:disabled:bg-slate-900 dark:disabled:text-slate-600`;

const Input: React.FC<BaseInput.Props> = ({ className, ...props }) => (
	<BaseInput className={cn(DEFAULT_CLASSES, className)} {...props} />
);

export default Input;
