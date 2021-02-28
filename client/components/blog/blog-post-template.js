import markdownToHtml from '../../util/markdown-to-html';

const BlogPostTemplate = ({ content, date, title }) => (
	<>
		<h1 className='text-info'>{title}</h1>
		<small className='text-muted'>{`Last updated at ${new Date(date).toLocaleString()} `}</small>
		{markdownToHtml(content, 'mt-2')}
	</>
);

export default BlogPostTemplate;
