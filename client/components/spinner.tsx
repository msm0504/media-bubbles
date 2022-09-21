const Spinner: React.FC = () => (
	<div className='row'>
		<div className='col-md-12' style={{ minHeight: '200px' }}></div>
		<div className='col-md-4 offset-md-4 text-center'>
			<i className='fa-solid fa-spinner fa-pulse fa-4x fa-fw text-primary' aria-hidden='true'></i>
			<div className='text-info'>
				<strong>Loading...</strong>
			</div>
		</div>
	</div>
);

export default Spinner;
