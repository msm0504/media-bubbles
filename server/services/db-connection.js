const { MongoClient } = require('mongodb');

const { MONGODB_URL } = require('../constants');

global.mongo = global.mongo || { db: null, promise: null };

async function getDbConnection() {
	if (global.mongo.db) {
		return global.mongo.db;
	}

	if (!global.mongo.promise) {
		const client = new MongoClient(MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			bufferMaxEntries: 0
		});
		global.mongo.promise = client.connect().then(client => client.db(process.env.MONGODB_DBNAME));
	}
	global.mongo.db = await global.mongo.promise;
	return global.mongo.db;
}

const getCollection = collectionName =>
	new Promise(resolve => {
		getDbConnection().then(db => resolve(db.collection(collectionName)));
	});

module.exports = {
	getCollection
};
