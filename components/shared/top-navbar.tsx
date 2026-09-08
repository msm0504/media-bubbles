import Image from 'next/image';
import { NavigationMenu } from '@base-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Button } from './base-ui';
import Login from './login';
import favIcon from '@/app/favicon.ico';
import tw from '@/util/tailwind-template';

type PageLink = {
	label: string;
	route: string;
};

const pages: PageLink[] = [
	{ label: 'Search', route: '/search' },
	{ label: 'Latest News', route: '/latest' },
	{ label: 'About', route: '/about' },
	// { label: 'Blog', route: '/blog' },
	{ label: 'Contact Us', route: '/contact' },
];

const contentClassName = tw`h-full w-[calc(100vw-40px)] p-2 transition-[opacity,transform,translate] duration-(--duration) ease-(--easing) data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:data-[activation-direction=left]:translate-x-[50%] data-starting-style:data-[activation-direction=left]:translate-x-[-50%] data-ending-style:data-[activation-direction=right]:translate-x-[-50%] data-starting-style:data-[activation-direction=right]:translate-x-[50%] min-[500px]:w-max min-[500px]:max-w-100`;

const TopNavbar: React.FC = () => {
	return (
		<NavigationMenu.Root className='min-h-6 w-screen'>
			<NavigationMenu.List className='relative mx-auto flex w-full max-w-6xl items-center p-4'>
				<NavigationMenu.Item className='flex md:hidden'>
					<NavigationMenu.Trigger>
						<FontAwesomeIcon size='xl' aria-label='open pages menu' icon={faBars} />
					</NavigationMenu.Trigger>
					<NavigationMenu.Content className={contentClassName}>
						<ul>
							{pages.map(page => (
								<li key={page.label}>
									<Button color='neutral' variant='text' href={page.route}>
										{page.label}
									</Button>
								</li>
							))}
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
				<NavigationMenu.Item>
					<Button color='neutral' variant='text' aria-label='logo button to home' href='/'>
						<Image src={favIcon} width={45} height={45} alt='Media Bubbles logo' />
						<h1 className='text-lg font-extrabold'>Media Bubbles</h1>
					</Button>
				</NavigationMenu.Item>
				<div className='grow' />
				{pages.map(page => (
					<NavigationMenu.Item key={page.label} className='hidden md:block'>
						<Button className='my-2' color='neutral' variant='text' href={page.route}>
							{page.label}
						</Button>
					</NavigationMenu.Item>
				))}
				<Login />
			</NavigationMenu.List>

			<NavigationMenu.Portal>
				<NavigationMenu.Positioner
					sideOffset={10}
					collisionPadding={{ top: 5, bottom: 5, left: 20, right: 20 }}
					collisionAvoidance={{ side: 'none' }}
					className="h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom] duration-(--duration) ease-(--easing) before:absolute before:content-[''] data-instant:transition-none data-[side=bottom]:before:top-2.5 data-[side=bottom]:before:right-0 data-[side=bottom]:before:left-0 data-[side=bottom]:before:h-2.5 data-[side=left]:before:top-0 data-[side=left]:before:right-2.5 data-[side=left]:before:bottom-0 data-[side=left]:before:w-2.5 data-[side=right]:before:top-0 data-[side=right]:before:bottom-0 data-[side=right]:before:left-2.5 data-[side=right]:before:w-2.5 data-[side=top]:before:right-0 data-[side=top]:before:bottom-2.5 data-[side=top]:before:left-0 data-[side=top]:before:h-2.5"
					style={{
						['--duration' as string]: '0.35s',
						['--easing' as string]: 'cubic-bezier(0.22, 1, 0.36, 1)',
					}}
				>
					<NavigationMenu.Popup className='relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin) border border-neutral-950 bg-white text-neutral-950 shadow-[0.25rem_0.25rem_0] shadow-black/12 transition-[opacity,transform,width,height,scale] duration-(--duration) ease-(--easing) outline-none data-ending-style:scale-90 data-ending-style:opacity-0 data-ending-style:duration-150 data-ending-style:ease-[ease] data-starting-style:scale-90 data-starting-style:opacity-0 dark:border-white dark:bg-neutral-950 dark:text-white dark:shadow-none'>
						<NavigationMenu.Viewport className='relative h-full w-full overflow-hidden' />
					</NavigationMenu.Popup>
				</NavigationMenu.Positioner>
			</NavigationMenu.Portal>
		</NavigationMenu.Root>
	);
};

export default TopNavbar;
