import { getMostRecent, searchMostRecent } from '@/services/news-search-service';

export const GET = async (request: Request) => {
	const { searchParams } = new URL(request.url);
	const keyword = searchParams.get('keyword');
	return Response.json(await (keyword ? searchMostRecent(keyword) : getMostRecent()));
};
