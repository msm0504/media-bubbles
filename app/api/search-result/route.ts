import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { getSavedResults, saveSearchResult } from '@/services/saved-results-service';
import { takeScreenshot } from '@/services/screenshot-service';

const SEARCH_RESULT_ELEM_SELECTOR = '#search-results';
const SCREENSHOT_HEIGHT = 630;

export const GET = async (request: Request) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session?.user.id) {
		return Response.json({ savedResults: [], pageCount: 0 });
	} else {
		const { searchParams } = new URL(request.url);
		return Response.json(
			await getSavedResults(
				searchParams.get('filter') || '',
				+(searchParams.get('page') || 1),
				session.user.id
			)
		);
	}
};

export const POST = async (request: Request) => {
	const resultToSave = await request.json();
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (session?.user.id) {
		resultToSave.userId = session.user.id;
	}

	const savedResult = await saveSearchResult(resultToSave);

	if (savedResult.itemId) {
		const pageToCapture = `${process.env.NEXT_PUBLIC_URL}/headlines/${savedResult.itemId}`;
		const imageKey = resultToSave.name.replace(/\s/g, '_');
		takeScreenshot(pageToCapture, imageKey, SEARCH_RESULT_ELEM_SELECTOR, SCREENSHOT_HEIGHT);
	}

	return Response.json(savedResult);
};
