const { MILLISECONDS_IN_DAY, MILLISECONDS_IN_FIFTEEN_MIN } = require('../constants');
const formatGetQuery = require('../util/format-get-query');
const { getBiasRatingBySourceId, getSourceLists } = require('./source-list-service');

const MAX_TWITTER_RESULTS = 100;
const MAX_SHOW_PER_CATEGORY = 10;
const headers = {
	Accept: 'application/json',
	Authorization: `Bearer ${process.env.TWITTER_APP_BEARER}`
};
const defaultParams = { max_results: MAX_TWITTER_RESULTS, expansions: 'author_id' };
const defaultOperators = 'has:links -is:retweet';
const DEFAULT_PREVIOUS_DAYS = 5;

global.latest = global.latest || { lastUpdate: 0 };

const filterDupeTweets = data => {
	const uniqueTweets = {};
	let uniqueCount = 0;
	for (let i = 0; i < data.length && uniqueCount < MAX_SHOW_PER_CATEGORY; i++) {
		const { text } = data[i];
		const linkIndex = text.indexOf('http');
		if (linkIndex > -1) {
			const withoutLinks = text.substring(0, linkIndex).trim();
			if (!uniqueTweets[withoutLinks]) {
				uniqueTweets[withoutLinks] = data[i];
				uniqueCount++;
			}
		}
	}
	return Object.values(uniqueTweets);
};

const addAnchorsToText = text =>
	text.replace(
		/(http?s:\/\/\S+)/g,
		'<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
	);

const getSourceName = (tweet, users, appSourceList) => {
	const twitterHandle = users.find(({ id }) => id === tweet.author_id).username;
	return appSourceList.find(({ id }) => id === twitterHandle).name;
};

async function getHeadlines(params) {
	if (!params || (!params.sources && !params.spectrumSearchAll)) {
		return {};
	}
	const { appSourceList, sourceListBySlant } = await getSourceLists();
	const isSpectrumSearch = !params.sources && params.spectrumSearchAll;
	const sources = isSpectrumSearch ? sourceListBySlant : params.sources.split(',');

	return sources.reduce(async function (memo, sources) {
		const { meta, data, includes } = await getRecentTweets(
			sources,
			params.keyword,
			params.previousDays
		);
		const acc = await memo;
		if (meta.result_count) {
			const { users } = includes;
			const key = isSpectrumSearch ? getBiasRatingBySourceId(users[0].username) : users[0].username;
			acc[key] = filterDupeTweets(data).map(tweet => ({
				...tweet,
				text: addAnchorsToText(tweet.text),
				sourceName: getSourceName(tweet, users, appSourceList)
			}));
		} else {
			const key = isSpectrumSearch ? getBiasRatingBySourceId(sources[0].id) : sources;
			acc[key] = [];
		}
		return acc;
	}, {});
}

async function getRecentTweets(sources, keyword, previousDays) {
	const fromFilters = Array.isArray(sources)
		? `(${sources.map(({ id }) => `from:${id}`).join(' OR ')})`
		: `from:${sources}`;
	const query = `${keyword ? `${keyword} ` : ''}${fromFilters} ${defaultOperators}`;
	const params = { query, ...defaultParams };

	if (keyword) {
		const fromDate = new Date(
			Date.now() - MILLISECONDS_IN_DAY * ((previousDays || DEFAULT_PREVIOUS_DAYS) - 1)
		);
		fromDate.setHours(0, 0, 0);
		params.start_time = fromDate.toISOString();
	}

	const requestOptions = { method: 'GET', headers };
	const response = await fetch(
		`${process.env.TWITTER_POST_API_URL}${formatGetQuery(params)}`,
		requestOptions
	);
	return response.json();
}

async function getLatestHeadlines() {
	const headlinesAreOld = Date.now() - MILLISECONDS_IN_FIFTEEN_MIN > global.latest.lastUpdate;
	if (!global.latest.articleMap || headlinesAreOld) {
		global.latest.articleMap = await getHeadlines({ spectrumSearchAll: true });
		global.latest.lastUpdate = Date.now();
	}
	return global.latest.articleMap;
}

module.exports = {
	getHeadlines,
	getLatestHeadlines
};
