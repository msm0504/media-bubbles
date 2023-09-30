import { getNextSourcesToSearch } from '../source-list-to-search-util';
import { initialState as blankForm } from '@/client/components/search-form/search-form-reducer';
import { SearchMode } from '@/client/constants/search-mode';
import MAX_SOURCE_SELECTIONS from '@/client/constants/max-source-selections';
import { appSourceList, sourceListBySlant } from '@/test-utils/source-lists.json';
import type { SearchFormState } from '@/types';

const getSourcesToSearch = (searchMode: SearchMode, params: SearchFormState = blankForm) =>
	getNextSourcesToSearch({ searchMode, ...params }, appSourceList, sourceListBySlant);

test('handles MY_BUBBLE search', () => {
	expect(sourceListBySlant[1]).toEqual(
		expect.arrayContaining(getSourcesToSearch('MY_BUBBLE', { ...blankForm, sourceSlant: 1 }))
	);
});

test('adds similar sources to MY_BUBBLE search when selection has too few', () => {
	const sourceListToSearch = getSourcesToSearch('MY_BUBBLE', { ...blankForm, sourceSlant: 3 });
	expect(sourceListToSearch.length).toEqual(MAX_SOURCE_SELECTIONS);
	expect([...sourceListBySlant[3], ...sourceListBySlant[4]]).toEqual(
		expect.arrayContaining(sourceListToSearch)
	);
});

test('handles BUBBLE_BURST search', () => {
	expect([...sourceListBySlant[0], ...sourceListBySlant[1]]).toEqual(
		expect.arrayContaining(getSourcesToSearch('BUBBLE_BURST', { ...blankForm, sourceSlant: 4 }))
	);
});

test('handles FULL_SPECTRUM search', () => {
	const sourceListToSearch = getSourcesToSearch('FULL_SPECTRUM');
	sourceListToSearch.forEach((source, index) => expect(sourceListBySlant[index]).toContain(source));
});

test("returns empty list if FULL_SPECTRUM search and search all is 'Y'", () => {
	expect([]).toEqual(getSourcesToSearch('FULL_SPECTRUM', { ...blankForm, spectrumSearchAll: 'Y' }));
});

test('handles RANDOM search', () => {
	expect(appSourceList).toEqual(expect.arrayContaining(getSourcesToSearch('RANDOM')));
});

test('handles USER_SELECT search', () => {
	const selectedSourceIds = ['cnn', 'fox-news', 'msnbc'];
	const sourceListToSearch = getSourcesToSearch('USER_SELECT', {
		...blankForm,
		selectedSourceIds
	});
	expect(appSourceList).toEqual(expect.arrayContaining(sourceListToSearch));
	expect(selectedSourceIds).toEqual(sourceListToSearch.map(source => source.id));
});
