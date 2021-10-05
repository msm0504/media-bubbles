import { ChangeEvent } from 'react';
import { Card, Form } from 'react-bootstrap';

import { SOURCE_SLANT_MAP, SourceSlant } from '../../constants/source-slant';
import { keys } from '../../util/typed-keys';

type SlantRadioButtonsProps = {
	selection?: SourceSlant;
	onChange: (fieldName: string, value: SourceSlant) => void;
};

const SlantRadioButtons: React.FC<SlantRadioButtonsProps> = ({ selection, onChange }) => {
	const radiobuttons = keys(SOURCE_SLANT_MAP).map((sourceSlant: SourceSlant) => {
		return (
			<Form.Check key={'sourceSlant' + sourceSlant} className='col-xs-1 col-md-2 m-0'>
				<Form.Check.Input
					type='radio'
					value={sourceSlant}
					name='sourceSlant'
					id={'sourceSlant' + sourceSlant}
					checked={sourceSlant === selection}
					onChange={(event: ChangeEvent<HTMLInputElement>) =>
						onChange(event.target.name, sourceSlant)
					}
				/>
				<Form.Check.Label htmlFor={'sourceSlant' + sourceSlant}>
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
			<Card.Body className='bg-white rounded-xl d-flex flex-column flex-md-row justify-content-md-around'>
				{radiobuttons}
			</Card.Body>
		</>
	);
};

export default SlantRadioButtons;
