'use client';
import { useState } from 'react';
import Image from 'next/image';
import { AppBar, Menu, MenuItem, Toolbar } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Button, Link, LinkButton } from './base-ui';
import Login from './login';
import favIcon from '@/app/favicon.ico';

type PageLink = {
	label: string;
	route: string;
};

const pages: PageLink[] = [
	{ label: 'Home', route: '/' },
	{ label: 'Search', route: '/search' },
	{ label: 'Latest News', route: '/latest' },
	{ label: 'About', route: '/about' },
	// { label: 'Blog', route: '/blog' },
	{ label: 'Contact Us', route: '/contact' },
];

const TopNavbar: React.FC = () => {
	const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	return (
		<AppBar color='dark' position='sticky' elevation={0}>
			<div className='max-w-[1536]'>
				<Toolbar disableGutters>
					<div className='flex md:hidden'>
						<Button
							color='neutral'
							variant='contained'
							aria-label='open main menu'
							aria-controls='menu-appbar'
							aria-haspopup='true'
							onClick={handleOpenNavMenu}
						>
							<FontAwesomeIcon size='xl' icon={faBars} />
						</Button>
						<Menu
							id='menu-appbar'
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							open={!!anchorElNav}
							onClose={handleCloseNavMenu}
							sx={{ display: { xs: 'block', md: 'none' } }}
						>
							{pages.map(page => (
								<MenuItem key={page.label} component={Link} href={page.route}>
									<p className='text-center'>{page.label}</p>
								</MenuItem>
							))}
						</Menu>
					</div>
					<div className='grow md:grow-0'>
						<LinkButton aria-label='logo button to home' href='/'>
							<Image src={favIcon} width={45} height={45} alt='Media Bubbles logo' />
						</LinkButton>
					</div>
					<div className='hidden grow gap-4 md:flex'>
						{pages.map(page => (
							<LinkButton
								key={page.label}
								className='my-2 text-lg'
								color='neutral'
								variant='contained'
								href={page.route}
							>
								{page.label}
							</LinkButton>
						))}
					</div>
					<Login />
				</Toolbar>
			</div>
		</AppBar>
	);
};

export default TopNavbar;
