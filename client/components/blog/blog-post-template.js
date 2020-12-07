const BlogPostTemplate = ({ content, date, title }) => (
	<>
		<h1 className='text-info'>{title}</h1>
		<small className='text-muted'>{`Last updated at ${new Date(date).toLocaleString()} `}</small>
		<div className='mt-2' dangerouslySetInnerHTML={{ __html: content }}></div>
	</>
);

export default BlogPostTemplate;
