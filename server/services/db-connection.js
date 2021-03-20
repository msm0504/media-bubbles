const { MongoClient } = require('mongodb');

const { MONGODB_URL } = require('../constants');

global.mongo = global.mongo || {};

async function getDbConnection() {
	if (!global.mongo.client) {
		global.mongo.client = new MongoClient(MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			bufferMaxEntries: 0
		});
		await global.mongo.client.connect();
	}
	return global.mongo.client.db(process.env.MONGODB_DBNAME);
}

const getCollection = collectionName =>
	new Promise(resolve => {
		getDbConnection().then(db => resolve(db.collection(collectionName)));
	});

module.exports = {
	getCollection
};
