import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import type { BlogPost } from '@/types';
import { isAdmin } from '@/constants/admin-role';
import { deletePost, updatePost } from '@/services/blog-service';

export const PUT = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session?.user) {
		return Response.json({}, { status: 401 });
	}
	if (!isAdmin(session?.user.role)) {
		return Response.json({}, { status: 403 });
	}
	const postToUpdate = (await request.json()) as BlogPost;
	if ((await params)?.id !== postToUpdate.slug) {
		return Response.json({}, { status: 500 });
	}
	return Response.json(await updatePost(postToUpdate));
};

export const DELETE = async (
	_request: Request,
	{ params }: { params: Promise<{ id: string }> }
) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session?.user) {
		return Response.json({ itemDeleted: false }, { status: 401 });
	}
	if (!isAdmin(session?.user.role)) {
		return Response.json({ itemDeleted: false }, { status: 403 });
	}
	return Response.json(await deletePost((await params)?.id as string));
};
