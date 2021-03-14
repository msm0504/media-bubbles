const { MongoClient } = require('mongodb');

const { MONGODB_URL } = require('../constants');

const client = new MongoClient(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const _db = new Promise(resolve => {
	client.connect().then(() => resolve(client.db(process.env.MONGODB_DBNAME)));
});

const getCollection = collectionName =>
	new Promise(resolve => {
		_db.then(db => resolve(db.collection(collectionName)));
	});

module.exports = {
	getCollection
};
