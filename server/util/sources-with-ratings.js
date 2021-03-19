const formatGetQuery = require('./format-get-query');
const { MILLISECONDS_IN_DAY, useTestData } = require('../constants');

const headers = { Accept: 'application/json', 'X-Api-Key': process.env.NEWS_API_KEY };
const path = process.env.NEWS_API_URL;

const ALLSIDES_SCALE_START = 71;
const ALLSIDES_MIXED = 2707;
const ALLSIDES_UNKNOWN = 2690;
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
	testSourceData = require('../../server/test-data/source-data.json');
	testBiasRatings = require('../../server/test-data/allsides_data.json');
}

async function getSources() {
	const url = `${path}/sources`;
	const params = { language: 'en' };
	const requestOptions = { method: 'GET', headers };
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

	const biasRatings = useTestData ? testBiasRatings : await getBiasRatings();
	filteredBiasRatings = biasRatings.reduce((acc, sourceBiasRating) => {
		if (
			!sourceBiasRating.bias_rating ||
			sourceBiasRating.bias_rating == ALLSIDES_MIXED ||
			sourceBiasRating.bias_rating == ALLSIDES_UNKNOWN
		)
			return acc;

		const sourceId = sourceBiasRating.news_source
			.toLowerCase()
			.replace(/\(.*\)/, '') // ignore part of name in ()
			.replace(/^the\s/, '') // ignore 'the ' at start of name
			.replace('opinion', '') // ignore 'opinion' and 'editorial'
			.replace('editorial', '')
			.replace(/\s-\snews$/, '') // ignore '- news' at end of name
			.replace(/\s+-?\s*/g, '-')
			.replace(/-$/, '');

		const biasRating = +sourceBiasRating.bias_rating - ALLSIDES_SCALE_START;
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
	getSourceLists,
	setFilteredBiasRatings
};
