import { SearchRequest } from '@/types';
import { getHeadlines } from '@/services/news-search-service';

export const GET = async (request: Request) => {
	const { searchParams } = new URL(request.url);
	const params = Object.fromEntries(searchParams) as unknown as SearchRequest;
	return Response.json(await getHeadlines(params));
};
