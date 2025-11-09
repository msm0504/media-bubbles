import { afterAll, afterEach, beforeAll, expect, test, vi } from 'vitest';
import { cleanup, render, fireEvent, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import SearchForm from '../search-form';
import { SearchMode } from '@/constants/search-mode';
import MAX_SOURCE_SELECTIONS from '@/constants/max-source-selections';
import { AppProviders } from '@/contexts';
import * as apiService from '@/services/api-service';
import { appSourceList, sourceListBySlant } from '@/util/__mocks__/source-lists.json';

const server = setupServer();

const renderForm = (searchMode: SearchMode) =>
	render(
		<SearchForm
			searchMode={searchMode}
			appSourceList={appSourceList}
			sourceListBySlant={sourceListBySlant}
		/>
	);

const renderFormWithContext = (searchMode: SearchMode) =>
	render(
		<AppProviders>
			<SearchForm
				searchMode={searchMode}
				appSourceList={appSourceList}
				sourceListBySlant={sourceListBySlant}
			/>
		</AppProviders>
	);

beforeAll(() => {
	Element.prototype.scrollIntoView = vi.fn();
	server.listen();
});

afterEach(() => {
	cleanup();
	server.resetHandlers();
});

afterAll(() => server.close());

test('renders the component', () => {
	renderForm('MY_BUBBLE');
	expect(screen.queryByText(/^Choose the category.*$/)).toBeInTheDocument();
	expect(screen.queryByLabelText('Center-Left')).toBeInTheDocument();
});

test('renders across the spectrum form', () => {
	renderForm('FULL_SPECTRUM');
	expect(screen.queryByText(/^Choose the category.*$/)).not.toBeInTheDocument();
	expect(screen.queryByLabelText('Include Multiple Sources in Each Category')).toBeInTheDocument();
});

test('renders user select form', () => {
	renderForm('USER_SELECT');
	expect(screen.queryByText(`Choose up to ${MAX_SOURCE_SELECTIONS} sources.`)).toBeInTheDocument();
	const cnnCheckbox = screen.queryByLabelText('CNN') as HTMLInputElement;
	expect(cnnCheckbox).toBeInTheDocument();
	fireEvent.click(cnnCheckbox, { target: { checked: false } });
	expect(cnnCheckbox.checked).toBe(true);
	fireEvent.click(cnnCheckbox, { target: { checked: true } });
	expect(cnnCheckbox.checked).toBe(false);
});

test('has no extra inputs for random search', () => {
	renderForm('RANDOM');
	expect(screen.queryByText(/^Choose the category.*$/)).not.toBeInTheDocument();
	expect(
		screen.queryByLabelText('Include Multiple Sources in Each Category')
	).not.toBeInTheDocument();
	expect(
		screen.queryByText(`Choose up to ${MAX_SOURCE_SELECTIONS} sources.`)
	).not.toBeInTheDocument();
});

test('gives more options if keyword entered', () => {
	renderForm('FULL_SPECTRUM');
	const keywordInput = screen.getByLabelText('Key Words', { exact: false });
	fireEvent.change(keywordInput, { target: { value: 'truth' } });
	expect(screen.queryByLabelText('Search Past 5 Day(s)')).toBeInTheDocument();
});

test('displays error alert if slant has not been selected for my bubble search', async () => {
	renderFormWithContext('MY_BUBBLE');
	fireEvent.click(screen.getByText('Get Headlines'));
	await waitFor(() => screen.getByRole('alert'));
	expect(screen.queryByText('A Political Category Must Be Selected.')).toBeInTheDocument();
});

test('displays error alert if slant has not been selected for bubble burst search', async () => {
	renderFormWithContext('BUBBLE_BURST');
	fireEvent.click(screen.getByText('Get Headlines'));
	await waitFor(() => screen.getByRole('alert'));
	expect(screen.queryByText('A Political Category Must Be Selected.')).toBeInTheDocument();
});

test('displays error alert if no sources have been selected for user select search', async () => {
	renderFormWithContext('USER_SELECT');
	fireEvent.click(screen.getByText('Get Headlines'));
	await waitFor(() => screen.getByRole('alert'));
	expect(screen.queryByText('At Least 1 Source Must Be Selected.')).toBeInTheDocument();
});

test('get headlines call is made if form is valid', async () => {
	const apiSpy = vi.spyOn(apiService, 'callApi');
	server.use(http.get('http://test.com/api/headlines', () => HttpResponse.json({})));
	renderFormWithContext('MY_BUBBLE');
	fireEvent.click(screen.getByLabelText('Center-Left'));
	fireEvent.click(screen.getByText('Get Headlines'));
	expect(screen.queryByRole('alert')).not.toBeInTheDocument();
	expect(apiSpy).toHaveBeenCalledTimes(1);
});
