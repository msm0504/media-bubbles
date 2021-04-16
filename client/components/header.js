import { useRouter } from 'next/router';

const Header = () => {
	const router = useRouter();
	const headerClicked = () => {
		if (router.pathname !== '/') {
			router.push('/');
		}
	};

	return (
		<div
			className='jumbotron mb-0'
			tabIndex='0'
			role='button'
			onClick={headerClicked}
			onKeyDown={headerClicked}
		>
			<h1 className='text-center text-light font-weight-bold display-1 d-flex flex-column flex-md-row align-items-center justify-content-md-around'>
				<div className='header-logo'></div>
				<div>Media Bubbles</div>
				<div className='header-logo d-none d-md-flex'></div>
			</h1>
		</div>
	);
};

export default Header;
