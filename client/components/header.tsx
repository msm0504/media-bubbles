import Image from 'next/image';
import { useRouter } from 'next/router';

import bannerBackground from '@/public/images/banner.png';
import styles from '@/styles/styles.module.css';

const Header: React.FC = () => {
	const router = useRouter();
	const headerClicked = () => {
		if (router.pathname !== '/') {
			router.push('/');
		}
	};

	return (
		<div
			className={`${styles.headerImgContainer} mb-0 w-100`}
			tabIndex={0}
			role='button'
			onClick={headerClicked}
			onKeyDown={headerClicked}
		>
			<Image
				alt='banner background'
				src={bannerBackground}
				placeholder='blur'
				quality={100}
				fill
				className={styles.headerImg}
			/>
			<div className='w-100 h-100 d-flex justify-content-center align-items-center'>
				<h1 className={`${styles.outlinedText} display-1 fw-bold text-light`}>Media Bubbles</h1>
			</div>
		</div>
	);
};

export default Header;
