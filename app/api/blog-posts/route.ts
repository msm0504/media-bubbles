import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { isAdmin } from '@/constants/admin-role';
import { createPost, getPostSummaries } from '@/services/blog-service';

export const GET = async (request: Request) => {
	const { searchParams } = new URL(request.url);
	return Response.json(
		await getPostSummaries(searchParams.get('filter') || '', +(searchParams.get('page') || 1))
	);
};

export const POST = async (request: Request) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session?.user) {
		return Response.json({}, { status: 401 });
	}
	if (!isAdmin(session?.user.role)) {
		return Response.json({}, { status: 403 });
	}
	const postToCreate = await request.json();
	return Response.json(await createPost(postToCreate));
};
