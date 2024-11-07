import type { Metadata } from 'next';
import { ParentCompProps } from '@/types';
import PageHeading from '@/components/shared/page-heading';

export const metadata: Metadata = {
	title: 'Contact Us - Media Bubbles',
	alternates: {
		canonical: `${process.env.NEXT_PUBLIC_URL}/contact`,
	},
};

const ContactUs: React.FC<ParentCompProps> = ({ children }) => (
	<>
		<PageHeading heading='Contact Us' />
		{children}
	</>
);

export default ContactUs;
