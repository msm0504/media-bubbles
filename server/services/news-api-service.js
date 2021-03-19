const { MILLISECONDS_IN_DAY } = require('../constants');
const formatGetQuery = require('../util/format-get-query');
const { getBiasRatingByNewsApiId, getSourceLists } = require('./source-list-service');

const headers = { Accept: 'application/json', 'X-Api-Key': process.env.NEWS_API_KEY };
const path = process.env.NEWS_API_URL;
const DEFAULT_PREVIOUS_DAYS = 5;
const DEFAULT_SORT = 'relevancy';

async function getHeadlines(params) {
	if (!params || (!params.sources && !params.spectrumSearchAll)) {
		return [];
	}

	const articleMap = {};
	if (!params.sources && params.spectrumSearchAll) {
		const { sourceListBySlant } = await getSourceLists();
		params.sources = sourceListBySlant.map(slantSources =>
			slantSources
				.map(source => source.id)
				// reuters everything search includes repeated headlines from multiple domains
				// want to show headlines from other sources
				.filter(sourceId => sourceId !== 'reuters')
				.join()
		);
		const articleResponses = params.keyword
			? await getHeadlinesForKeyword(params)
			: await getTopHeadlinesBySlant(params.sources);
		articleResponses.forEach(response => {
			if (response.status === 'ok' && response.articles.length) {
				const biasRating = getBiasRatingByNewsApiId(response.articles[0].source.id);
				articleMap[biasRating] = response.articles;
			}
		});
	} else if (params.keyword) {
		params.sources = params.sources.split(',');
		const articleResponses = await getHeadlinesForKeyword(params);
		articleResponses.forEach(response => {
			if (response.status === 'ok' && response.articles.length) {
				articleMap[response.articles[0].source.id] = response.articles;
			}
		});
	} else {
		const articleResponse = await getTopHeadlines(params.sources);
		if (articleResponse.status === 'ok') {
			articleResponse.articles.forEach(article => {
				if (!articleMap[article.source.id]) {
					articleMap[article.source.id] = [];
				}
				articleMap[article.source.id].push(article);
			});
		}
	}
	return articleMap;
}

async function getTopHeadlines(sourceIds) {
	const url = `${path}/top-headlines`;
	const params = { sources: sourceIds, pageSize: 50 };
	const requestOptions = { method: 'GET', headers };
	const response = await fetch(`${url}${formatGetQuery(params)}`, requestOptions);
	return response.json();
}

async function getTopHeadlinesBySlant(sourceIds) {
	const url = `${path}/top-headlines`;
	const params = { sources: sourceIds, pageSize: 10 };
	const requestOptions = { method: 'GET', headers };
	const responses = await Promise.all(
		sourceIds.map(slantIds =>
			fetch(`${url}${formatGetQuery({ ...params, sources: slantIds })}`, requestOptions)
		)
	);
	return Promise.all(responses.map(response => response.json()));
}

async function getHeadlinesForKeyword({
	sources,
	keyword,
	onlySearchTitles,
	previousDays,
	sortBy
}) {
	const url = `${path}/everything`;
	const fromDate = new Date(
		Date.now() - MILLISECONDS_IN_DAY * ((previousDays || DEFAULT_PREVIOUS_DAYS) - 1)
	);
	fromDate.setHours(0, 0, 0);
	const params = {
		[onlySearchTitles === 'Y' ? 'qInTitle' : 'q']: keyword,
		from: fromDate.toISOString(),
		language: 'en',
		pageSize: 10,
		sortBy: sortBy || DEFAULT_SORT
	};
	const requestOptions = { method: 'GET', headers };
	const responses = await Promise.all(
		sources.map(sourceId =>
			fetch(`${url}${formatGetQuery({ ...params, sources: sourceId })}`, requestOptions)
		)
	);
	return Promise.all(responses.map(response => response.json()));
}

module.exports = {
	getHeadlines
};
