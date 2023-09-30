import { cleanup, render, fireEvent, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import SearchResults from '../search-results';
import * as oldFormatMock from '../__mocks__/old-format.json';
import * as allSourcesMock from '../__mocks__/search-all-sources.json';
import * as singleSourcesMock from '../__mocks__/single-sources.json';
import { SOURCE_SLANT_MAP } from '@/client/constants/source-slant';
import useMediaQuery, { XL_MIN_WIDTH } from '@/client/hooks/use-media-query';

jest.mock('next/router', () => ({
	useRouter: () => ({ query: '' })
}));
jest.mock('@/client/hooks/use-media-query');
const server = setupServer();

beforeAll(() => {
	server.listen();
	server.use(rest.get('/api/source-logo', (_req, res, ctx) => res(ctx.body(Buffer.from('')))));
});

afterEach(cleanup);

afterAll(() => server.close());

test('displays results for individual sources', () => {
	(useMediaQuery as jest.Mock).mockReturnValue([XL_MIN_WIDTH + 1, XL_MIN_WIDTH + 1]);
	render(<SearchResults {...singleSourcesMock} />);

	expect(screen.queryByText('NPR')).toBeInTheDocument();
	expect(screen.queryByText('Bloomberg')).toBeInTheDocument();
	expect(screen.queryByText('ABC News')).toBeInTheDocument();
	expect(screen.queryByText('Slate')).toBeInTheDocument();
	expect(screen.queryByText('HuffPost')).toBeInTheDocument();

	expect(
		screen.queryByText('Plenty of research has found COVID vaccines to be safe and effective.', {
			exact: false
		})
	).toBeInTheDocument();
	expect(screen.queryByText('No Headlines Found')).toBeInTheDocument();
	expect(
		screen.queryByText(
			"How the United States' potential fourth vaccine stacks up against existing ones:",
			{ exact: false }
		)
	).toBeInTheDocument();
	expect(
		screen.queryByText('All of us are going to get vaccinated one way or the other.', {
			exact: false
		})
	).toBeInTheDocument();
	expect(
		screen.queryByText(
			'The announcement comes hours after Biden committed to donating 500M shots',
			{ exact: false }
		)
	).toBeInTheDocument();
});

test('displays results for search of all sources', () => {
	(useMediaQuery as jest.Mock).mockReturnValue([XL_MIN_WIDTH + 1, XL_MIN_WIDTH + 1]);
	render(<SearchResults {...allSourcesMock} />);

	Object.values(SOURCE_SLANT_MAP).forEach(slantName =>
		expect(screen.queryByText(slantName)).toBeInTheDocument()
	);

	expect(
		screen.queryByText(
			'The Supreme Court’s legal punt is very much in keeping with the political punt',
			{
				exact: false
			}
		)
	).toBeInTheDocument();
	expect(
		screen.queryByText('Colorado baker who won a partial victory at the US Supreme Court in 2018', {
			exact: false
		})
	).toBeInTheDocument();
	expect(
		screen.queryByText(
			'Supreme Court sides with Catholic adoption agency that turned away same-sex couples',
			{ exact: false }
		)
	).toBeInTheDocument();
	expect(
		screen.queryByText(
			'Government fails to act neutrally when it proceeds in a manner intolerant of religious beliefs',
			{
				exact: false
			}
		)
	).toBeInTheDocument();
	expect(
		screen.queryByText(
			"Senate Democrats' warnings about Justice Barrett proven wrong by ObamaCare ruling",
			{ exact: false }
		)
	).toBeInTheDocument();
});

test('displays old saved results from News API', () => {
	(useMediaQuery as jest.Mock).mockReturnValue([XL_MIN_WIDTH + 1, XL_MIN_WIDTH + 1]);
	render(<SearchResults {...oldFormatMock} />);

	expect(screen.queryByText('Axios')).toBeInTheDocument();
	expect(screen.queryByText('CNN')).toBeInTheDocument();
	expect(screen.queryByText('Fox News')).toBeInTheDocument();
	expect(screen.queryByText('Newsweek')).toBeInTheDocument();
	expect(screen.queryByText('The Hill')).toBeInTheDocument();

	expect(
		screen.queryByText('Biden rips Trump over Woodward revelations:', {
			exact: false
		})
	).toBeInTheDocument();
	expect(
		screen.queryByText(
			'President Trump knew in early February coronavirus was dangerous, highly contagious',
			{ exact: false }
		)
	).toBeInTheDocument();
	expect(
		screen.queryByText('Trump says he downplayed coronavirus threat', { exact: false })
	).toBeInTheDocument();
	expect(
		screen.queryByText(
			"The ex-White House director of communications agreed with Trump's former personal lawyer",
			{
				exact: false
			}
		)
	).toBeInTheDocument();
	expect(
		screen.queryByText(
			"Kushner says 'Alice in Wonderland' describes Trump presidency: Woodward book",
			{ exact: false }
		)
	).toBeInTheDocument();
});

test('uses collapse components to show/hide results on smaller screens', async () => {
	(useMediaQuery as jest.Mock).mockReturnValue([XL_MIN_WIDTH - 1, XL_MIN_WIDTH - 1]);
	render(<SearchResults {...singleSourcesMock} />);

	const columnToggle = screen.queryByText('NPR')?.closest('button');
	expect(columnToggle).toBeInTheDocument();

	const article = screen.queryByText(
		'Plenty of research has found COVID vaccines to be safe and effective.',
		{ exact: false }
	);
	expect(article?.closest('.collapse')).toBeInTheDocument();
	fireEvent.click(columnToggle as HTMLButtonElement);
	await waitFor(() => expect(article?.closest('.collapse')).not.toBeInTheDocument());
	fireEvent.click(columnToggle as HTMLButtonElement);
	await waitFor(() => expect(article?.closest('.collapse')).toBeInTheDocument());
});
