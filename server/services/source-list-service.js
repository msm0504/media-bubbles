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

let appSourceList;
let sourceListBySlant;
let filteredBiasRatings;

const resetSourceLists = () => {
	appSourceList = [];
	sourceListBySlant = [];
	filteredBiasRatings = {};
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
	if (filteredBiasRatings && Object.keys(filteredBiasRatings).length) {
		return;
	}

	const biasRatingsResponse = useTestData ? testBiasRatings : await getBiasRatings();
	const biasRatings =
		biasRatingsResponse?.allsides_media_bias_ratings.map(({ publication }) => publication) || [];
	filteredBiasRatings = biasRatings.reduce((acc, { source_name, media_bias_rating }) => {
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

	return typeof filteredBiasRatings[key] === 'number'
		? filteredBiasRatings[key]
		: filteredBiasRatings[oddMappings[key]];
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
			if (!sourceListBySlant[sourceSlant]) {
				sourceListBySlant[sourceSlant] = [];
			}
			source.url = formatUrl(source.url);
			appSourceList.push(source);
			sourceListBySlant[sourceSlant].push(source);
		}
	});
}

async function getSourceLists() {
	if (!(appSourceList && appSourceList.length)) {
		await populateSourceLists();
	}
	return { appSourceList, sourceListBySlant };
}

setInterval(resetSourceLists, MILLISECONDS_IN_DAY * 7);

module.exports = {
	getBiasRatingByNewsApiId,
	getSourceLists
};
