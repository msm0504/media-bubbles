import { CardBody, FormGroup, Input, Label } from 'reactstrap';

import MAX_SOURCE_SELECTIONS from '../../constants/max-source-selections';

const SourceCheckboxes = ({ sourceList, selections, onChange }) => {
	const checkboxes = sourceList.map(source => {
		return (
			<FormGroup key={source.id + 'Checkbox'} className='col-xs-1 col-md-2'>
				<Input
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
				<Label for={source.id + 'Checkbox'}>
					<strong>{source.name}</strong>
				</Label>
			</FormGroup>
		);
	});

	return (
		<>
			<p className='ml-3'>
				<strong>Choose up to {MAX_SOURCE_SELECTIONS} sources.</strong>
			</p>
			<CardBody className='row bg-white rounded-xl my-3 mx-0'>{checkboxes}</CardBody>
		</>
	);
};

export default SourceCheckboxes;
