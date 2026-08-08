import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Spinner: React.FC = () => (
	<div className='flex flex-col items-center justify-center gap-1 pt-4 text-center'>
		<FontAwesomeIcon className='text-primary' size='3x' icon={faSpinner} spinPulse />
		<p className='text-lg font-semibold text-info'>Loading...</p>
	</div>
);

export default Spinner;
