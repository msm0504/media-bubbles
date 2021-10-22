import chromium from 'chrome-aws-lambda';
import { resolve as resolvePath } from 'path';
import { Browser, Page } from 'puppeteer-core';
import { SavedResult } from '../../types';

const IMAGES_DIR = 'images/saved-results';

async function getHeadlessBrowser(): Promise<Browser> {
	// running locally
	if (!process.env.VERCEL) {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const puppeteer = require('puppeteer');
		return puppeteer.launch({
			args: chromium.args,
			defaultViewport: chromium.defaultViewport,
			headless: chromium.headless,
			ignoreHTTPSErrors: true
		});
	}

	return chromium.puppeteer.launch({
		args: chromium.args,
		defaultViewport: chromium.defaultViewport,
		executablePath: await chromium.executablePath,
		headless: chromium.headless,
		ignoreHTTPSErrors: true
	});
}

export async function takeResultScreenshot(
	savedResultId: string,
	result: SavedResult
): Promise<string> {
	const pageToCapture = `${process.env.NEXT_PUBLIC_URL}/headlines/${savedResultId}`;
	let imagePath = `${IMAGES_DIR}/${result.name.replace(/\s/g, '_')}_${Date.now()}.png`;
	let browser: Browser | null = null;
	let page: Page | null = null;
	try {
		browser = await getHeadlessBrowser();
		page = await browser.newPage();
		await page.goto(pageToCapture);
		await page.screenshot({ path: resolvePath('./public', imagePath) });
	} catch (error) {
		imagePath = '';
	} finally {
		if (page !== null) await page.close();
		if (browser !== null) await browser.close();
	}
	return imagePath;
}
