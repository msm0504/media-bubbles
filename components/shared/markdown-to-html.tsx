import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

const markdownToHtml = (markdown: string): JSX.Element => (
	<ReactMarkdown className='prose max-w-none dark:text-slate-100' remarkPlugins={[gfm]}>
		{markdown}
	</ReactMarkdown>
);

export default markdownToHtml;
