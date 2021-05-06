import { CardBody, FormGroup, Input, Label } from 'reactstrap';

import { SOURCE_SLANT } from '../../constants/source-slant';

const SlantRadioButtons = ({ selection, onChange }) => {
	const radiobuttons = SOURCE_SLANT.map(sourceSlant => {
		return (
			<FormGroup key={'sourceSlant' + sourceSlant.id} className='col-xs-1 col-md-2 m-0'>
				<Input
					type='radio'
					value={sourceSlant.id}
					name='sourceSlant'
					id={'sourceSlant' + sourceSlant.id}
					checked={sourceSlant.id === selection}
					onChange={event => onChange(event.target.name, sourceSlant.id)}
				/>
				<Label for={'sourceSlant' + sourceSlant.id}>
					<strong>{sourceSlant.name}</strong>
				</Label>
			</FormGroup>
		);
	});

	return (
		<>
			<p className='ml-3'>
				<strong>Choose the category that you think best fits your political views.</strong>
			</p>
			<CardBody className='bg-white rounded-xl d-flex flex-column flex-md-row justify-content-md-around'>
				{radiobuttons}
			</CardBody>
		</>
	);
};

export default SlantRadioButtons;
