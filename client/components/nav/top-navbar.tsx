import { useRouter } from 'next/router';
import { Nav, Navbar } from 'react-bootstrap';

import RouteLink from './route-link';
import LoginNavItem from '../login/nav-item';

const TopNavbar: React.FC = () => {
	const router = useRouter();
	const headerClicked = () => {
		if (router.pathname !== '/') {
			router.push('/');
		}
	};

	return (
		<Navbar bg='dark' variant='dark' expand='md' sticky='top'>
			<Navbar.Brand className='border-0 bg-dark' as='button' onClick={headerClicked}>
				<img
					src='/favicon.ico'
					width='45'
					height='45'
					className='d-inline-block align-top ms-3'
					alt='Media Bubbles logo'
				/>
			</Navbar.Brand>
			<Navbar.Toggle aria-controls='top-navbar-nav' />
			<Navbar.Collapse id='top-navbar-nav' className='text-center'>
				<Nav activeKey={router.pathname} className='ms-auto'>
					<RouteLink buttonText='Home' routePath='/' isNav />
					<RouteLink buttonText='Search' routePath='/search' isNav />
					<RouteLink buttonText='About' routePath='/about' isNav />
					<RouteLink buttonText='Contact Us' routePath='/contact' isNav />
					<LoginNavItem />
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	);
};

export default TopNavbar;
