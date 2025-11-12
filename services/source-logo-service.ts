import type { Readable } from 'stream';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getS3Client } from './aws-clients';
import { MILLISECONDS_IN_DAY } from '../constants/server';
import formatGetQuery from '@/util/format-get-query';

const MILLISECONDS_IN_MONTH = MILLISECONDS_IN_DAY * 30;
// empty png files getting added to s3 with size ~20 B
const MIN_IMAGE_BYTES = 50;
const s3Client = getS3Client();

const streamToBuffer = async (stream: Readable) => Buffer.concat(await stream.toArray());

const getLogoUrl = (siteUrl: string): string => {
	const iconApiUrl = 'https://img.logo.dev';
	const params = {
		token: process.env.LOGO_DEV_KEY,
		size: 100,
		format: 'png',
	};
	return `${iconApiUrl}/${siteUrl}${formatGetQuery(params)}`;
};

export const getSourceLogo = async (id: string, url: string): Promise<Buffer | null> => {
	const s3Key = id.toLowerCase().replaceAll(/[^A-Za-z0-9]/g, '');
	const getCommand = new GetObjectCommand({
		Bucket: process.env.AWS_S3_LOGO_BUCKET,
		Key: `${s3Key}.png`,
	});
	try {
		const cached = await s3Client.send(getCommand);
		if (
			cached.Body &&
			(cached.ContentLength ?? 0) > MIN_IMAGE_BYTES &&
			(!cached.ExpiresString || Date.now() < new Date(cached.ExpiresString).getTime())
		) {
			return streamToBuffer(cached.Body as Readable);
		}
	} catch (error) {
		null;
	}

	const logoResponse = await fetch(getLogoUrl(url), {
		method: 'get',
		headers: { Accept: 'image/png, image/jpg' },
	});
	const image = Buffer.from(await logoResponse.arrayBuffer());

	if (!image || image.length < MIN_IMAGE_BYTES) return null;
	const putCommand = new PutObjectCommand({
		Bucket: process.env.AWS_S3_LOGO_BUCKET,
		Key: `${s3Key}.png`,
		Body: image,
		Expires: new Date(Date.now() + MILLISECONDS_IN_MONTH),
	});
	await s3Client.send(putCommand);

	return image;
};
