const formatGetQuery = params => {
	const query = [];
	if (params) {
		Object.keys(params).forEach(key => {
			query.push(
				key + '=' + (typeof params[key] === 'object' ? params[key].toString() : params[key])
			);
		});
	}

	return query.length > 0 ? '?' + query.join('&') : '';
};

module.exports = formatGetQuery;
