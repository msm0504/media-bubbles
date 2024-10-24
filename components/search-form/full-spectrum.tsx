'use client';
import { ChangeEvent } from 'react';
import { Checkbox, FormControlLabel, Paper, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons';

type FullSpectrumProps = {
	spectrumSearchAll: 'Y' | 'N';
	onChange: (fieldName: string, value: 'Y' | 'N') => void;
};

const FullSpectrum: React.FC<FullSpectrumProps> = ({ spectrumSearchAll, onChange }) => {
	const isChecked = spectrumSearchAll === 'Y';
	return (
		<Paper>
			<FormControlLabel
				control={
					<Checkbox
						name='spectrumSearchAll'
						checked={isChecked}
						onChange={(event: ChangeEvent<HTMLInputElement>) =>
							onChange(event.target.name, event.target.checked ? 'Y' : 'N')
						}
						icon={<FontAwesomeIcon icon={faToggleOff} size='2xl' />}
						checkedIcon={<FontAwesomeIcon icon={faToggleOn} size='2xl' />}
					/>
				}
				label={<Typography fontWeight='bold'>Include Multiple Sources in Each Category</Typography>}
			/>
		</Paper>
	);
};

export default FullSpectrum;
