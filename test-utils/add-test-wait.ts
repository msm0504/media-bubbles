import { act } from '@testing-library/react';

// allows anything in progress to complete before test ends
const addTestWait = async (waitTime = 200) =>
	act(async () => {
		await new Promise(res => setTimeout(res, waitTime));
	});

export default addTestWait;
