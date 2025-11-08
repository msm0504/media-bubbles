import { Card, CardContent, CardHeader, Link, Stack, Typography } from '@mui/material';
import { isBskyArticle, isNewsApiArticle, isTwitterArticle } from '@/types';
import type { Article } from '@/types';

type ColumnArticlesProps = {
	articles: Article[];
	isSearchAll: boolean;
	slantClass: string;
};

type ColumnArticleProps = {
	article: Article;
	isSearchAll: boolean;
	slantClass: string;
};

type ArticleProps = {
	isSearchAll: boolean;
	slantClass: string;
	sourceName: string;
	text: string;
	url?: string;
};

type ArticleWithTitleProps = Required<ArticleProps> & {
	title: string;
};

const NOT_FOUND_MESSAGE = (
	<Card sx={{ textAlign: 'center', color: 'primary' }}>
		<CardContent>No Headlines Found</CardContent>
	</Card>
);

const ArticleWithTitle: React.FC<ArticleWithTitleProps> = ({
	isSearchAll,
	slantClass,
	sourceName,
	text,
	title,
	url,
}) => (
	<Card>
		{isSearchAll ? (
			<CardHeader subheaderTypographyProps={{ color: slantClass }} subheader={sourceName} />
		) : null}
		<CardHeader
			titleTypographyProps={{ variant: 'h6' }}
			title={
				<Link
					color={slantClass}
					href={url}
					target='_blank'
					rel='noopener noreferrer'
					dangerouslySetInnerHTML={{ __html: title }}
				></Link>
			}
		/>
		<CardContent>
			<Typography dangerouslySetInnerHTML={{ __html: text }} />
		</CardContent>
	</Card>
);

const ArticleWithoutTitle: React.FC<ArticleProps> = ({
	isSearchAll,
	slantClass,
	sourceName,
	text,
	url,
}) => (
	<Card>
		{isSearchAll ? (
			<CardHeader subheaderTypographyProps={{ color: slantClass }} subheader={sourceName} />
		) : null}
		<CardContent>
			<Typography dangerouslySetInnerHTML={{ __html: text }} />
			{url ? (
				<Typography>
					<Link color={slantClass} href={url} target='_blank' rel='noopener noreferrer'>
						Read more
					</Link>
				</Typography>
			) : null}
		</CardContent>
	</Card>
);

const getColumnArticle = ({ article, isSearchAll, slantClass }: ColumnArticleProps) => {
	if (isNewsApiArticle(article)) {
		return (
			<ArticleWithTitle
				isSearchAll={isSearchAll}
				key={article.url}
				slantClass={slantClass}
				sourceName={article.source.name}
				title={article.title}
				text={article.description}
				url={article.url}
			/>
		);
	}

	if (isTwitterArticle(article)) {
		return (
			<ArticleWithoutTitle
				isSearchAll={isSearchAll}
				key={article.id}
				slantClass={slantClass}
				sourceName={article.sourceName}
				text={article.text}
				url={article.url}
			/>
		);
	}

	if (isBskyArticle(article)) {
		return article.title ? (
			<ArticleWithTitle
				isSearchAll={isSearchAll}
				key={article._id}
				slantClass={slantClass}
				sourceName={article.sourceName}
				title={article.title}
				text={article.description}
				url={article.url}
			/>
		) : (
			<ArticleWithoutTitle
				isSearchAll={isSearchAll}
				key={article._id}
				slantClass={slantClass}
				sourceName={article.sourceName}
				text={article.description}
				url={article.url}
			/>
		);
	}

	return null;
};

const ColumnArticles: React.FC<ColumnArticlesProps> = ({ articles, isSearchAll, slantClass }) => {
	if (!(articles && articles.length)) return NOT_FOUND_MESSAGE;

	return (
		<Stack spacing={4}>
			{articles.map(article => getColumnArticle({ article, isSearchAll, slantClass }))}
		</Stack>
	);
};

export default ColumnArticles;
