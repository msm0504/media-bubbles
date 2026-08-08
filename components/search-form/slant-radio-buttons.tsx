import { RadioGroup } from '@base-ui/react';
import { Radio } from '../shared/base-ui';
import { SOURCE_SLANT_MAP, SourceSlant } from '@/constants/source-slant';
import { keys } from '@/util/typed-keys';

type SlantRadioButtonsProps = {
	selection?: SourceSlant;
	onChange: (fieldName: string, value: SourceSlant) => void;
};

const SlantRadioButtons: React.FC<SlantRadioButtonsProps> = ({ selection, onChange }) => {
	const radiobuttons = keys(SOURCE_SLANT_MAP).map((sourceSlant: SourceSlant) => {
		return (
			<label key={'sourceSlant' + sourceSlant} className='flex gap-2 font-bold'>
				<Radio value={sourceSlant} />
				{SOURCE_SLANT_MAP[sourceSlant]}
			</label>
		);
	});

	return (
		<>
			<p className='font-bold'>
				Choose the category that you think best fits your political views.
			</p>
			<RadioGroup
				className='flex flex-col rounded-xl p-4 md:flex-row md:justify-around'
				name='sourceSlant'
				value={selection || ''}
				onValueChange={value => onChange('sourceSlant', value as SourceSlant)}
			>
				{radiobuttons}
			</RadioGroup>
		</>
	);
};

export default SlantRadioButtons;
