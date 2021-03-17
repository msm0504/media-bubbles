const { MILLISECONDS_IN_DAY, useTestData } = require('../constants');
const { getSources } = require('../services/news-api-service');
const sourceBiasRatings = require('../../server/data/allsides_data.json');

const ALLSIDES_SCALE_START = 71;
const ALLSIDES_MIXED = 2707;
const ALLSIDES_UNKNOWN = 2690;
const CENTER = 2;

const ALLOWED_SOURCE_TYPES = ['general', 'business'];

let appSourceList;
let sourceListBySlant;

const resetSourceLists = () => {
	appSourceList = [];
	sourceListBySlant = [];
};

const filteredBiasRatings = sourceBiasRatings.reduce((acc, sourceBiasRating) => {
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

let testSourceData;
if (useTestData) {
	testSourceData = require('../../server/test-data/source-data.json');
}

async function populateSourceLists() {
	resetSourceLists();

	const sourceResponse = useTestData ? testSourceData : await getSources();
	const searchableSources = sourceResponse.status === 'ok' ? sourceResponse.sources : [];

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

if (!(appSourceList && appSourceList.length)) {
	populateSourceLists();
	setInterval(populateSourceLists, MILLISECONDS_IN_DAY * 7);
}

module.exports = {
	appSourceList,
	getBiasRatingByNewsApiId,
	sourceListBySlant
};
