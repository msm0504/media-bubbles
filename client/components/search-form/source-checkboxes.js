import { Card, Form } from 'react-bootstrap';

import MAX_SOURCE_SELECTIONS from '../../constants/max-source-selections';

const SourceCheckboxes = ({ sourceList, selections, onChange }) => {
	const checkboxes = sourceList.map(source => {
		return (
			<Form.Check key={source.id + 'Checkbox'} className='col-xs-1 col-md-2'>
				<Form.Check.Input
					type='checkbox'
					value={source.id}
					name={source.id + 'Checkbox'}
					id={source.id + 'Checkbox'}
					checked={selections.indexOf(source.id) > -1}
					disabled={
						selections.indexOf(source.id) === -1 && selections.length === MAX_SOURCE_SELECTIONS
					}
					onChange={event => onChange(event, source.id)}
				/>
				<Form.Check.Label htmlFor={source.id + 'Checkbox'}>
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
			<Card.Body className='row bg-white rounded-xl my-3 mx-0'>{checkboxes}</Card.Body>
		</>
	);
};

export default SourceCheckboxes;
