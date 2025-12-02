// import { headers } from 'next/headers';
// import { auth } from '@/lib/auth';
// import { isAdmin } from '@/constants/admin-role';
import { getSavedResult } from '@/services/saved-results-service';
import { takeScreenshot } from '@/services/screenshot-service';

const SEARCH_RESULT_ELEM_SELECTOR = '#search-results';
const SCREENSHOT_HEIGHT = 630;

export const maxDuration = 30;

export const PUT = async (_request: Request, { params }: { params: Promise<{ id: string }> }) => {
	/*
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session?.user) {
		return Response.json({}, { status: 401 });
	}
	if (!isAdmin(session?.user.role)) {
		return Response.json({}, { status: 403 });
	}
	*/
	const resultId = (await params).id;
	const savedResult = await getSavedResult(resultId);
	if (!savedResult) {
		return Response.json({}, { status: 400 });
	}
	const pageToCapture = `${process.env.NEXT_PUBLIC_URL}/headlines/${resultId}`;
	const imageKey = savedResult.name.replace(/\s/g, '_');
	await takeScreenshot(pageToCapture, imageKey, SEARCH_RESULT_ELEM_SELECTOR, SCREENSHOT_HEIGHT);
	return Response.json({});
};
