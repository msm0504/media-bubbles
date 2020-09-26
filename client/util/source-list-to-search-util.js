import MAX_SOURCE_SELECTIONS from '../constants/max-source-selections';
import { SIMILAR_VIEW_MAP, OPPOSING_VIEW_MAP } from '../constants/source-slant';

class SourceListToSearchUtil {
	getMyBubbleSourceList(sourceListBySlant, sourceSlant) {
		let myBubbleSourceList = this.selectRandomSourceList(
			sourceListBySlant[sourceSlant],
			MAX_SOURCE_SELECTIONS
		);

		if (myBubbleSourceList.length < MAX_SOURCE_SELECTIONS && SIMILAR_VIEW_MAP[sourceSlant]) {
			myBubbleSourceList = myBubbleSourceList.concat(
				this.selectRandomSourceList(
					sourceListBySlant[SIMILAR_VIEW_MAP[sourceSlant]],
					MAX_SOURCE_SELECTIONS - myBubbleSourceList.length
				)
			);
		}

		return myBubbleSourceList;
	}

	getBubbleBurstSourceList(sourceListBySlant, sourceSlant) {
		const opposingViews = OPPOSING_VIEW_MAP[sourceSlant];
		let bubbleBurstSourceList = [];

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
				this.selectRandomSourceList(
					sourceListBySlant[opposingViews[extraSource]],
					sourcePerSlantCeiling
				)
			);
			bubbleBurstSourceList = bubbleBurstSourceList.concat(
				this.selectRandomSourceList(
					sourceListBySlant[opposingViews[noExtraSource]],
					sourcePerSlantFloor
				)
			);
		} else {
			bubbleBurstSourceList = bubbleBurstSourceList.concat(
				this.selectRandomSourceList(sourceListBySlant[opposingViews[0]], sourcePerSlantFloor)
			);
			bubbleBurstSourceList = bubbleBurstSourceList.concat(
				this.selectRandomSourceList(sourceListBySlant[opposingViews[1]], sourcePerSlantFloor)
			);
		}

		return bubbleBurstSourceList;
	}

	getCrossSpectrumSourceList(sourceListBySlant, spectrumSearchAll) {
		if (spectrumSearchAll === 'Y') return [];

		return sourceListBySlant.flatMap(slantSourceList =>
			this.selectRandomSourceList(slantSourceList, 1)
		);
	}

	getRandomSourceList(sourceList) {
		return this.selectRandomSourceList(sourceList, MAX_SOURCE_SELECTIONS);
	}

	selectRandomSourceList(sourceList, numberToSelect) {
		if (numberToSelect >= sourceList.length) return sourceList;

		const randomSourceList = [];
		const selectedIndexSet = new Set();

		while (selectedIndexSet.size < numberToSelect) {
			const currentSize = selectedIndexSet.size;
			const nextIndex = Math.floor(Math.random() * sourceList.length);
			selectedIndexSet.add(nextIndex);
			if (selectedIndexSet.size > currentSize) {
				randomSourceList.push(sourceList[nextIndex]);
			}
		}

		return randomSourceList;
	}

	getUserSelectedSourceList(sourceList, selectedSourceList) {
		return sourceList.filter(source => {
			return selectedSourceList.indexOf(source.id) > -1;
		});
	}
}

export default new SourceListToSearchUtil();
