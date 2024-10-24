import { Card, CardContent, CardHeader, Link, Stack, Typography } from '@mui/material';
import { isNewsApiArticle } from '@/types';
import type { Article } from '@/types';

type ColumnArticlesProps = {
	articles: Article[];
	isSearchAll: boolean;
	slantClass: string;
};

const NOT_FOUND_MESSAGE = (
	<Card sx={{ textAlign: 'center', color: 'primary' }}>
		<CardContent>No Headlines Found</CardContent>
	</Card>
);

const ColumnArticles: React.FC<ColumnArticlesProps> = ({ articles, isSearchAll, slantClass }) => {
	if (!(articles && articles.length)) return NOT_FOUND_MESSAGE;

	return (
		<Stack spacing={4}>
			{articles.map(article =>
				isNewsApiArticle(article) ? (
					<Card key={article.url}>
						{isSearchAll ? (
							<CardHeader
								subheaderTypographyProps={{ color: slantClass }}
								subheader={article.source.name}
							/>
						) : null}
						<CardHeader
							titleTypographyProps={{ variant: 'h6' }}
							title={
								<Link
									color={slantClass}
									href={article.url}
									target='_blank'
									rel='noopener noreferrer'
									dangerouslySetInnerHTML={{ __html: article.title }}
								></Link>
							}
						/>
						<CardContent>
							<Typography dangerouslySetInnerHTML={{ __html: article.description }} />
						</CardContent>
					</Card>
				) : (
					<Card key={article.id}>
						{isSearchAll ? (
							<CardHeader
								subheaderTypographyProps={{ color: slantClass }}
								subheader={article.sourceName}
							/>
						) : null}
						<CardContent>
							<Typography dangerouslySetInnerHTML={{ __html: article.text }} />
						</CardContent>
					</Card>
				)
			)}
		</Stack>
	);
};

export default ColumnArticles;
