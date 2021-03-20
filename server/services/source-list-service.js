const formatGetQuery = require('../util/format-get-query');
const { MILLISECONDS_IN_DAY, useTestData } = require('../constants');

const headers = { Accept: 'application/json' };

const ALL_SIDES_RATINGS_TO_INT = {
	Left: 0,
	'Lean Left': 1,
	Center: 2,
	'Lean Right': 3,
	Right: 4
};
const CENTER = 2;
const ALLOWED_SOURCE_TYPES = ['general', 'business'];

global.sources = global.sources || { lastUpdate: 0 };
const resetSourceLists = () => {
	global.sources.app = [];
	global.sources.bySlant = [];
	global.sources.biasRatings = {};
};

let testSourceData;
let testBiasRatings;
if (useTestData) {
	testSourceData = require('../test-data/source-data.json');
	testBiasRatings = require('../test-data/allsides_pub_data.json');
}

async function getSources() {
	const url = `${process.env.NEWS_API_URL}/sources`;
	const params = { language: 'en' };
	const requestOptions = {
		method: 'GET',
		headers: { ...headers, 'X-Api-Key': process.env.NEWS_API_KEY }
	};
	const response = await fetch(`${url}${formatGetQuery(params)}`, requestOptions);
	return response.json();
}

async function getBiasRatings() {
	const requestOptions = { method: 'GET', headers };
	const response = await fetch(process.env.ALL_SIDES_RATINGS_URL, requestOptions);
	return response.json();
}

async function setFilteredBiasRatings() {
	if (global.sources.biasRatings && Object.keys(global.sources.biasRatings).length) {
		return;
	}

	const biasRatingsResponse = useTestData ? testBiasRatings : await getBiasRatings();
	const biasRatings =
		biasRatingsResponse?.allsides_media_bias_ratings.map(({ publication }) => publication) || [];
	global.sources.biasRatings = biasRatings.reduce((acc, { source_name, media_bias_rating }) => {
		const biasRating = ALL_SIDES_RATINGS_TO_INT[media_bias_rating];
		if (biasRating === null || typeof biasRating === 'undefined') return acc;

		const sourceId = source_name
			.toLowerCase()
			.replace(/\(.*\)/, '') // ignore part of name in ()
			.replace(/^the\s/, '') // ignore 'the ' at start of name
			.replace('opinion', '') // ignore 'opinion' and 'editorial'
			.replace('editorial', '')
			.replace(/\s-\snews$/, '') // ignore '- news' at end of name
			.replace(/\s+-?\s*/g, '-')
			.replace(/-$/, '');

		// If multiple matches, use more extreme rating. Search results could include opinion pieces
		if (!acc[sourceId] || Math.abs(biasRating - CENTER) > Math.abs(acc[sourceId] - CENTER)) {
			acc[sourceId] = biasRating;
		}
		return acc;
	}, {});
}

const oddMappings = {
	time: 'time-magazine',
	'nbc-news': 'nbcnews.com',
	'huffington-post': 'huffpost',
	'vice-news': 'vice'
};

const excludeSources = {
	'google-news': true
};

const getBiasRatingByNewsApiId = newsApiId => {
	const key = newsApiId.replace('the-', '').replace('-english', ''); // '-english' is end of Al Jazeera NewsAPI id

	if (excludeSources[key]) return;

	return typeof global.sources.biasRatings[key] === 'number'
		? global.sources.biasRatings[key]
		: global.sources.biasRatings[oddMappings[key]];
};

const formatUrl = sourceUrl => {
	let formattedUrl = sourceUrl;

	const pathIndex = formattedUrl.search(/[A-Za-z]\/[A-Za-z1-9].*$/);
	if (pathIndex > -1) {
		formattedUrl = formattedUrl.substring(0, pathIndex + 1);
	}

	const protocolIndex = formattedUrl.indexOf('//');
	formattedUrl = formattedUrl.substring(protocolIndex + 2);

	return formattedUrl;
};

async function populateSourceLists() {
	console.log('Generating new source lists');
	resetSourceLists();

	const sourceResponse = useTestData ? testSourceData : await getSources();
	const searchableSources = sourceResponse.status === 'ok' ? sourceResponse.sources : [];

	await setFilteredBiasRatings();

	searchableSources.forEach(source => {
		if (!ALLOWED_SOURCE_TYPES.includes(source.category)) return;

		const sourceSlant = getBiasRatingByNewsApiId(source.id);
		if (typeof sourceSlant === 'number') {
			if (!global.sources.bySlant[sourceSlant]) {
				global.sources.bySlant[sourceSlant] = [];
			}
			source.url = formatUrl(source.url);
			global.sources.app.push(source);
			global.sources.bySlant[sourceSlant].push(source);
		}
	});

	global.sources.lastUpdate = Date.now();
}

async function getSourceLists() {
	const sourceListsAreOld = Date.now() - MILLISECONDS_IN_DAY * 7 > global.sources.lastUpdate;
	if (!(global.sources.app && global.sources.app.length) || sourceListsAreOld) {
		await populateSourceLists();
	}
	return { appSourceList: global.sources.app, sourceListBySlant: global.sources.bySlant };
}

module.exports = {
	getBiasRatingByNewsApiId,
	getSourceLists
};
