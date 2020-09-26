const SOURCE_SLANT = [
	{ id: '0', name: 'Left' },
	{ id: '1', name: 'Center-Left' },
	{ id: '2', name: 'Center' },
	{ id: '3', name: 'Center-Right' },
	{ id: '4', name: 'Right' }
];

const SOURCE_SLANT_MAP = SOURCE_SLANT.reduce((acc, slant) => {
	acc[slant.id] = slant.name;
	return acc;
}, {});

const SIMILAR_VIEW_MAP = {
	0: 1,
	1: 0,
	3: 4,
	4: 3
};

const OPPOSING_VIEW_MAP = {
	0: [3, 4],
	1: [3, 4],
	2: [0, 4],
	3: [0, 1],
	4: [0, 1]
};

export { SOURCE_SLANT, SOURCE_SLANT_MAP, SIMILAR_VIEW_MAP, OPPOSING_VIEW_MAP };
