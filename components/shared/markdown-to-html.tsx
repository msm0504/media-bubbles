import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

const markdownToHtml = (markdown: string): JSX.Element => (
	<ReactMarkdown remarkPlugins={[gfm]}>{markdown}</ReactMarkdown>
);

export default markdownToHtml;
