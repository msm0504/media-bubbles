import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import Column from './column';
import { SOURCE_SLANT_MAP, SourceSlant } from '../../constants/source-slant';
import useLocalStorage from '../../hooks/use-local-storage';
import { keys } from '../../util/typed-keys';
import { ArticleMap, Source } from '../../../types';
const ShareButtons = dynamic(() => import('../save-results/share-buttons'), { ssr: false });

type SearchResultsProps = {
	sourceList: Source[];
	isSearchAll: boolean;
	articleMap: ArticleMap;
	savedResultId?: string;
};

const SLANT_SOURCE_COLUMNS: Source[] = keys(SOURCE_SLANT_MAP).map((sourceSlant: SourceSlant) => ({
	id: '' + sourceSlant,
	name: SOURCE_SLANT_MAP[sourceSlant],
	url: ''
}));

const SearchResults: React.FC<SearchResultsProps> = ({
	sourceList,
	isSearchAll,
	articleMap,
	savedResultId
}) => {
	const [openPanels, setOpenPanels] = useLocalStorage<{ id: string; list: string[] }>(
		'openPanels',
		{ id: 'none', list: [] },
		'json'
	);
	const router = useRouter();
	const { resultId } = router.query;

	useEffect(() => {
		const id = resultId?.toString() || 'none';
		if (id !== openPanels.id) {
			setOpenPanels({ id, list: [] });
		}
	}, [resultId]);

	if (resultId && resultId !== savedResultId) return null;

	const togglePanel = (columnId: string) => {
		if (openPanels.list.indexOf(columnId) === -1) {
			setOpenPanels({ ...openPanels, list: [...openPanels.list, columnId] });
		} else {
			const newOpenPanels = [...openPanels.list];
			newOpenPanels.splice(openPanels.list.indexOf(columnId), 1);
			setOpenPanels({ ...openPanels, list: newOpenPanels });
		}
	};

	const isPanelInOpenList = (columnId: string) => {
		return openPanels.list.indexOf(columnId) !== -1;
	};

	const generateColumns = () => {
		const columns = isSearchAll ? SLANT_SOURCE_COLUMNS : sourceList;

		return columns.map(column => (
			<Column
				key={`${column.id}Column`}
				column={column}
				articles={articleMap[column.id]}
				isSearchAll={isSearchAll}
				togglePanel={togglePanel}
				isPanelInOpenList={isPanelInOpenList(column.id)}
			/>
		));
	};

	const displayShareButtons = () => {
		const currentUrl = `${process.env.NEXT_PUBLIC_API_URL}${router.asPath}`;
		const urlToShare = resultId
			? currentUrl
			: savedResultId
			? `${currentUrl}/${savedResultId}`
			: '';
		return <ShareButtons urlToShare={urlToShare} />;
	};

	return (
		<>
			{displayShareButtons()}
			<div className='d-flex flex-column flex-xl-row align-items-stretch align-items-xl-start justify-content-xl-around'>
				{generateColumns()}
			</div>
		</>
	);
};

export default SearchResults;
