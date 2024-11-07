import type { Metadata } from 'next';
import { ParentCompProps } from '@/types';
import PageHeading from '@/components/shared/page-heading';

export const metadata: Metadata = {
	title: 'Headlines - Media Bubbles',
	alternates: {
		canonical: `${process.env.NEXT_PUBLIC_URL}/headlines`,
	},
};

const NewSearchResults: React.FC<ParentCompProps> = ({ children }) => (
	<>
		<PageHeading heading='Search Results' />
		{children}
	</>
);

export default NewSearchResults;
