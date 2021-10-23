import chromium from 'chrome-aws-lambda';
import { Browser, Page } from 'puppeteer-core';
import { S3Client, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { SavedResult } from '../../types';

global.processingShots = global.processingShots || {};

const exePath =
	process.platform === 'win32'
		? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
		: process.platform === 'linux'
		? '/usr/bin/google-chrome'
		: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function getBrowserInstance(): Promise<Browser> {
	if (!process.env.VERCEL) {
		const puppeteer = await import('puppeteer');
		return (puppeteer.launch({
			args: [],
			executablePath: exePath,
			headless: true,
			defaultViewport: {
				width: 1280,
				height: 720
			},
			ignoreHTTPSErrors: true
		}) as unknown) as Promise<Browser>;
	}
	return chromium.puppeteer.launch({
		args: chromium.args,
		executablePath: await chromium.executablePath,
		headless: true,
		defaultViewport: {
			width: 1280,
			height: 720
		},
		ignoreHTTPSErrors: true
	});
}

async function getImageBufferFromPage(browser: Browser, page: Page, pageToCapture: string) {
	await page.goto(pageToCapture);
	await page.waitForSelector('#search-results');
	const results = await page.$('#search-results');
	const boundingBox = await results?.boundingBox();
	return (results || page).screenshot({
		clip: {
			x: boundingBox?.x ?? 0,
			y: boundingBox?.y ?? 0,
			width: boundingBox?.width || 1280,
			height: 600
		}
	});
}

async function sendImagetoAws(imageKey: string, imageBuffer: Buffer) {
	if (!imageKey || !imageBuffer) return;

	const client = new S3Client({
		credentials: {
			accessKeyId: process.env.AWS_S3_KEY || '',
			secretAccessKey: process.env.AWS_S3_SECRET || ''
		},
		region: process.env.AWS_S3_REGION
	});
	const params: PutObjectCommandInput = {
		Body: imageBuffer,
		Key: imageKey,
		Bucket: process.env.AWS_S3_BUCKET,
		ACL: 'public-read'
	};
	const commmand = new PutObjectCommand(params);
	await client.send(commmand);

	return;
}

export async function takeResultScreenshot(
	savedResultId: string,
	result: SavedResult
): Promise<string> {
	if (global.processingShots[savedResultId]) {
		return new Promise(resolve => resolve(''));
	}
	global.processingShots[savedResultId] = true;

	const pageToCapture = `${process.env.NEXT_PUBLIC_URL}/headlines/${savedResultId}`;
	const imageKey = `${result.name.replace(/\s/g, '_')}_${Date.now()}.png`;
	let imageUrl = '';
	let browser: Browser | null = null;
	let page: Page | null = null;
	try {
		browser = await getBrowserInstance();
		page = await browser.newPage();
		const imageBuffer = await getImageBufferFromPage(browser, page, pageToCapture);
		await sendImagetoAws(imageKey, imageBuffer as Buffer);
		imageUrl = `http://s3-${process.env.AWS_S3_REGION}.amazonaws.com/${process.env.AWS_S3_BUCKET}/${imageKey}`;
	} catch (error) {
		console.log(error);
	} finally {
		if (page !== null) await page.close();
		if (browser !== null) await browser.close();
	}

	delete global.processingShots[savedResultId];
	return imageUrl;
}
