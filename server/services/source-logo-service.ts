import { GetObjectCommand, GetObjectCommandOutput, PutObjectCommand } from '@aws-sdk/client-s3';
import { getS3Client } from './s3Client';
import { MILLISECONDS_IN_DAY } from '../constants';

const MILLISECONDS_IN_MONTH = MILLISECONDS_IN_DAY * 30;
const s3Client = getS3Client();

const getLogoUrl = (siteUrl: string): string => {
	const iconApiUrl = 'https://logo.clearbit.com';
	siteUrl = siteUrl.replace('huffingtonpost', 'huffpost');
	return `${iconApiUrl}/${siteUrl}`;
};

export async function getSourceLogo(
	id: string,
	url: string,
	logoUrl = ''
): Promise<Buffer | GetObjectCommandOutput['Body'] | null> {
	const getCommand = new GetObjectCommand({
		Bucket: process.env.AWS_S3_LOGO_BUCKET,
		Key: `${id}.png`
	});
	try {
		const cached = await s3Client.send(getCommand);
		if (cached.Body && (!cached.Expires || Date.now() < cached.Expires.valueOf())) {
			return cached.Body;
		}
	} catch (error) {
		if (error.message !== 'NoSuchKey') {
			console.log(error);
		}
	}

	const logoResponse = await fetch(logoUrl || getLogoUrl(url), {
		method: 'get',
		headers: { Accept: 'image/png, image/jpg' }
	});
	const image = Buffer.from(await logoResponse.arrayBuffer());

	if (!image) return null;
	const putCommand = new PutObjectCommand({
		Bucket: process.env.AWS_S3_LOGO_BUCKET,
		Key: `${id}.png`,
		Body: image,
		ACL: 'public-read',
		Expires: new Date(Date.now() + MILLISECONDS_IN_MONTH)
	});
	await s3Client.send(putCommand);

	return image;
}
