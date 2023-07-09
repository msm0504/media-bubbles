import { Card } from 'react-bootstrap';
import markdownToHtml from '../../util/markdown-to-html';

type BlogPostTemplateProps = {
	content: string;
	date: string;
	title: string;
};

const BlogPostTemplate: React.FC<BlogPostTemplateProps> = ({ content, date, title }) => (
	<>
		<h2 className='text-info h1'>{title}</h2>
		<Card.Body className='bg-white rounded-3'>
			<small className='text-muted'>{`Last updated at ${new Date(date).toLocaleString()} `}</small>
			{markdownToHtml(content, 'mt-2')}
		</Card.Body>
	</>
);

export default BlogPostTemplate;
