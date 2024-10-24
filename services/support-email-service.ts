import FormData from 'form-data';
import type { FeedbackMessage, FeedbackSentResponse } from '@/types';

const headers = {
	Authorization:
		'Basic ' +
		Buffer.from(
			`${process.env.MAILGUN_USERNAME}:${process.env.MAILGUN_API_KEY}`,
			'binary'
		).toString('base64'),
};

const SUPPORT_ADDRESS = 'support@mediabubbles.net';
const TO_ADDRESS = 'mark.monday0504@gmail.com';

export async function sendSupportEmail(
	feedbackData: FeedbackMessage
): Promise<FeedbackSentResponse> {
	const formdata = new FormData();
	formdata.append('from', SUPPORT_ADDRESS);
	formdata.append('to', TO_ADDRESS);
	formdata.append('subject', `Media Bubbles ${feedbackData.reason}`);
	formdata.append(
		'text',
		`
${feedbackData.message}

${feedbackData.name}
${feedbackData.email}
	`
	);

	const requestOptions: Record<string, unknown> = {
		method: 'POST',
		body: formdata,
		headers,
	};

	if (!process.env.MAILGUN_API_URL) {
		return { feedbackSent: false };
	}

	const response = await fetch(process.env.MAILGUN_API_URL, requestOptions);
	return { feedbackSent: response.ok };
}
