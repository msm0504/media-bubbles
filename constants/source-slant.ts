export const SOURCE_SLANT_MAP = {
	0: 'Left',
	1: 'Center-Left',
	2: 'Center',
	3: 'Center-Right',
	4: 'Right',
};

export type SourceSlant = keyof typeof SOURCE_SLANT_MAP;

export const SIMILAR_VIEW_MAP: { [prop in SourceSlant]: SourceSlant } = {
	0: 1,
	1: 0,
	2: 2,
	3: 4,
	4: 3,
};

export const OPPOSING_VIEW_MAP: { [prop in SourceSlant]: SourceSlant[] } = {
	0: [3, 4],
	1: [3, 4],
	2: [0, 4],
	3: [0, 1],
	4: [0, 1],
};
