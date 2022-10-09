import { Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

const Spinner: React.FC = () => (
	<Row className='pt-3'>
		<Col className='text-center' md={{ span: 4, offset: 4 }}>
			<FontAwesomeIcon className='text-primary' icon={solid('spinner')} size='4x' pulse />
			<div className='pt-1 text-info'>
				<strong>Loading...</strong>
			</div>
		</Col>
	</Row>
);

export default Spinner;
