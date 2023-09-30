import { Card } from 'react-bootstrap';
import { isNewsApiArticle } from '@/types';
import type { Article } from '@/types';

type ColumnArticlesProps = {
	articles: Article[];
	isSearchAll: boolean;
	slantClass: string;
};

const NOT_FOUND_MESSAGE = (
	<Card body className='rounded-3 m-1 text-center text-primary'>
		No Headlines Found
	</Card>
);

const ColumnArticles: React.FC<ColumnArticlesProps> = ({ articles, isSearchAll, slantClass }) => {
	if (!(articles && articles.length)) return NOT_FOUND_MESSAGE;

	return (
		<>
			{articles.map(article =>
				isNewsApiArticle(article) ? (
					<Card body className='rounded-3 m-1' key={article.url}>
						{isSearchAll ? (
							<Card.Title className={`text-${slantClass}`}>{article.source.name}</Card.Title>
						) : null}
						<Card.Subtitle className='mb-2'>
							<a
								className={`link-${slantClass}`}
								href={article.url}
								target='_blank'
								rel='noopener noreferrer'
								dangerouslySetInnerHTML={{ __html: article.title }}
							></a>
						</Card.Subtitle>
						<Card.Text dangerouslySetInnerHTML={{ __html: article.description }} />
					</Card>
				) : (
					<Card body className='rounded-3 m-1' key={article.id}>
						{isSearchAll ? (
							<Card.Title className={`text-${slantClass}`}>{article.sourceName}</Card.Title>
						) : null}
						<Card.Text dangerouslySetInnerHTML={{ __html: article.text }} />
					</Card>
				)
			)}
		</>
	);
};

export default ColumnArticles;
