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
			className='py-5 mb-0'
			id='top-banner'
			tabIndex='0'
			role='button'
			onClick={headerClicked}
			onKeyDown={headerClicked}
		>
			<div className='py-3 text-center d-flex flex-column flex-lg-row align-items-center justify-content-lg-around'>
				<div className='header-logo'></div>
				<div className='display-1 font-weight-bold text-light' style={{ fontSize: '6rem' }}>
					Media Bubbles
				</div>
				<div className='header-logo d-none d-lg-flex'></div>
			</div>
		</div>
	);
};

export default Header;
