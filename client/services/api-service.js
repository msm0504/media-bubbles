class APIService {
	constructor() {
		this.headers = {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		};
		this.path = `${process.env.NEXT_PUBLIC_API_URL}/api`;
	}

	formatGetQuery(params) {
		const query = [];
		if (params) {
			Object.keys(params).forEach(key => {
				query.push(
					key + '=' + (typeof params[key] === 'object' ? params[key].toString() : params[key])
				);
			});
		}

		return query.length > 0 ? '?' + query.join('&') : '';
	}

	callApi(method, endpoint, data) {
		let url = `${this.path}/${endpoint}`;
		const params = { method, headers: this.headers };
		if (data) {
			if (method.toLowerCase() === 'post') {
				params.body = JSON.stringify(data);
			} else if (method.toLowerCase() === 'get') {
				url = `${url}${this.formatGetQuery(data)}`;
			}
		}
		return fetch(url, params).then(response => {
			if (response.ok) {
				return response.json();
			}
		});
	}
}

export default new APIService();
