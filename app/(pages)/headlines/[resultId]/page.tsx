import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { SavedResult } from '@/types';
import { getAllSavedResults, getSavedResult } from '@/services/saved-results-service';
import SearchResults from '@/components/search-results/search-results';
import PageHeading from '@/components/shared/page-heading';

type PageParams = Promise<{
	resultId: string;
}>;

const formatDescription = ({ createdAt = '0', sourceList = [] }: SavedResult) =>
	`Result saved at: ${new Date(createdAt).toLocaleString()}
${sourceList.length ? `Sources: ${sourceList.map(source => source.name).join(', ')}` : ''}`;

export const generateMetadata = async ({ params }: { params: PageParams }): Promise<Metadata> => {
	const loadedResult = await getSavedResult((await params).resultId);
	if (!loadedResult || !Object.keys(loadedResult).length) {
		return notFound();
	}
	const title = `Saved Result from ${new Date(loadedResult?.createdAt || '0').toLocaleString()} - Media Bubbles`;
	const description = formatDescription(loadedResult);
	return {
		title,
		description,
		alternates: {
			canonical: `${process.env.NEXT_PUBLIC_URL}/headlines/${(await params).resultId}`,
		},
		openGraph: {
			title,
			description,
			url: `${process.env.NEXT_PUBLIC_URL}/headlines/${(await params).resultId}`,
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
	const { items: savedResults } = await getAllSavedResults();
	return savedResults.map(({ _id }) => ({ resultId: _id }));
};

const getSearchResult = async (params: PageParams): Promise<SavedResult> => {
	const loadedResult = await getSavedResult((await params).resultId);
	if (!loadedResult || !Object.keys(loadedResult).length) {
		return notFound();
	}
	return loadedResult;
};

const SavedSearchResult = async ({ params }: { params: PageParams }) => {
	const loadedResult = await getSearchResult(params);
	return (
		<>
			<PageHeading heading={`Saved Result: ${loadedResult.name}`} />
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
