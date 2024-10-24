export const SEARCH_MODE_MAP = {
	FULL_SPECTRUM: {
		name: 'Across the Spectrum',
		description: 'sources spanning the political spectrum',
	},
	MY_BUBBLE: { name: 'Stay in My Bubble', description: 'agreeable sources' },
	BUBBLE_BURST: { name: 'Burst My Bubble', description: 'opposing sources' },
	RANDOM: { name: 'Random', description: 'randomly selected sources' },
	USER_SELECT: { name: 'I Want to Pick', description: 'chosen sources' },
	SAVED_RESULTS: { name: 'My Saved Results', description: '' },
};

export type SearchMode = keyof typeof SEARCH_MODE_MAP;
