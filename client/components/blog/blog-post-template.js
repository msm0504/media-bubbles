import { Card } from 'reactstrap';
import markdownToHtml from '../../util/markdown-to-html';

const BlogPostTemplate = ({ content, date, title }) => (
	<>
		<h1 className='text-info'>{title}</h1>
		<Card body className='bg-white rounded-xl'>
			<small className='text-muted'>{`Last updated at ${new Date(date).toLocaleString()} `}</small>
			{markdownToHtml(content, 'mt-2')}
		</Card>
	</>
);

export default BlogPostTemplate;
