import type { Metadata } from 'next';
import { ParentCompProps } from '@/types';

export const metadata: Metadata = {
	title: 'Blog - Media Bubbles',
	alternates: {
		canonical: `${process.env.NEXT_PUBLIC_URL}/blog`,
	},
};

const Blog: React.FC<ParentCompProps> = ({ children }) => children;

export default Blog;
