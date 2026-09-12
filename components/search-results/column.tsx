import { Collapsible } from '@base-ui/react';
import ColumnArticles from './column-articles';
import ColumnHeadingIcon from './column-heading-icon';
import { Button, Paper } from '../shared/base-ui';
import type { Article, Source } from '@/types';
import useScreenSize, { XL_MIN_WIDTH } from '@/hooks/use-screen-size';
import getColorBySlant from '@/util/get-color-by-slant';

type ColumnProps = {
	column: Source;
	articles: Article[];
	isSearchAll: boolean;
	togglePanel: (columnId: string) => void;
	isPanelInOpenList: boolean;
};

const Column: React.FC<ColumnProps> = ({
	column,
	articles,
	isSearchAll,
	togglePanel,
	isPanelInOpenList,
}) => {
	const headingId = `${isSearchAll ? column.name.toLowerCase() : column.id}-heading`;
	const collapseId = `${isSearchAll ? column.name.toLowerCase() : column.id}-collapse`;

	const [width] = useScreenSize();
	const isXlScreen = width >= XL_MIN_WIDTH;
	const isPanelExpanded = isXlScreen || isPanelInOpenList;

	const slantColor =
		column.slant === null || typeof column.slant === 'undefined'
			? getColorBySlant(+column.id)
			: getColorBySlant(column.slant);

	return (
		<Collapsible.Root className='flex basis-1/5 flex-col gap-4' open={isPanelExpanded}>
			<Paper className='flex flex-row items-center gap-4 xl:flex-col'>
				<ColumnHeadingIcon column={column} isColumnSlant={isSearchAll} />
				{isXlScreen ? (
					<h3 className='mb-2 text-center text-2xl'>{column.name}</h3>
				) : (
					<Button
						className='mx-auto'
						variant='text'
						color={slantColor}
						onClick={() => togglePanel(column.id)}
						aria-controls={collapseId}
					>
						<h4 className='text-xl'>{column.name}</h4>
					</Button>
				)}
			</Paper>
			<Collapsible.Panel aria-labelledby={headingId}>
				<ColumnArticles articles={articles} isSearchAll={isSearchAll} slantColor={slantColor} />
			</Collapsible.Panel>
		</Collapsible.Root>
	);
};

export default Column;
