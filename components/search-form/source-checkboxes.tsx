'use client';
import { ChangeEvent } from 'react';
import { Checkbox, FormControlLabel, Grid2 as Grid, Paper, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare, faSquareCheck } from '@fortawesome/free-regular-svg-icons';
// import { faSquare as faSquareSolid } from '@fortawesome/free-solid-svg-icons';
import MAX_SOURCE_SELECTIONS from '@/constants/max-source-selections';
import type { Source } from '@/types';

type SourceCheckboxesProps = {
	sourceList: Source[];
	selections: string[];
	onChange: (event: ChangeEvent<HTMLInputElement>, sourceId: string) => void;
};

const SourceCheckboxes: React.FC<SourceCheckboxesProps> = ({
	sourceList,
	selections,
	onChange,
}) => {
	const checkboxes = sourceList.map(source => {
		const isChecked = selections.indexOf(source.id) > -1;
		const isDisabled =
			selections.indexOf(source.id) === -1 && selections.length === MAX_SOURCE_SELECTIONS;
		return (
			<Grid key={source.id + 'Checkbox'} size={{ xs: 12, md: 2 }}>
				<FormControlLabel
					control={
						<Checkbox
							name={source.id + 'Checkbox'}
							value={source.id}
							checked={isChecked}
							disabled={isDisabled}
							onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event, source.id)}
							icon={<FontAwesomeIcon icon={faSquare} size='2xl' />}
							checkedIcon={<FontAwesomeIcon icon={faSquareCheck} size='2xl' />}
						/>
					}
					label={source.name}
				/>
			</Grid>
		);
	});

	return (
		<>
			<Typography fontWeight='bold'>Choose up to {MAX_SOURCE_SELECTIONS} sources.</Typography>
			<Paper>
				<Grid container spacing={2}>
					{checkboxes}
				</Grid>
			</Paper>
		</>
	);
};

export default SourceCheckboxes;
