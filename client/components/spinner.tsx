import { Col, Row } from 'react-bootstrap';

const Spinner: React.FC = () => (
	<Row className='pt-3'>
		<Col className='text-center' md={{ span: 4, offset: 4 }}>
			<i className='fa-solid fa-spinner fa-pulse fa-4x fa-fw text-primary' aria-hidden='true'></i>
			<div className='pt-1 text-info'>
				<strong>Loading...</strong>
			</div>
		</Col>
	</Row>
);

export default Spinner;
