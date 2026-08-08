import { Card, CardHeader, Collapse, useMediaQuery, useTheme } from '@mui/material';
import ColumnArticles from './column-articles';
import ColumnHeadingIcon from './column-heading-icon';
import { Button } from '../shared/base-ui';
import { SOURCE_SLANT_MAP } from '@/constants/source-slant';
import type { Article, Source } from '@/types';

type ColumnProps = {
	column: Source;
	articles: Article[];
	isSearchAll: boolean;
	togglePanel: (columnId: string) => void;
	isPanelInOpenList: boolean;
};

const CENTER = Math.floor(Object.keys(SOURCE_SLANT_MAP).length / 2);
const getTextClassBySlant = (slant: number) =>
	isNaN(slant) || slant > CENTER ? 'primary' : slant < CENTER ? 'info' : 'error';

const Column: React.FC<ColumnProps> = ({
	column,
	articles,
	isSearchAll,
	togglePanel,
	isPanelInOpenList,
}) => {
	const headingId = `${isSearchAll ? column.name.toLowerCase() : column.id}-heading`;
	const collapseId = `${isSearchAll ? column.name.toLowerCase() : column.id}-collapse`;

	const theme = useTheme();
	const isLgScreen = useMediaQuery(theme.breakpoints.up('lg'));
	const isPanelExpanded = isLgScreen || isPanelInOpenList;

	const slantClass =
		column.slant === null || typeof column.slant === 'undefined'
			? getTextClassBySlant(+column.id)
			: getTextClassBySlant(column.slant);

	return (
		<div className='flex basis-1/5 flex-col gap-4'>
			<Card>
				<CardHeader
					disableTypography
					id={headingId}
					sx={{ flexDirection: { xs: 'row', lg: 'column' } }}
					avatar={<ColumnHeadingIcon column={column} isColumnSlant={isSearchAll} />}
					title={
						isLgScreen ? (
							<h3 className='mb-2 text-center text-2xl'>{column.name}</h3>
						) : (
							<div className='flex justify-center'>
								<Button
									className='mx-auto'
									variant='text'
									color={slantClass}
									onClick={() => togglePanel(column.id)}
									aria-expanded={isPanelExpanded}
									aria-controls={collapseId}
								>
									<h4 className='text-xl'>{column.name}</h4>
								</Button>
							</div>
						)
					}
				/>
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
