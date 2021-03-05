import { useEffect, useRef } from 'react';

const useInterval = (callback, delay) => {
	if (!delay || delay <= 0) return;

	const savedCallback = useRef();

	useEffect(() => {
		savedCallback.current = callback;
	});

	useEffect(() => {
		const tick = () => savedCallback.current();

		const id = setInterval(tick, delay);
		return () => clearInterval(id);
	}, [delay]);
};

export default useInterval;
