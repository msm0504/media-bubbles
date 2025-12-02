import { put } from '@vercel/blob';
import type { Browser, Page, ScreenshotOptions } from 'puppeteer-core';
import { setSavedResultImagePath } from './saved-results-service';

const REMOTE_CHROMIUM_URL =
	'https://github.com/Sparticuz/chromium/releases/download/v141.0.0/chromium-v141.0.0-pack.x64.tar';
const VIEWPORT_WIDTH = 1200;
const VIEWPORT_HEIGHT = 1200;
const SCREENSHOT_STORAGE_FOLDER = 'screenshots';

const getBrowserInstance = async (): Promise<Browser> => {
	if (process.env.NODE_ENV === 'production') {
		const puppeteerCore = await import('puppeteer-core');
		const chromium = (await import('@sparticuz/chromium-min')).default;
		return puppeteerCore.launch({
			args: chromium.args,
			executablePath: await chromium.executablePath(REMOTE_CHROMIUM_URL),
			headless: true,
			defaultViewport: {
				width: VIEWPORT_WIDTH,
				height: VIEWPORT_HEIGHT,
			},
		});
	} else {
		const puppeteer = await import('puppeteer');
		return puppeteer.launch({
			headless: true,
			defaultViewport: {
				width: VIEWPORT_WIDTH,
				height: VIEWPORT_HEIGHT,
			},
		});
	}
};

const getImageBufferFromPage = async (
	page: Page,
	pageToCapture: string,
	selector?: string,
	screenshotHeight?: number
): Promise<Uint8Array> => {
	await page.goto(pageToCapture, { waitUntil: 'networkidle0' });
	const params: ScreenshotOptions = {};

	if (selector) {
		await page.waitForSelector(selector);
		const results = await page.$(selector);
		if (!results) {
			throw new Error('Element not found on page');
		}
		const boundingBox = await results.boundingBox();
		if (!boundingBox) {
			throw new Error('Element not part of layout');
		}
		params.clip = {
			x: boundingBox.x || 0,
			y: boundingBox.y || 0,
			width: Math.min(boundingBox.width, VIEWPORT_WIDTH),
			height: Math.min(boundingBox.height, screenshotHeight || VIEWPORT_HEIGHT),
		};
	} else {
		params.clip = {
			x: 0,
			y: 0,
			width: VIEWPORT_WIDTH,
			height: screenshotHeight || VIEWPORT_HEIGHT,
		};
	}

	return page.screenshot(params);
};

export const takeScreenshot = async (
	pageToCapture: string,
	imageKey: string,
	selector?: string,
	screenshotHeight?: number
) => {
	let browser: Browser | null = null;
	let page: Page | null = null;
	try {
		browser = await getBrowserInstance();
		page = await browser.newPage();
		const imageBuffer = await getImageBufferFromPage(
			page,
			pageToCapture,
			selector,
			screenshotHeight
		);
		if (imageBuffer) {
			const metaData = await put(
				`${SCREENSHOT_STORAGE_FOLDER}/${imageKey}_${Date.now()}.png`,
				Buffer.from(imageBuffer),
				{ access: 'public' }
			);
			setSavedResultImagePath(
				pageToCapture.substring(pageToCapture.lastIndexOf('/') + 1),
				metaData.url
			);
		}
	} catch (error) {
		console.log(error);
	} finally {
		if (page !== null) await page.close();
		if (browser !== null) await browser.close();
	}
};
