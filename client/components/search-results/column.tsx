import { Button, Card, Collapse } from 'react-bootstrap';

import ColumnArticles from './column-articles';
import ColumnHeadingIcon from './column-heading-icon';
import { SOURCE_SLANT_MAP } from '@/client/constants/source-slant';
import useMediaQuery, { XL_MIN_WIDTH } from '@/client/hooks/use-media-query';
import { Article, Source } from '@/types';

type ColumnProps = {
	column: Source;
	articles: Article[];
	isSearchAll: boolean;
	togglePanel: (columnId: string) => void;
	isPanelInOpenList: boolean;
};

const CENTER = Math.floor(Object.keys(SOURCE_SLANT_MAP).length / 2);
const getTextClassBySlant = (slant: number) =>
	isNaN(slant) || slant > CENTER ? 'primary' : slant < CENTER ? 'info' : 'danger';

const Column: React.FC<ColumnProps> = ({
	column,
	articles,
	isSearchAll,
	togglePanel,
	isPanelInOpenList
}) => {
	const headingId = `${isSearchAll ? column.name.toLowerCase() : column.id}-heading`;
	const collapseId = `${isSearchAll ? column.name.toLowerCase() : column.id}-collapse`;

	const [width] = useMediaQuery();
	const isXlScreen = width >= XL_MIN_WIDTH;
	const isPanelExpanded = isXlScreen || isPanelInOpenList;

	const slantClass =
		column.slant === null || typeof column.slant === 'undefined'
			? getTextClassBySlant(Number(column.id))
			: getTextClassBySlant(column.slant);

	return (
		<div className='d-flex flex-column' style={{ flexBasis: '20%' }}>
			<Card className='m-1 rounded-3'>
				<Card.Header id={headingId} className='p-0 w-100 mx-auto'>
					<div className='d-flex flex-row flex-xl-column'>
						<ColumnHeadingIcon
							className='d-block m-2'
							column={column}
							isColumnSlant={isSearchAll}
						/>
						{isXlScreen ? (
							<div className='h1 text-center mb-2'>{column.name}</div>
						) : (
							<Button
								variant='link'
								className={`mx-auto link-${slantClass}`}
								onClick={() => togglePanel(column.id)}
								aria-expanded={isPanelExpanded}
								aria-controls={collapseId}
							>
								<div className='h1 text-center my-auto'>{column.name}</div>
							</Button>
						)}
					</div>
				</Card.Header>
			</Card>
			<Collapse in={isPanelExpanded}>
				<div id={collapseId} aria-labelledby={headingId}>
					<ColumnArticles articles={articles} isSearchAll={isSearchAll} slantClass={slantClass} />
				</div>
			</Collapse>
		</div>
	);
};

export default Column;
