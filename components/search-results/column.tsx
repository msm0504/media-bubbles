import {
	Button,
	Card,
	CardHeader,
	Collapse,
	Stack,
	Typography,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import ColumnArticles from './column-articles';
import ColumnHeadingIcon from './column-heading-icon';
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
			? getTextClassBySlant(Number(column.id))
			: getTextClassBySlant(column.slant);

	return (
		<Stack flexBasis='20%' spacing={4}>
			<Card>
				<CardHeader
					disableTypography
					id={headingId}
					sx={{ flexDirection: { xs: 'row', lg: 'column' } }}
					avatar={<ColumnHeadingIcon column={column} isColumnSlant={isSearchAll} />}
					title={
						isLgScreen ? (
							<Typography variant='h3' textAlign='center' marginBottom={2}>
								{column.name}
							</Typography>
						) : (
							<Stack direction='row' justifyContent='center'>
								<Button
									variant='text'
									color={slantClass}
									sx={{ marginX: 'auto', textTransform: 'none' }}
									onClick={() => togglePanel(column.id)}
									aria-expanded={isPanelExpanded}
									aria-controls={collapseId}
								>
									<Typography variant='h4'>{column.name}</Typography>
								</Button>
							</Stack>
						)
					}
				/>
			</Card>
			<Collapse in={isPanelExpanded}>
				<div id={collapseId} aria-labelledby={headingId}>
					<ColumnArticles articles={articles} isSearchAll={isSearchAll} slantClass={slantClass} />
				</div>
			</Collapse>
		</Stack>
	);
};

export default Column;
