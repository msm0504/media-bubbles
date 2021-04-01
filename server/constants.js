module.exports = {
	MILLISECONDS_IN_DAY: 1000 * 60 * 60 * 24,
	MILLISECONDS_IN_FIFTEEN_MIN: 1000 * 60 * 15,
	MONGODB_URL: `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority`,
	useTestData: process.env.NEXT_PUBLIC_TEST_DATA === 'true'
};
