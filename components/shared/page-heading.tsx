import { Typography } from '@mui/material';

type PageHeadingProps = {
	heading: string;
};

const PageHeading: React.FC<PageHeadingProps> = ({ heading }) => (
	<Typography component='h2' variant='h3' color='info' marginBottom={2} fontWeight='bold'>
		{heading}
	</Typography>
);

export default PageHeading;
