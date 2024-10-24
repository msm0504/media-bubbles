import { Grid2 as Grid, Icon, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Spinner: React.FC = () => (
	<Grid container paddingTop={4}>
		<Grid size={4} offset={4} textAlign='center'>
			<Icon sx={{ fontSize: '4rem' }} color='primary'>
				<FontAwesomeIcon icon={faSpinner} pulse />
			</Icon>
		</Grid>
		<Grid size={4} offset={4} textAlign='center'>
			<Typography color='info'>Loading...</Typography>
		</Grid>
	</Grid>
);

export default Spinner;
