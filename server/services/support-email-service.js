const nodemailer = require('nodemailer');

const SUPPORT_ADDRESS = 'support@mediabubbles.net';

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_SERVER,
	port: Number(process.env.SMTP_PORT),
	auth: {
		user: process.env.EMAIL_USERNAME,
		pass: process.env.EMAIL_PASSWORD
	}
});

async function sendSupportEmail(feedbackData) {
	try {
		await transporter.sendMail({
			from: SUPPORT_ADDRESS,
			to: SUPPORT_ADDRESS,
			cc: feedbackData.email,
			subject: `Media Bubbles ${feedbackData.reason}`,
			text: `
${feedbackData.message}

${feedbackData.name}
${feedbackData.email}
      `
		});
		return { feedbackSent: true };
	} catch (error) {
		return { feedbackSent: false };
	}
}

module.exports = {
	sendSupportEmail
};
