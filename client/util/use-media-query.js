import { useLayoutEffect, useState } from 'react';

export const SM_MIN_WIDTH = 576;
export const MD_MIN_WIDTH = 768;
export const LG_MIN_WIDTH = 992;
export const XL_MIN_WIDTH = 1200;

const useMediaQuery = () => {
	const [screenSize, setScreenSize] = useState([0, 0]);

	const updateScreenSize = () => {
		setScreenSize([window.innerWidth, window.innerHeight]);
	};

	useLayoutEffect(() => {
		window.addEventListener('resize', updateScreenSize);
		updateScreenSize();
		return () => window.removeEventListener('resize', updateScreenSize);
	}, []);

	return screenSize;
};

export default useMediaQuery;
