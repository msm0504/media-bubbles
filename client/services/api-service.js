const headers = {
	Accept: 'application/json',
	'Content-Type': 'application/json'
};
const path = `${process.env.NEXT_PUBLIC_API_URL}/api`;

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

export const callApi = (method, endpoint, data) => {
	let url = `${path}/${endpoint}`;
	const params = { method, headers };
	if (data) {
		if (method.toLowerCase() === 'post') {
			params.body = JSON.stringify(data);
		} else if (method.toLowerCase() === 'get') {
			url = `${url}${formatGetQuery(data)}`;
		}
	}
	return fetch(url, params).then(response => {
		if (response.ok) {
			return response.json();
		}
	});
};
