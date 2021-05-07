import { Card, Form } from 'react-bootstrap';

import { SOURCE_SLANT } from '../../constants/source-slant';

const SlantRadioButtons = ({ selection, onChange }) => {
	const radiobuttons = SOURCE_SLANT.map(sourceSlant => {
		return (
			<Form.Check key={'sourceSlant' + sourceSlant.id} className='col-xs-1 col-md-2 m-0'>
				<Form.Check.Input
					type='radio'
					value={sourceSlant.id}
					name='sourceSlant'
					id={'sourceSlant' + sourceSlant.id}
					checked={sourceSlant.id === selection}
					onChange={event => onChange(event.target.name, sourceSlant.id)}
				/>
				<Form.Check.Label htmlFor={'sourceSlant' + sourceSlant.id}>
					<strong>{sourceSlant.name}</strong>
				</Form.Check.Label>
			</Form.Check>
		);
	});

	return (
		<>
			<p className='ms-3'>
				<strong>Choose the category that you think best fits your political views.</strong>
			</p>
			<Card.Body className='bg-white rounded-xl d-flex flex-column flex-md-row justify-content-md-around'>
				{radiobuttons}
			</Card.Body>
		</>
	);
};

export default SlantRadioButtons;
