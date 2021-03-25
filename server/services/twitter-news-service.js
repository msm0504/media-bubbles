const { MILLISECONDS_IN_DAY } = require('../constants');
const formatGetQuery = require('../util/format-get-query');
const { getBiasRatingBySourceId, getSourceLists } = require('./source-list-service');

const headers = {
	Accept: 'application/json',
	Authorization: `Bearer ${process.env.TWITTER_APP_BEARER}`
};
const defaultParams = { max_results: 10, expansions: 'author_id' };
const defaultOperators = 'has:links -is:retweet';
const DEFAULT_PREVIOUS_DAYS = 5;

const addAnchorsToText = text =>
	text.replace(
		/(http?s:\/\/\S+)/g,
		'<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
	);

const getSourceName = (tweet, users) => users.find(user => user.id === tweet.author_id).name;

async function getHeadlines(params) {
	if (!params || (!params.sources && !params.spectrumSearchAll)) {
		return {};
	}
	const isSpectrumSearch = !params.sources && params.spectrumSearchAll;
	const sources = isSpectrumSearch
		? (await getSourceLists()).sourceListBySlant
		: params.sources.split(',');

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
			acc[key] = data.map(tweet => ({
				...tweet,
				text: addAnchorsToText(tweet.text),
				sourceName: getSourceName(tweet, users)
			}));
		} else {
			const key = isSpectrumSearch ? getBiasRatingBySourceId(sources[0]) : sources;
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

	const fromDate = new Date(
		Date.now() - MILLISECONDS_IN_DAY * ((previousDays || DEFAULT_PREVIOUS_DAYS) - 1)
	);
	fromDate.setHours(0, 0, 0);

	const params = { query, start_time: fromDate.toISOString(), ...defaultParams };
	const requestOptions = { method: 'GET', headers };
	const response = await fetch(
		`${process.env.TWITTER_POST_API_URL}${formatGetQuery(params)}`,
		requestOptions
	);
	return response.json();
}

module.exports = {
	getHeadlines
};
