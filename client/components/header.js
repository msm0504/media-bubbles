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
			className='card-header jumbotron mb-0'
			tabIndex='0'
			role='button'
			onClick={headerClicked}
			onKeyDown={headerClicked}
		>
			<h1 className='text-center text-light font-weight-bold display-2'>
				Media
				<div id='header-logo'></div>
				Bubbles
			</h1>
		</div>
	);
};

export default Header;
