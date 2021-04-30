import nc from 'next-connect';
import { useTestData } from '../../server/constants';
import { getHeadlines } from '../../server/services/twitter-news-service';

let testArticleMap;
if (useTestData) {
	const testArticleData = require('../../server/test-data/article-data.json');
	testArticleMap = {};
	if (testArticleData.status === 'ok') {
		testArticleData.articles.forEach(article => {
			if (!testArticleMap[article.source.id]) {
				testArticleMap[article.source.id] = [];
			}
			testArticleMap[article.source.id].push(article);
		});
	} else {
		testArticleMap = testArticleData;
	}
}

export default nc().get(async function (req, res) {
	// const articleMap = useTestData ? testArticleMap : await getHeadlines(req.query);
	// res.json(articleMap);
	res.json(await getHeadlines(req.query));
});
