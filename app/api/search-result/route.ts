import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PutObjectCommand, PutObjectRequest } from '@aws-sdk/client-s3';
import { getS3Client } from '@/services/s3Client';
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
	const formData = await request.formData();
	const resultToSave = JSON.parse(formData.get('result') as string);
	if (request.auth?.user.id) {
		resultToSave.userId = request.auth.user.id;
	}
	const screenshot = (formData.get('capture') as Blob) || null;
	if (screenshot) {
		const s3Client = getS3Client();
		const imageKey = `${resultToSave.name.replace(/\s/g, '_')}_${Date.now()}.png`;
		const params: PutObjectRequest = {
			Body: screenshot,
			Key: imageKey,
			Bucket: process.env.AWS_S3_SCREENSHOT_BUCKET,
			ACL: 'public-read',
		};
		const commmand = new PutObjectCommand(params);
		await s3Client.send(commmand);
		resultToSave.imagePath = `http://s3-${process.env.AWS_S3_REGION}.amazonaws.com/${process.env.AWS_S3_SCREENSHOT_BUCKET}/${imageKey}`;
	}
	return NextResponse.json(await saveSearchResult(resultToSave));
});
