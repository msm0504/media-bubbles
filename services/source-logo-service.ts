import { head, put } from '@vercel/blob';
import { getSourceLists } from './source-list-service';
import formatGetQuery from '@/util/format-get-query';

const LOGO_STORAGE_FOLDER = 'logos';
// empty png files getting added to store with size ~20 B
const MIN_IMAGE_BYTES = 50;

const getLogoUrl = async (sourceId: string): Promise<string> => {
	const { appSourceList } = await getSourceLists();
	const source = appSourceList.find(source => source.id === sourceId);
	if (!source) {
		throw new Error(`${sourceId} does not match any known sources`);
	}
	const iconApiUrl = 'https://img.logo.dev';
	const params = {
		token: process.env.LOGO_DEV_KEY,
		size: 100,
		format: 'png',
	};
	return `${iconApiUrl}/${source.url}${formatGetQuery(params)}`;
};

export const getSourceLogo = async (id: string): Promise<Buffer | null> => {
	const fileName = id.toLowerCase().replaceAll(/[^A-Za-z0-9]/g, '');
	const filePath = `${LOGO_STORAGE_FOLDER}/${fileName}.png`;
	let storedLogoUrl = '';
	try {
		const metaData = await head(filePath);
		if (metaData && metaData.url) {
			storedLogoUrl = metaData.url;
		}
	} catch (error) {
		null;
	}

	const logoResponse = await fetch(storedLogoUrl || (await getLogoUrl(id)), {
		method: 'get',
		headers: { Accept: 'image/png, image/jpg' },
	});
	const image = Buffer.from(await logoResponse.arrayBuffer());
	if (!image || image.length < MIN_IMAGE_BYTES) return null;

	if (!storedLogoUrl) {
		await put(filePath, image, { access: 'public', allowOverwrite: true });
	}
	return image;
};
