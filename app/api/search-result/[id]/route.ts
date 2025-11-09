import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { deleteSavedResult, getSavedResult } from '@/services/saved-results-service';

export const GET = async (_request: Request, { params }: { params: Promise<{ id: string }> }) =>
	Response.json(await getSavedResult((await params).id));

export const DELETE = async (
	_request: Request,
	{ params }: { params: Promise<{ id: string }> }
) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	return Response.json(await deleteSavedResult((await params)?.id as string, session?.user.id));
};
