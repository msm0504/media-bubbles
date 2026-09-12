import { Switch } from '../shared/base-ui';

type FullSpectrumProps = {
	spectrumSearchAll: 'Y' | 'N';
	onChange: (fieldName: string, value: 'Y' | 'N') => void;
};

const FullSpectrum: React.FC<FullSpectrumProps> = ({ spectrumSearchAll, onChange }) => {
	const isChecked = spectrumSearchAll === 'Y';
	return (
		<label className='flex items-center gap-2'>
			<Switch
				name='spectrumSearchAll'
				checked={isChecked}
				color='primary'
				size='xl'
				onCheckedChange={(checked, eventDetails) =>
					onChange((eventDetails.event.target as HTMLInputElement)?.name || '', checked ? 'Y' : 'N')
				}
			/>
			Include Multiple Sources in Each Category
		</label>
	);
};

export default FullSpectrum;
