import { sendSupportEmail } from '@/services/support-email-service';

export const POST = async (request: Request) => {
	const feedback = await request.json();
	return Response.json(await sendSupportEmail(feedback));
};
