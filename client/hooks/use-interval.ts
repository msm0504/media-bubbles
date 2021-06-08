import { useEffect, useRef } from 'react';

const useInterval = (callback: () => void, delay?: number): void => {
	const savedCallback = useRef<() => void>(() => {});

	useEffect(() => {
		savedCallback.current = callback;
	});

	useEffect(() => {
		const tick = () => savedCallback.current();

		if (delay && delay > 0) {
			const id = setInterval(tick, delay);
			return () => clearInterval(id);
		}
	}, [delay]);
};

export default useInterval;
