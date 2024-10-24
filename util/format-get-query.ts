const formatGetQuery = (params: Record<string, unknown>): string => {
	const query: string[] = [];
	if (params) {
		Object.keys(params).forEach(key => {
			query.push(key + '=' + (typeof params[key] === 'object' ? String(params[key]) : params[key]));
		});
	}

	return query.length > 0 ? '?' + query.join('&') : '';
};

export default formatGetQuery;
