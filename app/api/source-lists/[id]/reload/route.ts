import { after } from 'next/server';
import { reloadSource } from '@/services/source-list-service';

export const maxDuration = 60;

export const POST = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
	const requestHeaders = new Headers(request.headers);
	const secret = requestHeaders.get('x-batch-job-key');
	const sourceId = (await params).id;

	if (secret !== process.env.BATCH_JOB_SECRET) {
		return Response.json({ message: 'Invalid secret' }, { status: 401 });
	}

	after(async () => reloadSource(sourceId));

	return Response.json({ message: `Reloading posts for source ${sourceId}` }, { status: 202 });
};
