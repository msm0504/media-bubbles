import { Button, Card, Collapse } from 'react-bootstrap';

import ColumnArticles from './column-articles';
import ColumnHeadingIcon from './column-heading-icon';
import useMediaQuery, { XL_MIN_WIDTH } from '../../hooks/use-media-query';
import { Article, Source } from '../../../types';

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
	isPanelInOpenList
}) => {
	const headingId = `${isSearchAll ? column.name.toLowerCase() : column.id}-heading`;
	const collapseId = `${isSearchAll ? column.name.toLowerCase() : column.id}-collapse`;

	const [width] = useMediaQuery();
	const isXlScreen = width >= XL_MIN_WIDTH;
	const isPanelExpanded = isXlScreen || isPanelInOpenList;

	return (
		<div className='d-flex flex-column' style={{ flexBasis: '20%' }}>
			<Card className='m-1 rounded-xl'>
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
								className='mx-auto'
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
					<ColumnArticles
						articles={articles}
						columnId={column.id}
						isSearchAll={isSearchAll}
						slant={column.slant}
					/>
				</div>
			</Collapse>
		</div>
	);
};

export default Column;
