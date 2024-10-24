'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
	AppBar,
	Box,
	Button,
	Container,
	IconButton,
	Menu,
	MenuItem,
	Stack,
	Toolbar,
	Typography,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
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
			<Container maxWidth='xl'>
				<Toolbar disableGutters>
					<Box sx={{ display: { xs: 'flex', md: 'none' } }}>
						<IconButton
							color='light'
							size='large'
							aria-label='open main menu'
							aria-controls='menu-appbar'
							aria-haspopup='true'
							onClick={handleOpenNavMenu}
						>
							<FontAwesomeIcon icon={faBars} />
						</IconButton>
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
									<Typography sx={{ textAlign: 'center' }}>{page.label}</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>
					<Box flexGrow={{ xs: 1, md: 0 }}>
						<IconButton aria-label='logo button to home' component={Link} href='/'>
							<Image src={favIcon} width={45} height={45} alt='Media Bubbles logo' />
						</IconButton>
					</Box>
					<Stack
						direction='row'
						spacing={4}
						flexGrow={1}
						sx={{ display: { xs: 'none', md: 'flex' } }}
					>
						{pages.map(page => (
							<Button
								key={page.label}
								size='large'
								variant='text'
								sx={{ my: 2, display: 'block' }}
								color='light'
								component={Link}
								href={page.route}
							>
								{page.label}
							</Button>
						))}
					</Stack>
					<Login />
				</Toolbar>
			</Container>
		</AppBar>
	);
};

export default TopNavbar;
