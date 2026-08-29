import { after } from 'next/server';
import { getSourceLists, populateSourceLists } from '@/services/source-list-service';

export const GET = async () => Response.json(await getSourceLists());

export const POST = async (request: Request) => {
	const requestHeaders = new Headers(request.headers);
	const secret = requestHeaders.get('x-batch-job-key');

	if (secret !== process.env.BATCH_JOB_SECRET) {
		return Response.json({ message: 'Invalid secret' }, { status: 401 });
	}

	after(async () => populateSourceLists());

	return Response.json({ message: 'Populating sources and posts started.' }, { status: 202 });
};
