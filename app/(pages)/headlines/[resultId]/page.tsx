import type { Metadata } from 'next';
import { cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { Typography } from '@mui/material';
import type { SavedResult } from '@/types';
import { getAllSavedResults, getSavedResult } from '@/services/saved-results-service';
import SearchResults from '@/components/search-results/search-results';

type PageParams = {
	resultId: string;
};

const formatDescription = ({ createdAt = '0', sourceList = [] }: SavedResult) =>
	`Result saved at: ${new Date(createdAt).toLocaleString()}
${sourceList.length ? `Sources: ${sourceList.map(source => source.name).join(', ')}` : ''}`;

const getCachedResult = async (resultId: string) => {
	'use cache';
	cacheTag('saved-result');
	const result = await getSavedResult(resultId);
	return result;
};

export const generateMetadata = async ({ params }: { params: PageParams }): Promise<Metadata> => {
	const loadedResult = await getCachedResult(params.resultId);
	if (!loadedResult || !Object.keys(loadedResult).length) {
		return notFound();
	}
	const title = `Saved Result from ${new Date(loadedResult?.createdAt || '0').toLocaleString()} - Media Bubbles`;
	const description = formatDescription(loadedResult);
	return {
		title,
		description,
		alternates: {
			canonical: `${process.env.NEXT_PUBLIC_URL}/headlines/${params.resultId}`,
		},
		openGraph: {
			title,
			description,
			url: `${process.env.NEXT_PUBLIC_URL}/headlines/${params.resultId}`,
			images: loadedResult.imagePath
				? {
						url: loadedResult.imagePath,
						width: 1200,
						height: 630,
					}
				: undefined,
		},
		twitter: loadedResult.imagePath
			? {
					images: {
						url: loadedResult.imagePath,
						width: 1200,
						height: 630,
					},
					card: 'summary_large_image',
				}
			: undefined,
	};
};

export const generateStaticParams = async () => {
	'use cache';
	cacheTag('all-saved-results');
	const { items: savedResults } = await getAllSavedResults();
	return savedResults.map(({ _id }) => ({ resultId: _id }));
};

const getSearchResult = async (params: PageParams): Promise<SavedResult> => {
	const loadedResult = await getCachedResult(params.resultId);
	if (!loadedResult || !Object.keys(loadedResult).length) {
		return notFound();
	}
	return loadedResult;
};

const SavedSearchResult = async ({ params }: { params: { resultId: string } }) => {
	const loadedResult = await getSearchResult(params);
	return (
		<>
			<Typography component='h2' variant='h3' color='info' marginBottom={2} fontWeight='bold'>
				{`Saved Result: ${loadedResult.name}`}
			</Typography>
			<SearchResults
				sourceList={loadedResult.sourceList}
				isSearchAll={loadedResult.isSearchAll}
				articleMap={loadedResult.articleMap}
				savedResultId={loadedResult._id}
			/>
		</>
	);
};

export default SavedSearchResult;
