import { useRouter } from 'next/router';

const Header: React.FC = () => {
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
			tabIndex={0}
			role='button'
			onClick={headerClicked}
			onKeyDown={headerClicked}
		>
			<div className='py-4 text-center d-flex flex-column flex-lg-row align-items-center justify-content-lg-around'>
				<div className='heading-text display-1 fw-bold text-light'>Media Bubbles</div>
			</div>
		</div>
	);
};

export default Header;
