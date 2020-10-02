module.exports = {
	MILLISECONDS_IN_DAY: 1000 * 60 * 60 * 24,
	ROOT: process.env.ROOT,
	useTestData: process.env.NEXT_PUBLIC_TEST_DATA === 'true'
};
