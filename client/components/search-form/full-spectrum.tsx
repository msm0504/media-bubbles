import { ChangeEvent } from 'react';
import { Card, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

import styles from '../../../styles/search-form.module.css';

type FullSpectrumProps = {
	spectrumSearchAll: 'Y' | 'N';
	onChange: (fieldName: string, value: 'Y' | 'N') => void;
};

const FullSpectrum: React.FC<FullSpectrumProps> = ({ spectrumSearchAll, onChange }) => {
	const isChecked = spectrumSearchAll === 'Y';
	return (
		<Card.Body className='bg-white rounded-xl my-3'>
			<Form.Check className='row m-0'>
				<Form.Check.Input
					className={styles.hiddenInput}
					type='checkbox'
					name='spectrumSearchAll'
					id='spectrumSearchAll'
					checked={isChecked}
					onChange={(event: ChangeEvent<HTMLInputElement>) =>
						onChange(event.target.name, event.target.checked ? 'Y' : 'N')
					}
				/>
				<Form.Check.Label htmlFor='spectrumSearchAll' className='col-lg-6'>
					{isChecked ? (
						<FontAwesomeIcon
							className={`${styles.iconInput} text-primary`}
							icon={solid('toggle-on')}
							size='2xl'
						/>
					) : (
						<FontAwesomeIcon
							className={`${styles.iconInput} text-secondary`}
							icon={solid('toggle-off')}
							size='2xl'
						/>
					)}
					<strong className='ms-2'>Include Multiple Sources in Each Category</strong>
				</Form.Check.Label>
			</Form.Check>
		</Card.Body>
	);
};

export default FullSpectrum;
