import remark from 'remark';
import html from 'remark-html';

const markdownToHtml = markdown => remark().use(html).processSync(markdown).toString();

export default markdownToHtml;
