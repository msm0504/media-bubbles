import { ChangeEvent } from 'react';
import { Card, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare, faSquareCheck } from '@fortawesome/free-regular-svg-icons';
import { faSquare as faSquareSolid } from '@fortawesome/free-solid-svg-icons';

import MAX_SOURCE_SELECTIONS from '@/client/constants/max-source-selections';
import type { Source } from '@/types';

import styles from '@/styles/search-form.module.css';

type SourceCheckboxesProps = {
	sourceList: Source[];
	selections: string[];
	onChange: (event: ChangeEvent<HTMLInputElement>, sourceId: string) => void;
};

const SourceCheckboxes: React.FC<SourceCheckboxesProps> = ({
	sourceList,
	selections,
	onChange
}) => {
	const checkboxes = sourceList.map(source => {
		const isChecked = selections.indexOf(source.id) > -1;
		const isDisabled =
			selections.indexOf(source.id) === -1 && selections.length === MAX_SOURCE_SELECTIONS;
		return (
			<Form.Check key={source.id + 'Checkbox'} className='col-xs-1 col-md-2'>
				<Form.Check.Input
					className={styles.hiddenInput}
					type='checkbox'
					value={source.id}
					name={source.id + 'Checkbox'}
					id={source.id + 'Checkbox'}
					checked={isChecked}
					disabled={isDisabled}
					onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event, source.id)}
				/>
				<Form.Check.Label htmlFor={source.id + 'Checkbox'}>
					{isChecked ? (
						<FontAwesomeIcon
							className={`${styles.iconInput} me-1 text-primary`}
							icon={faSquareCheck}
							size='2xl'
						/>
					) : (
						<FontAwesomeIcon
							className={`${styles.iconInput} me-1 text-secondary`}
							icon={isDisabled ? faSquareSolid : faSquare}
							size='2xl'
						/>
					)}
					<strong>{source.name}</strong>
				</Form.Check.Label>
			</Form.Check>
		);
	});

	return (
		<>
			<p className='ms-3'>
				<strong>Choose up to {MAX_SOURCE_SELECTIONS} sources.</strong>
			</p>
			<Card.Body className='row bg-white rounded-3 my-3 mx-0'>{checkboxes}</Card.Body>
		</>
	);
};

export default SourceCheckboxes;
