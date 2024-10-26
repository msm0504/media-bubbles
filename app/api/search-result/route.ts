import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { InvokeCommand, type InvokeCommandInput, LogType } from '@aws-sdk/client-lambda';
import { getLambdaClient } from '@/services/aws-clients';
import { getSavedResults, saveSearchResult } from '@/services/saved-results-service';

export const GET = auth(async request => {
	if (!request.auth?.user.id) {
		return NextResponse.json({ savedResults: [], pageCount: 0 });
	} else {
		const { searchParams } = request.nextUrl;
		return NextResponse.json(
			await getSavedResults(
				searchParams.get('filter') || '',
				+(searchParams.get('page') || 1),
				request.auth.user.id
			)
		);
	}
});

export const POST = auth(async request => {
	const resultToSave = await request.json();
	let imageKey = '';
	if (request.auth?.user.id) {
		resultToSave.userId = request.auth.user.id;
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

	return NextResponse.json(savedResult);
});
