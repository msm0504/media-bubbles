import type { Metadata } from 'next';
import { Typography } from '@mui/material';
import { ParentCompProps } from '@/types';

export const metadata: Metadata = {
	title: 'Contact Us - Media Bubbles',
	alternates: {
		canonical: `${process.env.NEXT_PUBLIC_URL}/contact`,
	},
};

const NewSearchResults: React.FC<ParentCompProps> = ({ children }) => (
	<>
		<Typography component='h2' variant='h3' color='info' marginBottom={2} fontWeight='bold'>
			Contact Us
		</Typography>
		{children}
	</>
);

export default NewSearchResults;
