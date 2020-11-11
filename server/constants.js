module.exports = {
	ADMIN_ID: process.env.NEXT_PUBLIC_ADMIN_ID,
	MILLISECONDS_IN_DAY: 1000 * 60 * 60 * 24,
	useTestData: process.env.NEXT_PUBLIC_TEST_DATA === 'true'
};
