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
			<div className='text-center text-light font-weight-bold h1 display-1 d-flex flex-column flex-md-row align-items-center justify-content-md-around'>
				<div className='header-logo'></div>
				<div>Media Bubbles</div>
				<div className='header-logo d-none d-md-flex'></div>
			</div>
		</div>
	);
};

export default Header;
