import { Select as BaseSelect } from '@base-ui/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BUTTON_CVA_CONFIG } from './button-variants';
import cn from '@/util/cn';

const selectVariants = cva(
	'flex h-8 min-w-40 items-center justify-between gap-3 rounded-2xl px-3 py-4 text-sm leading-none font-normal whitespace-nowrap transition-colors select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
	{
		...BUTTON_CVA_CONFIG,
		defaultVariants: {
			color: 'neutral',
			variant: 'outlined',
		},
	}
);

type SelectProps = BaseSelect.Root.Props<string, boolean> &
	VariantProps<typeof selectVariants> & {
		label?: React.ReactNode;
	} & {
		className?: string | string[];
	};

const Select: React.FC<SelectProps> = ({ className, color, label, variant, ...props }) => (
	<div className='flex flex-col items-start gap-1'>
		<BaseSelect.Root {...props}>
			{label ? (
				<BaseSelect.Label className='cursor-default text-sm font-bold text-neutral-950 dark:text-white'>
					{label}
				</BaseSelect.Label>
			) : null}
			<BaseSelect.Trigger className={cn(selectVariants({ color, variant }), className)}>
				<BaseSelect.Value />
				<BaseSelect.Icon className='flex flex-col items-center justify-center gap-0.5 text-xs'>
					<FontAwesomeIcon icon={faAngleUp} />
					<FontAwesomeIcon icon={faAngleDown} />
				</BaseSelect.Icon>
			</BaseSelect.Trigger>
			<BaseSelect.Portal>
				<BaseSelect.Positioner className='z-10 outline-hidden select-none' sideOffset={4}>
					<BaseSelect.Popup className='group min-w-(--anchor-width) origin-(--transform-origin) rounded-2xl border border-slate-200 bg-white bg-clip-padding text-slate-950 shadow-xl shadow-slate-200/70 outline-hidden transition-[scale,opacity] duration-100 ease-out data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0 data-[side=none]:min-w-[calc(var(--anchor-width)+1.75rem)] data-[side=none]:translate-y-px data-[side=none]:data-ending-style:transition-none data-[side=none]:data-starting-style:scale-100 data-[side=none]:data-starting-style:opacity-100 data-[side=none]:data-starting-style:transition-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/20'>
						<BaseSelect.ScrollUpArrow className="top-0 z-1 flex h-4 w-full cursor-default items-center justify-center bg-white text-center text-xs before:absolute before:left-0 before:h-full before:w-full before:content-[''] data-[side=none]:before:top-full dark:bg-neutral-950">
							<FontAwesomeIcon icon={faAngleUp} />
						</BaseSelect.ScrollUpArrow>
						<BaseSelect.List className='relative max-h-(--available-height) scroll-py-6 overflow-y-auto py-1'>
							{Array.isArray(props.items)
								? props.items.map(({ label, value }) => (
										<BaseSelect.Item
											key={label}
											value={value}
											className='grid cursor-default grid-cols-[1rem_1fr] items-center gap-2 py-1.5 pr-4 pl-2.5 text-sm outline-hidden select-none data-highlighted:bg-slate-100 dark:data-highlighted:bg-slate-800'
										>
											<BaseSelect.ItemText className='col-start-2'>{label}</BaseSelect.ItemText>
										</BaseSelect.Item>
									))
								: null}
						</BaseSelect.List>
						<BaseSelect.ScrollDownArrow className="bottom-0 z-1 flex h-4 w-full cursor-default items-center justify-center bg-white text-center text-xs before:absolute before:left-0 before:h-full before:w-full before:content-[''] data-[side=none]:before:bottom-full dark:bg-neutral-950">
							<FontAwesomeIcon icon={faAngleDown} />
						</BaseSelect.ScrollDownArrow>
					</BaseSelect.Popup>
				</BaseSelect.Positioner>
			</BaseSelect.Portal>
		</BaseSelect.Root>
	</div>
);

export default Select;
