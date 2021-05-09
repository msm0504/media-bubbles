import { Card } from 'react-bootstrap';
import { SOURCE_SLANT } from '../../constants/source-slant';

const CENTER = SOURCE_SLANT[Math.floor(SOURCE_SLANT.length / 2)].id;
const getTextClassBySlant = slant =>
	slant > CENTER ? 'text-primary' : slant < CENTER ? 'text-info' : '';

const NOT_FOUND_MESSAGE = (
	<Card body className='rounded-xl m-1 text-center text-primary'>
		No Headlines Found
	</Card>
);

const ColumnArticles = ({ articles, columnId, isSearchAll }) => {
	if (!(articles && articles.length)) return NOT_FOUND_MESSAGE;

	return (
		<>
			{articles.map(article =>
				article.title ? (
					<Card body className='rounded-xl m-1' key={article.url}>
						<Card.Title>
							<a
								href={article.url}
								target='_blank'
								rel='noopener noreferrer'
								dangerouslySetInnerHTML={{ __html: article.title }}
							></a>
						</Card.Title>
						<Card.Text dangerouslySetInnerHTML={{ __html: article.description }} />
					</Card>
				) : (
					<Card body className='rounded-xl m-1' key={article.id}>
						{isSearchAll ? (
							<Card.Title className={getTextClassBySlant(columnId)}>
								{article.sourceName}
							</Card.Title>
						) : null}
						<Card.Text dangerouslySetInnerHTML={{ __html: article.text }} />
					</Card>
				)
			)}
		</>
	);
};

export default ColumnArticles;
