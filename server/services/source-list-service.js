const { getTwitterHandle } = require('./twitter-user-service');
const { MILLISECONDS_IN_DAY, useTestData } = require('../constants');
const SOURCE_INCLUDE_LIST = require('../source-include-list.json');

const headers = { Accept: 'application/json' };

const ALL_SIDES_RATINGS_TO_INT = {
	Left: 0,
	'Lean Left': 1,
	Center: 2,
	'Lean Right': 3,
	Right: 4
};
const CENTER = 2;

global.sources = global.sources || { lastUpdate: 0 };
const resetSourceLists = () => {
	global.sources.app = [];
	global.sources.bySlant = [];
	global.sources.biasRatings = {};
};

let testBiasRatings;
if (useTestData) {
	testBiasRatings = require('../test-data/allsides_pub_data.json');
}

async function getBiasRatings() {
	const requestOptions = { method: 'GET', headers };
	const response = await fetch(process.env.ALL_SIDES_RATINGS_URL, requestOptions);
	return response.json();
}

async function setSourcesAndBiasRatings() {
	const biasRatingsResponse = useTestData ? testBiasRatings : await getBiasRatings();
	const biasRatings =
		biasRatingsResponse?.allsides_media_bias_ratings.map(({ publication }) => publication) || [];
	await Promise.all(
		biasRatings.map(async ({ source_name, source_url, media_bias_rating }) => {
			const biasRating = ALL_SIDES_RATINGS_TO_INT[media_bias_rating];
			if (biasRating === null || typeof biasRating === 'undefined') return 0;

			const modifiedName = source_name
				.replace(/\(.*\)/, '') // ignore part of name in ()
				.replace(/\s-\s\S+$/, '') // ignore dash suffix
				.trim();

			if (!SOURCE_INCLUDE_LIST[modifiedName] === true) return 0;

			const twitterHandle = await getTwitterHandle(modifiedName);
			if (!twitterHandle) return 0;
			if (twitterHandle.toLowerCase() === 'oann') {
				source_url = 'https:/www.oann.com/';
			}
			if (!Object.prototype.hasOwnProperty.call(global.sources.biasRatings, twitterHandle)) {
				const formattedUrl = source_url.replace(/(?<!\/)\/[^/]+/g, ''); // remove subdomains
				global.sources.app.push({ id: twitterHandle, name: modifiedName, url: formattedUrl });
			}
			if (
				!Object.prototype.hasOwnProperty.call(global.sources.biasRatings, twitterHandle) ||
				Math.abs(biasRating - CENTER) > Math.abs(global.sources.biasRatings[twitterHandle] - CENTER)
			) {
				global.sources.biasRatings[twitterHandle] = biasRating;
			}
			return 0;
		})
	);
}

async function populateSourceLists() {
	resetSourceLists();

	await setSourcesAndBiasRatings();

	global.sources.app.sort((source1, source2) => {
		const name1 = source1.name.toLowerCase();
		const name2 = source2.name.toLowerCase();

		if (name1 < name2) {
			return -1;
		}
		if (name1 > name2) {
			return 1;
		}
		return 0;
	});

	global.sources.app.forEach(source => {
		const sourceSlant = global.sources.biasRatings[source.id];
		if (!global.sources.bySlant[sourceSlant]) {
			global.sources.bySlant[sourceSlant] = [];
		}
		global.sources.bySlant[sourceSlant].push(source);
	});

	global.sources.lastUpdate = Date.now();
}

async function getSourceLists() {
	const sourceListsAreOld = Date.now() - MILLISECONDS_IN_DAY > global.sources.lastUpdate;
	if (!(global.sources.app && global.sources.app.length) || sourceListsAreOld) {
		await populateSourceLists();
	}
	return { appSourceList: global.sources.app, sourceListBySlant: global.sources.bySlant };
}

const getBiasRatingBySourceId = sourceId => global.sources.biasRatings[sourceId];

module.exports = {
	getBiasRatingBySourceId,
	getSourceLists
};
