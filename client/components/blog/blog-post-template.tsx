import { Card } from 'react-bootstrap';
import markdownToHtml from '../../util/markdown-to-html';

type BlogPostTemplateProps = {
	content: string;
	date: string;
	title: string;
};

const BlogPostTemplate: React.FC<BlogPostTemplateProps> = ({ content, date, title }) => (
	<>
		<h1 className='text-info'>{title}</h1>
		<Card.Body className='bg-white rounded-xl'>
			<small className='text-muted'>{`Last updated at ${new Date(date).toLocaleString()} `}</small>
			{markdownToHtml(content, 'mt-2')}
		</Card.Body>
	</>
);

export default BlogPostTemplate;
