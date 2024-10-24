import type { Metadata } from 'next';
import { Typography } from '@mui/material';
import { ParentCompProps } from '@/types';

export const metadata: Metadata = {
	title: 'Headlines - Media Bubbles',
	alternates: {
		canonical: `${process.env.NEXT_PUBLIC_URL}/headlines`,
	},
};

const NewSearchResults: React.FC<ParentCompProps> = ({ children }) => (
	<>
		<Typography component='h2' variant='h3' color='info' marginBottom={2} fontWeight='bold'>
			Search Results
		</Typography>
		{children}
	</>
);

export default NewSearchResults;
