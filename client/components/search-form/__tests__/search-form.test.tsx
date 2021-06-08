import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import SearchForm from '../search-form';
import { SearchMode } from '../../../constants/search-mode';
import MAX_SOURCE_SELECTIONS from '../../../constants/max-source-selections';
import { appSourceList, sourceListBySlant } from '../../../../test-utils/source-lists.json';

describe('Search Form', () => {
	const renderForm = (searchMode: SearchMode) =>
		render(
			<SearchForm
				searchMode={searchMode}
				appSourceList={appSourceList}
				sourceListBySlant={sourceListBySlant}
			/>
		);

	it('should render the component', () => {
		renderForm('MY_BUBBLE');
		expect(screen.queryByText(/^Choose the category.*$/)).toBeInTheDocument();
		expect(screen.queryByLabelText('Center-Left')).toBeInTheDocument();
	});

	it('should render across the spectrum form', () => {
		renderForm('FULL_SPECTRUM');
		expect(screen.queryByText(/^Choose the category.*$/)).not.toBeInTheDocument();
		expect(
			screen.queryByLabelText('Include Multiple Sources In Each Category')
		).toBeInTheDocument();
	});

	it('should render user select form', () => {
		renderForm('USER_SELECT');
		expect(
			screen.queryByText(`Choose up to ${MAX_SOURCE_SELECTIONS} sources.`)
		).toBeInTheDocument();
		const cnnCheckbox = screen.queryByLabelText('CNN') as HTMLInputElement;
		expect(cnnCheckbox).toBeInTheDocument();
		fireEvent.click(cnnCheckbox, { target: { checked: false } });
		expect(cnnCheckbox.checked).toBe(true);
		fireEvent.click(cnnCheckbox, { target: { checked: true } });
		expect(cnnCheckbox.checked).toBe(false);
	});

	it('should have no extra for random search', () => {
		renderForm('RANDOM');
		expect(screen.queryByText(/^Choose the category.*$/)).not.toBeInTheDocument();
		expect(
			screen.queryByLabelText('Include Multiple Sources In Each Category')
		).not.toBeInTheDocument();
		expect(
			screen.queryByText(`Choose up to ${MAX_SOURCE_SELECTIONS} sources.`)
		).not.toBeInTheDocument();
	});

	it('should give more options if keyword entered', () => {
		renderForm('FULL_SPECTRUM');
		const keywordInput = screen.getByLabelText('Key Words', { exact: false });
		fireEvent.change(keywordInput, { target: { value: 'truth' } });
		expect(screen.queryByLabelText('Search Past 5 Day(s)')).toBeInTheDocument();
	});
});
