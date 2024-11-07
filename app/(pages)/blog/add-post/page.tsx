import type { Metadata } from 'next';
import AddEditBlogPost from '@/components/blog/add-edit-post';

export const metadata: Metadata = {
	title: 'Add Blog Post - Media Bubbles',
	alternates: {
		canonical: `${process.env.NEXT_PUBLIC_URL}/add-post`,
	},
};

const NewSearchResults: React.FC = () => <AddEditBlogPost />;

export default NewSearchResults;
