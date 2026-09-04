import { Input as BaseInput } from '@base-ui/react';
import cn from '@/util/cn';
import tw from '@/util/tailwind-template';

const DEFAULT_CLASSES = tw`w-full rounded-xl border border-neutral-950 bg-white px-2 py-1 text-sm text-neutral-950 placeholder:text-neutral-500 focus:outline-2 focus:-outline-offset-1 focus:outline-neutral-950 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500`;

const Input: React.FC<BaseInput.Props> = ({ className, ...props }) => (
	<BaseInput className={cn(DEFAULT_CLASSES, className)} {...props} />
);

export default Input;
