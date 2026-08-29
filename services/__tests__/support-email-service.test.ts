import { afterEach, describe, expect, test, vi } from 'vitest';
import type { FeedbackMessage } from '@/types';

import { sendLoginEmail, sendSupportEmail } from '../support-email-service';

const feedback: FeedbackMessage = {
	name: 'Ada',
	email: 'ada@example.com',
	reason: 'Question',
	message: 'Hello',
};
afterEach(() => vi.restoreAllMocks());

describe('support email service', () => {
	test('does not call Mailgun when support email is not configured', async () => {
		const fetchMock = vi.spyOn(global, 'fetch');
		const original = process.env.MAILGUN_API_URL;
		delete process.env.MAILGUN_API_URL;
		await expect(sendSupportEmail(feedback)).resolves.toEqual({ feedbackSent: false });
		expect(fetchMock).not.toHaveBeenCalled();
		if (original) process.env.MAILGUN_API_URL = original;
	});

	test('sends support feedback and reports the HTTP result', async () => {
		process.env.MAILGUN_API_URL = 'https://mailgun.test/messages';
		const fetchMock = vi
			.spyOn(global, 'fetch')
			.mockResolvedValue(new Response(null, { status: 200 }));
		await expect(sendSupportEmail(feedback)).resolves.toEqual({ feedbackSent: true });
		const [, options] = fetchMock.mock.calls[0];
		expect(options).toMatchObject({
			method: 'POST',
			headers: expect.objectContaining({ 'Content-Type': 'application/x-www-form-urlencoded' }),
		});
		expect(String(options?.body)).toContain('Media+Bubbles+Question');
	});

	test('sends login email and throws when Mailgun rejects it', async () => {
		process.env.MAILGUN_API_URL = 'https://mailgun.test/messages';
		vi.spyOn(global, 'fetch').mockResolvedValueOnce(new Response(null, { status: 200 }));
		await expect(sendLoginEmail('ada@example.com', '123456', 10)).resolves.toBeUndefined();
		vi.spyOn(global, 'fetch').mockResolvedValueOnce(new Response('Nope', { status: 500 }));
		await expect(sendLoginEmail('ada@example.com', '123456', 10)).rejects.toThrow(
			'Failed to sent log in token'
		);
	});
});
