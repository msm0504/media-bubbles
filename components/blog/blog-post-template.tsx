import { Paper, Typography } from '@mui/material';
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
		<Paper>
			<Typography variant='body2'>{`Last updated at ${new Date(date).toLocaleString()} `}</Typography>
			<Typography component='div'>{markdownToHtml(content)}</Typography>
		</Paper>
	</>
);

export default BlogPostTemplate;
