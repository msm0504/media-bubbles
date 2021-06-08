import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

const markdownToHtml = (markdown: string, className = ''): JSX.Element => (
	<ReactMarkdown className={className} plugins={[gfm]}>
		{markdown}
	</ReactMarkdown>
);
export default markdownToHtml;
