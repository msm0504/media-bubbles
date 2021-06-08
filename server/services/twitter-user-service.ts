import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import formatGetQuery from '../util/format-get-query';

const headers = { Accept: 'application/json' };
const defaultParams = { count: 1, include_entities: false };

const oauth = new OAuth({
	consumer: {
		key: '' + process.env.TWITTER_APP_KEY,
		secret: '' + process.env.TWITTER_APP_SECRET
	},
	signature_method: 'HMAC-SHA1',
	hash_function(base_string, key) {
		return crypto.createHmac('sha1', key).update(base_string).digest('base64');
	}
});

const token = {
	key: '' + process.env.TWITTER_USER_KEY,
	secret: '' + process.env.TWITTER_USER_SECRET
};

async function searchUser(source: string) {
	const requestData = {
		method: 'GET',
		url: `${process.env.TWITTER_USER_API_URL}${formatGetQuery({ q: source, ...defaultParams })}`
	};
	const requestOptions = {
		method: 'GET',
		headers: { ...headers, ...oauth.toHeader(oauth.authorize(requestData, token)) }
	};
	const response = await fetch(requestData.url, requestOptions);
	return response.json();
}

export async function getTwitterHandle(source: string): Promise<string> {
	const foundUsers = await searchUser(source);
	return foundUsers && foundUsers.length && foundUsers[0].verified
		? foundUsers[0].screen_name
		: null;
}
