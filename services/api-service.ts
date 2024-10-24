import FormData from 'form-data';
import formatGetQuery from '@/util/format-get-query';

type RequestData<T> = {
	[prop in keyof T]: unknown;
};

const headers = {
	Accept: 'application/json',
	'Content-Type': 'application/json',
};
const path = `${process.env.NEXT_PUBLIC_URL}/api`;

export const callApi = <T, U = undefined>(
	method: string,
	endpoint: string,
	data?: RequestData<U>
): Promise<T> => {
	let url = `${path}/${endpoint}`;
	const params: Record<string, unknown> = { method, headers };
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

export const callApiMultipart = <T>(endpoint: string, data: FormData): Promise<T> => {
	const url = `${path}/${endpoint}`;
	const params: Record<string, unknown> = {
		method: 'post',
		headers: { Accept: 'application/json' },
		body: data,
	};
	return fetch(url, params).then(response => {
		if (response.ok) {
			return response.json();
		}
	});
};
