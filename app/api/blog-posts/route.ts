import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getPostSummaries, savePost } from '@/services/blog-service';

export const GET = async (request: NextRequest) => {
	const { searchParams } = request.nextUrl;
	return NextResponse.json(
		await getPostSummaries(searchParams.get('filter') || '', +(searchParams.get('page') || 1))
	);
};

export const POST = auth(async request => {
	if (!request.auth?.user.id) {
		return NextResponse.json({ slug: null });
	} else {
		const postToSave = await request.json();
		return NextResponse.json(await savePost(postToSave));
	}
});
