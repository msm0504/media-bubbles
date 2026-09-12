import type { ComponentProps, PropsWithChildren } from 'react';
import { Popover as BasePopover } from '@base-ui/react';

type PopoverProps = PropsWithChildren & {
	title?: React.ReactNode;
	description: React.ReactNode;
	side: ComponentProps<typeof BasePopover.Positioner>['side'];
};

const Popover: React.FC<PopoverProps> = ({ children, description, side, title }) => (
	<BasePopover.Root>
		<BasePopover.Trigger openOnHover>{children}</BasePopover.Trigger>
		<BasePopover.Portal>
			<BasePopover.Positioner side={side} sideOffset={8}>
				<BasePopover.Popup className='relative flex h-(--popup-height,auto) w-(--popup-width,auto) max-w-125 origin-(--transform-origin) flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-4 text-slate-950 shadow-xl shadow-slate-200/70 transition-[scale,opacity] duration-100 ease-out outline-none data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/20'>
					{title ? (
						<BasePopover.Title className='text-sm font-bold'>{title}</BasePopover.Title>
					) : null}
					<BasePopover.Description className='text-sm'>{description}</BasePopover.Description>
				</BasePopover.Popup>
			</BasePopover.Positioner>
		</BasePopover.Portal>
	</BasePopover.Root>
);

export default Popover;
