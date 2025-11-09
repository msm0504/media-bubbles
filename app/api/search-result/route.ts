import { headers } from 'next/headers';
import { InvokeCommand, type InvokeCommandInput, LogType } from '@aws-sdk/client-lambda';
import { auth } from '@/lib/auth';
import { getLambdaClient } from '@/services/aws-clients';
import { getSavedResults, saveSearchResult } from '@/services/saved-results-service';

export const GET = async (request: Request) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session?.user.id) {
		return Response.json({ savedResults: [], pageCount: 0 });
	} else {
		const { searchParams } = new URL(request.url);
		return Response.json(
			await getSavedResults(
				searchParams.get('filter') || '',
				+(searchParams.get('page') || 1),
				session.user.id
			)
		);
	}
};

export const POST = async (request: Request) => {
	const resultToSave = await request.json();
	let imageKey = '';
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (session?.user.id) {
		resultToSave.userId = session.user.id;
	}
	if (process.env.AWS_SCREENSHOT_FUNCTION) {
		imageKey = `${resultToSave.name.replace(/\s/g, '_')}_${Date.now()}.png`;
		resultToSave.imagePath = `https://${process.env.AWS_S3_SCREENSHOT_BUCKET}.s3.${process.env.AWS_MB_REGION}.amazonaws.com/${imageKey}`;
	}

	const savedResult = await saveSearchResult(resultToSave);

	if (savedResult.itemId && imageKey) {
		const lambdaClient = getLambdaClient();
		const params: InvokeCommandInput = {
			FunctionName: process.env.AWS_SCREENSHOT_FUNCTION,
			Payload: JSON.stringify({
				pageToCapture: `${process.env.NEXT_PUBLIC_URL}/headlines/${savedResult.itemId}`,
				imageKey,
			}),
			LogType: LogType.Tail,
		};
		const commmand = new InvokeCommand(params);
		lambdaClient.send(commmand);
	}

	return Response.json(savedResult);
};
