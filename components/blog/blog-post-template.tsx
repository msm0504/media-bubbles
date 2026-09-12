import { Paper } from '../shared/base-ui';
import markdownToHtml from '../shared/markdown-to-html';
import PageHeading from '../shared/page-heading';

type BlogPostTemplateProps = {
	content: string;
	date: string;
	title: string;
};

const BlogPostTemplate: React.FC<BlogPostTemplateProps> = ({ content, date, title }) => (
	<div className='flex flex-col gap-4'>
		<PageHeading heading={title} />
		<Paper className='flex flex-col gap-4'>
			<div className='text-sm font-light'>{`Last updated at ${new Date(date).toLocaleString()} `}</div>
			{markdownToHtml(content)}
		</Paper>
	</div>
);

export default BlogPostTemplate;
