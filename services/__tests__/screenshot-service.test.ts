import { afterEach, describe, expect, test, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ put: vi.fn(), setSavedResultImagePath: vi.fn() }));
vi.mock('@vercel/blob', () => ({ put: mocks.put }));
vi.mock('../saved-results-service', () => ({
	setSavedResultImagePath: mocks.setSavedResultImagePath,
}));

const page = {
	goto: vi.fn(),
	waitForSelector: vi.fn(),
	$: vi.fn(),
	screenshot: vi.fn(),
	close: vi.fn(),
};
const browser = { newPage: vi.fn().mockResolvedValue(page), close: vi.fn() };
vi.mock('puppeteer', () => ({ launch: vi.fn().mockResolvedValue(browser) }));

import { takeScreenshot } from '../screenshot-service';

afterEach(() => {
	vi.clearAllMocks();
	vi.restoreAllMocks();
});

describe('takeScreenshot', () => {
	test('captures a page, uploads it, updates the saved result, and closes resources', async () => {
		page.goto.mockResolvedValue(undefined);
		page.screenshot.mockResolvedValue(new Uint8Array([1, 2, 3]));
		mocks.put.mockResolvedValue({ url: 'https://blob.test/screenshot.png' });

		await takeScreenshot('https://app.test/results/result-id', 'result');

		expect(page.goto).toHaveBeenCalledWith('https://app.test/results/result-id', {
			waitUntil: 'networkidle0',
		});
		expect(page.screenshot).toHaveBeenCalledWith({
			clip: { x: 0, y: 0, width: 1200, height: 1200 },
		});
		expect(mocks.put).toHaveBeenCalledWith(
			expect.stringMatching(/^screenshots\/result_\d+\.png$/),
			expect.any(Buffer),
			{ access: 'public' }
		);
		expect(mocks.setSavedResultImagePath).toHaveBeenCalledWith(
			'result-id',
			'https://blob.test/screenshot.png'
		);
		expect(page.close).toHaveBeenCalled();
		expect(browser.close).toHaveBeenCalled();
	});

	test('swallows capture errors and still closes the browser', async () => {
		page.goto.mockRejectedValue(new Error('unavailable'));
		vi.spyOn(console, 'log').mockImplementation(() => undefined);

		await expect(takeScreenshot('https://app.test/results/id', 'result')).resolves.toBeUndefined();
		expect(page.close).toHaveBeenCalled();
		expect(browser.close).toHaveBeenCalled();
	});
});
