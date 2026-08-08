import { Switch } from '../shared/base-ui';

type FullSpectrumProps = {
	spectrumSearchAll: 'Y' | 'N';
	onChange: (fieldName: string, value: 'Y' | 'N') => void;
};

const FullSpectrum: React.FC<FullSpectrumProps> = ({ spectrumSearchAll, onChange }) => {
	const isChecked = spectrumSearchAll === 'Y';
	return (
		<div className='rounded-xl p-4'>
			<label className='flex gap-2 font-bold'>
				<Switch
					name='spectrumSearchAll'
					checked={isChecked}
					onCheckedChange={checked => onChange('spectrumSearchAll', checked ? 'Y' : 'N')}
				/>
				Include Multiple Sources in Each Category
			</label>
		</div>
	);
};

export default FullSpectrum;
