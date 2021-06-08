import { useEffect, useState } from 'react';

type ScreenSize = [number, number];

export const SM_MIN_WIDTH = 576;
export const MD_MIN_WIDTH = 768;
export const LG_MIN_WIDTH = 992;
export const XL_MIN_WIDTH = 1200;

const useMediaQuery = (): ScreenSize => {
	const [screenSize, setScreenSize] = useState<ScreenSize>([0, 0]);

	const updateScreenSize = () => {
		setScreenSize([window.innerWidth, window.innerHeight]);
	};

	useEffect(() => {
		window.addEventListener('resize', updateScreenSize);
		updateScreenSize();
		return () => window.removeEventListener('resize', updateScreenSize);
	}, []);

	return screenSize;
};

export default useMediaQuery;
