import { afterAll, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import Home from '../page';

afterAll(cleanup);

test('home page renders', () => {
	render(<Home />);
});
