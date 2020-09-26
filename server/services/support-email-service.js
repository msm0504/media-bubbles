const nodemailer = require('nodemailer');

const SUPPORT_ADDRESS = 'support@mediabubbles.net';

const transporter = nodemailer.createTransport({
	sendmail: true,
	newline: 'unix',
	path: '/usr/sbin/sendmail'
});

async function sendSupportEmail(feedbackData) {
	try {
		await transporter.sendMail({
			from: SUPPORT_ADDRESS,
			to: SUPPORT_ADDRESS,
			subject: `Media Bubbles ${feedbackData.reason}`,
			text: `
${feedbackData.message}

${feedbackData.name}
${feedbackData.email}
      `
		});
		return true;
	} catch (error) {
		return false;
	}
}

module.exports = {
	sendSupportEmail
};
