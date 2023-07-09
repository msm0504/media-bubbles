import { ChangeEvent } from 'react';
import { Card, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';

import { SOURCE_SLANT_MAP, SourceSlant } from '../../constants/source-slant';
import { keys } from '../../util/typed-keys';

import styles from '../../../styles/search-form.module.css';

type SlantRadioButtonsProps = {
	selection?: SourceSlant;
	onChange: (fieldName: string, value: SourceSlant) => void;
};

const SlantRadioButtons: React.FC<SlantRadioButtonsProps> = ({ selection, onChange }) => {
	const radiobuttons = keys(SOURCE_SLANT_MAP).map((sourceSlant: SourceSlant) => {
		const isChecked = sourceSlant === selection;
		return (
			<Form.Check key={'sourceSlant' + sourceSlant} className='col-xs-1 col-md-2 m-0'>
				<Form.Check.Input
					className={styles.hiddenInput}
					type='radio'
					value={sourceSlant}
					name='sourceSlant'
					id={'sourceSlant' + sourceSlant}
					checked={isChecked}
					onChange={(event: ChangeEvent<HTMLInputElement>) =>
						onChange(event.target.name, sourceSlant)
					}
				/>
				<Form.Check.Label htmlFor={'sourceSlant' + sourceSlant}>
					{isChecked ? (
						<FontAwesomeIcon
							className={`${styles.iconInput} me-1 text-primary`}
							icon={regular('circle-dot')}
							size='xl'
						/>
					) : (
						<FontAwesomeIcon
							className={`${styles.iconInput} me-1 text-secondary`}
							icon={regular('circle')}
							size='xl'
						/>
					)}
					<strong>{SOURCE_SLANT_MAP[sourceSlant]}</strong>
				</Form.Check.Label>
			</Form.Check>
		);
	});

	return (
		<>
			<p className='ms-3'>
				<strong>Choose the category that you think best fits your political views.</strong>
			</p>
			<Card.Body className='bg-white rounded-3 d-flex flex-column flex-md-row justify-content-md-around'>
				{radiobuttons}
			</Card.Body>
		</>
	);
};

export default SlantRadioButtons;
