const SEARCH_MODE = [
	{
		id: 'FULL_SPECTRUM',
		name: 'Across the Spectrum',
		description: 'sources spanning the political spectrum'
	},
	{ id: 'MY_BUBBLE', name: 'Stay in My Bubble', description: 'agreeable sources' },
	{ id: 'BUBBLE_BURST', name: 'Burst My Bubble', description: 'opposing sources' },
	{ id: 'RANDOM', name: 'Random', description: 'randomly selected sources' },
	{ id: 'USER_SELECT', name: 'I Want to Pick', description: 'chosen sources' },
	{ id: 'SAVED_RESULTS', name: 'My Saved Results' }
];

export default SEARCH_MODE;

export const SEARCH_MODE_MAP = SEARCH_MODE.reduce((acc, searchMode) => {
	acc[searchMode.id] = searchMode;
	return acc;
}, {});
