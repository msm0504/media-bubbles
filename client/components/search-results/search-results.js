import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import Column from './column';
import { SOURCE_SLANT } from '../../constants/source-slant';
import useLocalStorage from '../../hooks/use-local-storage';
const ShareButtons = dynamic(() => import('../save-results/share-buttons'), { ssr: false });

const SearchResults = ({ sourceList, isSearchAll, articleMap, savedResultId }) => {
	const [openPanels, setOpenPanels] = useLocalStorage(
		'openPanels',
		{ id: 'none', list: [] },
		'json'
	);
	const router = useRouter();
	const { resultId } = router.query;

	useEffect(() => {
		const id = resultId || 'none';
		if (id !== openPanels.id) {
			setOpenPanels({ id, list: [] });
		}
	}, [resultId]);

	if (resultId && resultId !== savedResultId) return null;

	const togglePanel = columnId => {
		if (openPanels.list.indexOf(columnId) === -1) {
			setOpenPanels({ ...openPanels, list: [...openPanels.list, columnId] });
		} else {
			const newOpenPanels = [...openPanels.list];
			newOpenPanels.splice(openPanels.list.indexOf(columnId), 1);
			setOpenPanels({ ...openPanels, list: newOpenPanels });
		}
	};

	const isPanelInOpenList = columnId => {
		return openPanels.list.indexOf(columnId) !== -1;
	};

	const generateColumns = () => {
		const columns = isSearchAll ? SOURCE_SLANT : sourceList;

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
			<div className='d-flex flex-column flex-xl-row align-iteml-stretch align-iteml-xl-start justify-content-xl-around'>
				{generateColumns()}
			</div>
		</>
	);
};

export default SearchResults;
