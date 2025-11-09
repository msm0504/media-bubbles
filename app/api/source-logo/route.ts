import { getSourceLogo } from '@/services/source-logo-service';

export const GET = async (request: Request) => {
	const { searchParams } = new URL(request.url);
	const image = await getSourceLogo(searchParams.get('id') || '', searchParams.get('url') || '');
	if (!image) {
		return new Response(`No logo found for ${searchParams.get('id')}`, { status: 400 });
	} else {
		return new Response(new Uint8Array(image), { headers: { 'content-type': 'image/png' } });
	}
};
