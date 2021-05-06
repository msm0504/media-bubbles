import { Button, Card, CardHeader, Collapse } from 'reactstrap';

import ColumnArticles from './column-articles';
import ColumnHeadingIcon from './column-heading-icon';
import useMediaQuery, { XL_MIN_WIDTH } from '../../hooks/use-media-query';

const Column = ({ column, articles, isSearchAll, togglePanel, isPanelInOpenList }) => {
	const headingId = `${isSearchAll ? column.name.toLowerCase() : column.id}-heading`;
	const collapseId = `${isSearchAll ? column.name.toLowerCase() : column.id}-collapse`;

	const [width] = useMediaQuery();
	const isPanelExpanded = width >= XL_MIN_WIDTH || isPanelInOpenList;

	return (
		<div className='d-flex flex-column' style={{ flexBasis: '20%' }}>
			<Card className='m-1 rounded-xl'>
				<CardHeader id={headingId} className='p-0 w-100 mx-auto'>
					<div className='d-flex flex-row flex-xl-column'>
						<ColumnHeadingIcon
							className='d-none d-md-block m-2'
							column={column}
							isColumnSlant={isSearchAll}
						/>
						<div className='h1 text-center mb-2 d-none d-xl-block'>{column.name}</div>
						<Button
							color='link'
							className='d-xl-none mx-auto'
							onClick={() => togglePanel(column.id)}
							aria-expanded={isPanelExpanded}
							aria-controls={collapseId}
						>
							<div className='h1 text-center my-auto'>{column.name}</div>
						</Button>
					</div>
				</CardHeader>
			</Card>
			<Collapse id={collapseId} isOpen={isPanelExpanded} aria-labelledby={headingId}>
				<ColumnArticles articles={articles} columnId={column.id} isSearchAll={isSearchAll} />
			</Collapse>
		</div>
	);
};

export default Column;
