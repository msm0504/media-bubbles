import { isBskyArticle, isNewsApiArticle, isTwitterArticle } from '@/types';
import type { Article } from '@/types';
import { Link, Paper } from '../shared/base-ui';
import { type Color, textVariants } from '@/styles/color-variants';
import cn from '@/util/cn';

type ColumnArticlesProps = {
	articles: Article[];
	isSearchAll: boolean;
	slantColor: Color;
};

type ColumnArticleProps = {
	article: Article;
	isSearchAll: boolean;
	slantColor: Color;
};

type ArticleProps = {
	isSearchAll: boolean;
	slantColor: Color;
	sourceName: string;
	text: string;
	url?: string;
};

type ArticleWithTitleProps = Required<ArticleProps> & {
	title: string;
};

const NOT_FOUND_MESSAGE = (
	<Paper>
		<p className='w-full text-center text-primary'>No Headlines Found</p>
	</Paper>
);

const ArticleWithTitle: React.FC<ArticleWithTitleProps> = ({
	isSearchAll,
	slantColor,
	sourceName,
	text,
	title,
	url,
}) => (
	<Paper className='flex flex-col gap-4'>
		{isSearchAll ? (
			<div className={cn(textVariants({ color: slantColor }), 'text-sm')}>{sourceName}</div>
		) : null}
		<h3>
			<Link
				color={slantColor}
				href={url}
				target='_blank'
				rel='noopener noreferrer'
				dangerouslySetInnerHTML={{ __html: title }}
			/>
		</h3>
		<p dangerouslySetInnerHTML={{ __html: text }} />
	</Paper>
);

const ArticleWithoutTitle: React.FC<ArticleProps> = ({
	isSearchAll,
	slantColor,
	sourceName,
	text,
	url,
}) => (
	<Paper className='flex flex-col gap-4'>
		{isSearchAll ? (
			<div className={cn(textVariants({ color: slantColor }), 'text-sm')}>{sourceName}</div>
		) : null}
		<div>
			<p dangerouslySetInnerHTML={{ __html: text }} />
			{url ? (
				<p>
					<Link color={slantColor} href={url} target='_blank' rel='noopener noreferrer'>
						Read more
					</Link>
				</p>
			) : null}
		</div>
	</Paper>
);

const getColumnArticle = ({ article, isSearchAll, slantColor }: ColumnArticleProps) => {
	if (isNewsApiArticle(article)) {
		return (
			<ArticleWithTitle
				isSearchAll={isSearchAll}
				key={article.url}
				slantColor={slantColor}
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
				slantColor={slantColor}
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
				slantColor={slantColor}
				sourceName={article.sourceName}
				title={article.title}
				text={article.description}
				url={article.url}
			/>
		) : (
			<ArticleWithoutTitle
				isSearchAll={isSearchAll}
				key={article._id}
				slantColor={slantColor}
				sourceName={article.sourceName}
				text={article.description}
				url={article.url}
			/>
		);
	}

	return null;
};

const ColumnArticles: React.FC<ColumnArticlesProps> = ({ articles, isSearchAll, slantColor }) => {
	if (!(articles && articles.length)) return NOT_FOUND_MESSAGE;

	return (
		<div className='flex flex-col gap-4'>
			{articles.map(article => getColumnArticle({ article, isSearchAll, slantColor }))}
		</div>
	);
};

export default ColumnArticles;
