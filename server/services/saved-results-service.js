const datastore = require('nedb-promise');
const path = require('path');
const { ROOT, useTestData } = require('../constants');

const dbFilePath = useTestData
	? '/test-data/db/db_search_results.db'
	: '/data/db_search_results.db';

const db = datastore({
	filename: path.join(ROOT, 'server', dbFilePath),
	autoload: true,
	timestampData: true
});
const PAGE_SIZE = 25;

async function saveSearchResult(result) {
	const savedResult = await db.insert(result);
	return { savedResultId: savedResult._id };
}

async function getSavedResults(filter = '', page = 1, userId) {
	const savedResults = await db
		.cfind({ name: new RegExp(`^.*${filter}.*$`, 'i'), userId: userId })
		.projection({ name: 1, createdAt: 1 })
		.sort({ createdAt: -1 })
		.skip(PAGE_SIZE * (page - 1))
		.limit(PAGE_SIZE + 1)
		.exec();

	return {
		savedResults: savedResults.slice(0, PAGE_SIZE),
		hasMore: savedResults.length > PAGE_SIZE
	};
}

async function getAllSavedResults(filter = '', page = 1) {
	const savedResults = await db
		.cfind({ name: new RegExp(`^.*${filter}.*$`, 'i') })
		.projection({ name: 1, createdAt: 1 })
		.sort({ createdAt: -1 })
		.skip(PAGE_SIZE * (page - 1))
		.limit(PAGE_SIZE + 1)
		.exec();

	return {
		savedResults: savedResults.slice(0, PAGE_SIZE),
		hasMore: savedResults.length > PAGE_SIZE
	};
}

async function getSavedResult(id) {
	return db.findOne({ _id: id });
}

module.exports = {
	getAllSavedResults,
	getSavedResult,
	getSavedResults,
	saveSearchResult
};
