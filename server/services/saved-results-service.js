const { MongoClient } = require('mongodb');
const { nanoid } = require('nanoid');

const { MONGODB_URL } = require('../constants');

const COLLECTION_NAME = 'saved_results';
const PAGE_SIZE = 5;
const client = new MongoClient(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const _collection = new Promise(resolve => {
	client
		.connect()
		.then(() => resolve(client.db(process.env.MONGODB_DBNAME).collection(COLLECTION_NAME)));
});

async function saveSearchResult(result) {
	const db = await _collection;
	const { insertedId } = await db.insertOne({
		_id: nanoid(16),
		...result,
		createdAt: new Date().toISOString()
	});
	return { savedResultId: insertedId };
}

async function getSavedResults(filter = '', page = 1, userId) {
	const db = await _collection;
	const savedResults = await db
		.find({ name: { $regex: `^.*${filter}.*$`, $options: 'i' }, userId: userId })
		.map(({ _id, name, createdAt }) => ({ _id, name, createdAt }))
		.sort({ createdAt: -1 })
		.skip(PAGE_SIZE * (page - 1))
		.limit(PAGE_SIZE + 1)
		.toArray();

	return {
		savedResults: savedResults.slice(0, PAGE_SIZE),
		hasMore: savedResults.length > PAGE_SIZE
	};
}

async function getAllSavedResults(filter = '', page = 1) {
	const db = await _collection;
	const savedResults = await db
		.find({ name: { $regex: `^.*${filter}.*$`, $options: 'i' } })
		.map(({ _id, name, createdAt }) => ({ _id, name, createdAt }))
		.sort({ createdAt: -1 })
		.skip(PAGE_SIZE * (page - 1))
		.limit(PAGE_SIZE + 1)
		.toArray();

	return {
		savedResults: savedResults.slice(0, PAGE_SIZE),
		hasMore: savedResults.length > PAGE_SIZE
	};
}

async function getSavedResult(id) {
	const db = await _collection;
	return db.findOne({ _id: id });
}

async function deleteSavedResult(id, userId) {
	const db = await _collection;
	const { deletedCount } = await db.deleteOne({ _id: id, userId: userId });
	return { itemDeleted: deletedCount === 1 };
}

module.exports = {
	deleteSavedResult,
	getAllSavedResults,
	getSavedResult,
	getSavedResults,
	saveSearchResult
};
