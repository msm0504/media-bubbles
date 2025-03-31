import MAX_SOURCE_SELECTIONS from '../constants/max-source-selections';
import { SIMILAR_VIEW_MAP, OPPOSING_VIEW_MAP, SourceSlant } from '../constants/source-slant';
import type { SearchFormWithMode, Source } from '@/types';

// Fisher–Yates shuffle https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
const shuffle = (array: unknown[]) => {
	for (let i = array.length - 1; i > 0; i--) {
		const randomIndex = Math.floor(Math.random() * (i + 1));
		const temporaryValue = array[i];
		array[i] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
};

const selectRandomSourceList = (sourceList: Source[], numberToSelect: number) => {
	if (numberToSelect >= sourceList.length) return sourceList;

	const randomSourceList = [...sourceList];
	shuffle(randomSourceList);
	return randomSourceList.slice(0, numberToSelect);
};

const getMyBubbleSourceList = (sourceListBySlant: Source[][], sourceSlant: SourceSlant) => {
	let myBubbleSourceList = selectRandomSourceList(
		sourceListBySlant[sourceSlant],
		MAX_SOURCE_SELECTIONS
	);

	if (
		myBubbleSourceList.length < MAX_SOURCE_SELECTIONS &&
		sourceSlant !== SIMILAR_VIEW_MAP[sourceSlant]
	) {
		myBubbleSourceList = myBubbleSourceList.concat(
			selectRandomSourceList(
				sourceListBySlant[SIMILAR_VIEW_MAP[sourceSlant]],
				MAX_SOURCE_SELECTIONS - myBubbleSourceList.length
			)
		);
	}

	return myBubbleSourceList;
};

const getBubbleBurstSourceList = (sourceListBySlant: Source[][], sourceSlant: SourceSlant) => {
	const opposingViews = OPPOSING_VIEW_MAP[sourceSlant];
	let bubbleBurstSourceList: Source[] = [];

	const sourcePerSlantFloor = Math.floor(MAX_SOURCE_SELECTIONS / 2);
	const sourcePerSlantCeiling = Math.ceil(MAX_SOURCE_SELECTIONS / 2);

	if (sourcePerSlantFloor !== sourcePerSlantCeiling) {
		let extraSource;
		let noExtraSource;

		if (sourceListBySlant[opposingViews[0]].length < sourcePerSlantCeiling) {
			noExtraSource = 0;
			extraSource = 1;
		} else if (sourceListBySlant[opposingViews[1]].length < sourcePerSlantCeiling) {
			noExtraSource = 1;
			extraSource = 0;
		} else {
			extraSource = Math.floor(Math.random() * 2);
			noExtraSource = 1 - extraSource;
		}

		bubbleBurstSourceList = bubbleBurstSourceList.concat(
			selectRandomSourceList(sourceListBySlant[opposingViews[extraSource]], sourcePerSlantCeiling)
		);
		bubbleBurstSourceList = bubbleBurstSourceList.concat(
			selectRandomSourceList(sourceListBySlant[opposingViews[noExtraSource]], sourcePerSlantFloor)
		);
	} else {
		bubbleBurstSourceList = bubbleBurstSourceList.concat(
			selectRandomSourceList(sourceListBySlant[opposingViews[0]], sourcePerSlantFloor)
		);
		bubbleBurstSourceList = bubbleBurstSourceList.concat(
			selectRandomSourceList(sourceListBySlant[opposingViews[1]], sourcePerSlantFloor)
		);
	}

	return bubbleBurstSourceList;
};

const getCrossSpectrumSourceList = (
	sourceListBySlant: Source[][],
	spectrumSearchAll: 'Y' | 'N' | undefined
) => {
	if (spectrumSearchAll === 'Y') return [];

	return sourceListBySlant.flatMap(slantSourceList => selectRandomSourceList(slantSourceList, 1));
};

const getRandomSourceList = (sourceList: Source[]) => {
	return selectRandomSourceList(sourceList, MAX_SOURCE_SELECTIONS);
};

const getUserSelectedSourceList = (sourceList: Source[], selectedSourceList: string[]) => {
	return sourceList.filter(source => {
		return selectedSourceList.indexOf(source.id) > -1;
	});
};

export const getNextSourcesToSearch = (
	formData: SearchFormWithMode,
	appSourceList: Source[],
	sourceListBySlant: Source[][]
): Source[] => {
	let sourceListToSearch: Source[] = [];
	switch (formData.searchMode) {
		case 'MY_BUBBLE':
			sourceListToSearch = getMyBubbleSourceList(
				sourceListBySlant,
				formData.sourceSlant as SourceSlant
			);
			break;

		case 'BUBBLE_BURST':
			sourceListToSearch = getBubbleBurstSourceList(
				sourceListBySlant,
				formData.sourceSlant as SourceSlant
			);
			break;

		case 'FULL_SPECTRUM':
			sourceListToSearch = getCrossSpectrumSourceList(
				sourceListBySlant,
				formData.spectrumSearchAll
			);
			break;

		case 'RANDOM':
			sourceListToSearch = getRandomSourceList(appSourceList);
			break;

		case 'USER_SELECT':
			sourceListToSearch = getUserSelectedSourceList(appSourceList, formData.selectedSourceIds);
			break;
	}

	return sourceListToSearch;
};
