import { after } from 'next/server';
import { SearchRequest } from '@/types';
import { loadRecentPostsForAllSources } from '@/services/bsky-post-service';
import { getHeadlines } from '@/services/news-search-service';

export const GET = async (request: Request) => {
	const { searchParams } = new URL(request.url);
	const params = Object.fromEntries(searchParams) as unknown as SearchRequest;
	return Response.json(await getHeadlines(params));
};

export const POST = async (request: Request) => {
	const requestHeaders = new Headers(request.headers);
	const secret = requestHeaders.get('x-batch-job-key');

	if (secret !== process.env.BATCH_JOB_SECRET) {
		return Response.json({ message: 'Invalid secret' }, { status: 401 });
	}

	after(async () => loadRecentPostsForAllSources());

	return Response.json({ message: 'Loading posts started.' }, { status: 202 });
};
