'use client';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { Stack } from '@mui/material';
import Column from './column';
import { SOURCE_SLANT_MAP, SourceSlant } from '@/constants/source-slant';
import useLocalStorage from '@/hooks/use-local-storage';
import { keys } from '@/util/typed-keys';
import type { ArticleMap, Source } from '@/types';
const ShareButtons = dynamic(() => import('../save-results/share-buttons'), { ssr: false });

type SearchResultsProps = {
	sourceList: Source[];
	isSearchAll: boolean;
	articleMap: ArticleMap;
	savedResultId?: string;
	resultId?: string;
};

const SLANT_SOURCE_COLUMNS: Source[] = keys(SOURCE_SLANT_MAP).map((sourceSlant: SourceSlant) => ({
	id: '' + sourceSlant,
	name: SOURCE_SLANT_MAP[sourceSlant],
	url: '',
	slant: sourceSlant,
}));

const SearchResults: React.FC<SearchResultsProps> = ({
	sourceList,
	isSearchAll,
	articleMap,
	savedResultId,
	resultId,
}) => {
	const [openPanels, setOpenPanels] = useLocalStorage<{ id: string; list: string[] }>(
		'openPanels',
		{ id: 'none', list: [] },
		'json'
	);
	const pathname = usePathname();

	useEffect(() => {
		const id = resultId || 'none';
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
		const currentUrl = `${process.env.NEXT_PUBLIC_URL}${pathname}`;
		const urlToShare = resultId
			? currentUrl
			: savedResultId
				? `${currentUrl}/${savedResultId}`
				: '';
		return <ShareButtons urlToShare={urlToShare} />;
	};

	return (
		<Stack spacing={4}>
			{displayShareButtons()}
			<Stack
				id='search-results'
				spacing={4}
				direction={{ xs: 'column', xl: 'row' }}
				justifyContent={{ xl: 'space-around' }}
				alignItems={{ xs: 'stretch', xl: 'start' }}
			>
				{generateColumns()}
			</Stack>
		</Stack>
	);
};

export default SearchResults;
