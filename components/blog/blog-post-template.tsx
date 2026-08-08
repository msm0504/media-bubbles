import markdownToHtml from '../shared/markdown-to-html';
import PageHeading from '../shared/page-heading';

type BlogPostTemplateProps = {
	content: string;
	date: string;
	title: string;
};

const BlogPostTemplate: React.FC<BlogPostTemplateProps> = ({ content, date, title }) => (
	<>
		<PageHeading heading={title} />
		<div className='rounded-xl p-4'>
			<div className='text-sm'>{`Last updated at ${new Date(date).toLocaleString()} `}</div>
			{markdownToHtml(content)}
		</div>
	</>
);

export default BlogPostTemplate;
