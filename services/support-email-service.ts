import type { FeedbackMessage, FeedbackSentResponse } from '@/types';

const headers = {
	Authorization:
		'Basic ' +
		Buffer.from(
			`${process.env.MAILGUN_USERNAME}:${process.env.MAILGUN_API_KEY}`,
			'binary'
		).toString('base64'),
	'Content-Type': 'application/x-www-form-urlencoded',
};

const SUPPORT_ADDRESS = 'support@mediabubbles.net';
const TO_ADDRESS = 'mark.monday0504@gmail.com';

export const sendSupportEmail = async (
	feedbackData: FeedbackMessage
): Promise<FeedbackSentResponse> => {
	const params = new URLSearchParams({
		from: SUPPORT_ADDRESS,
		to: TO_ADDRESS,
		subject: `Media Bubbles ${feedbackData.reason}`,
		text: `
${feedbackData.message}

${feedbackData.name}
${feedbackData.email}
	`,
	});

	const requestOptions: Record<string, unknown> = {
		method: 'POST',
		body: params,
		headers,
	};

	if (!process.env.MAILGUN_API_URL) {
		return { feedbackSent: false };
	}

	const response = await fetch(process.env.MAILGUN_API_URL, requestOptions);
	return { feedbackSent: response.ok };
};
