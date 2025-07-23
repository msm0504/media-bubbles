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
const LOGIN_ADDRESS = 'login@mediabubbles.net';

export const sendSupportEmail = async (
	feedbackData: FeedbackMessage
): Promise<FeedbackSentResponse> => {
	const params = new URLSearchParams({
		from: SUPPORT_ADDRESS,
		to: SUPPORT_ADDRESS,
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

const getLoginEmailHtml = (token: string, expires: Date) =>
	`
	<body style="background: #eeeeee; font-family: Helvetica, Arial, sans-serif; color: #212121">
		<table
			width="100%"
			cellspacing="20"
			cellpadding="0"
			style="
				background: #fafafa;
				max-width: 600px;
				margin: auto;
				border: 0px;
				border-radius: 10px;
				text-align: center;
			"
		>
			<tr>
				<td style="padding: 10px 0px; font-size: 22px">
					Log in token for <strong>Media Bubbles</strong>:
				</td>
			</tr>
			<tr>
				<td style="padding: 20px 0; font-size: 28px; color: #a800e6">${token}</td>
			</tr>
			<tr>
				<td style="padding: 0px 0px 10px 0px; font-size: 16px">
					This token will expire at ${expires.toUTCString()}.
				</td>
			</tr>
			<tr>
				<td style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px">
					If you did not request this email you can safely ignore it.
				</td>
			</tr>
		</table>
	</body>
`;

const getLoginEmailText = (token: string, expires: Date) => `
Log in Token: ${token}
Token expires at ${expires.toUTCString()}
		`;

export const sendLoginEmail = async (
	toAddress: string,
	token: string,
	expires: Date
): Promise<void> => {
	const params = new URLSearchParams({
		from: LOGIN_ADDRESS,
		to: toAddress,
		subject: 'Log in Token for Media Bubbles',
		text: getLoginEmailText(token, expires),
		html: getLoginEmailHtml(token, expires),
	});

	const requestOptions: Record<string, unknown> = {
		method: 'POST',
		body: params,
		headers,
	};

	if (!process.env.MAILGUN_API_URL) {
		throw new Error('Log in token cannot be sent.');
	}

	const response = await fetch(process.env.MAILGUN_API_URL, requestOptions);
	if (!response.ok) throw new Error('Failed to sent log in token: ' + (await response.text()));
};
