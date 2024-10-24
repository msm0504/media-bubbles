'use client';
import { ChangeEvent } from 'react';
import { FormControlLabel, Paper, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faCircleDot } from '@fortawesome/free-regular-svg-icons';
import { SOURCE_SLANT_MAP, SourceSlant } from '@/constants/source-slant';
import { keys } from '@/util/typed-keys';

type SlantRadioButtonsProps = {
	selection?: SourceSlant;
	onChange: (fieldName: string, value: SourceSlant) => void;
};

const SlantRadioButtons: React.FC<SlantRadioButtonsProps> = ({ selection, onChange }) => {
	const radiobuttons = keys(SOURCE_SLANT_MAP).map((sourceSlant: SourceSlant) => {
		return (
			<FormControlLabel
				key={'sourceSlant' + sourceSlant}
				value={sourceSlant}
				control={
					<Radio
						icon={<FontAwesomeIcon icon={faCircle} size='xl' />}
						checkedIcon={<FontAwesomeIcon icon={faCircleDot} size='xl' />}
					/>
				}
				label={<Typography fontWeight='bold'>{SOURCE_SLANT_MAP[sourceSlant]}</Typography>}
			/>
		);
	});

	return (
		<>
			<Typography fontWeight='bold'>
				Choose the category that you think best fits your political views.
			</Typography>
			<Paper>
				<Stack
					component={RadioGroup}
					direction={{ xs: 'column', md: 'row' }}
					justifyContent={{ md: 'space-around' }}
					name='sourceSlant'
					value={selection}
					onChange={(event: ChangeEvent<HTMLInputElement>) =>
						onChange(event.target.name, Number(event.target.value) as SourceSlant)
					}
				>
					{radiobuttons}
				</Stack>
			</Paper>
		</>
	);
};

export default SlantRadioButtons;
