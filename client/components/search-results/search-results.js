import { Fragment } from 'react';
import { connect } from 'react-redux';
import {
	Button,
	Card,
	CardBody,
	CardGroup,
	CardHeader,
	CardText,
	CardTitle,
	Collapse
} from 'reactstrap';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import ColumnHeadingIcon from './search-result-column-icon';
import SaveResults from '../save-results/save-results';
import { SOURCE_SLANT } from '../../constants/source-slant';
import UIActions from '../../actions/ui-actions';
const ShareButtons = dynamic(() => import('../save-results/share-buttons'), { ssr: false });

const CENTER = SOURCE_SLANT[Math.floor(SOURCE_SLANT.length / 2)].id;
const getTextClassBySlant = slant =>
	slant > CENTER ? 'text-primary' : slant < CENTER ? 'text-info' : '';

const mapStateToProps = state => {
	return {
		sourceState: state.sourceState,
		searchResultState: state.searchResultState
	};
};

const mapDispatchToProps = {
	onPanelOpen: UIActions.panelOpened,
	onPanelClose: UIActions.panelClosed
};

const NOT_FOUND_MESSAGE = (
	<CardBody className='text-center text-primary'>No Headlines Found</CardBody>
);

const SearchResults = ({
	onPanelClose,
	onPanelOpen,
	searchResultState,
	sourceState,
	isLatest = false
}) => {
	const router = useRouter();
	const { resultId } = router.query;
	const stateToDisplayName = isLatest ? 'latest' : resultId ? 'loadedResult' : 'newSearch';
	const stateToDisplay = searchResultState[stateToDisplayName];
	const { isSearchAll } = stateToDisplay;

	if (resultId && !(stateToDisplay && Object.keys(stateToDisplay).length)) {
		return <CardBody className='text-info'>{'No saved search result found for this id'}</CardBody>;
	}

	if (resultId && resultId !== stateToDisplay.savedResultId) return null;

	const generateCollapse = (column, articleListHTML) => {
		return (
			<Card key={column.id + 'Collapse'}>
				<CardHeader id={column.id + 'Heading'}>
					<div className='row h-100'>
						<ColumnHeadingIcon
							className='d-none d-md-block col-md-3 col-lg-2'
							column={column}
							isColumnSlant={isSearchAll}
						/>
						<Button
							color='link'
							className='col-xs-12 col-md-9 col-lg-10 text-wrap'
							onClick={() => toggle(column.id)}
							aria-expanded={isArticleListOpen(column.id)}
							aria-controls={column.id + 'Collapse'}
						>
							<h1 className='text-center my-auto'>{column.name}</h1>
						</Button>
					</div>
				</CardHeader>
				<Collapse
					id={column.id + 'Collapse'}
					isOpen={isArticleListOpen(column.id)}
					aria-labelledby={column.id + 'Heading'}
				>
					{articleListHTML}
				</Collapse>
			</Card>
		);
	};

	const toggle = columnId => {
		if (stateToDisplay.openPanels.indexOf(columnId) === -1) {
			onPanelOpen(columnId, stateToDisplayName);
		} else {
			onPanelClose(columnId, stateToDisplayName);
		}
	};

	const isArticleListOpen = columnId => {
		return stateToDisplay.openPanels.indexOf(columnId) !== -1;
	};

	const generateFull = (column, articleListHTML) => {
		return (
			<Card key={column.id + 'Card'} className='p-0' body outline color='info'>
				<CardHeader>
					<h1 className='text-center my-auto'>{column.name}</h1>
					<ColumnHeadingIcon className='m-lg-2' column={column} isColumnSlant={isSearchAll} />
				</CardHeader>
				{articleListHTML}
			</Card>
		);
	};

	const generateArticleList = columnId => {
		const articleListState = stateToDisplay.articleMap[columnId];
		if (articleListState) {
			const articleList = articleListState.map(article => {
				return article.title ? (
					<Fragment key={article.url}>
						<CardBody className='p-0'>
							<CardTitle>
								<a
									href={article.url}
									target='_blank'
									rel='noopener noreferrer'
									dangerouslySetInnerHTML={{ __html: article.title }}
								></a>
							</CardTitle>
							<CardText dangerouslySetInnerHTML={{ __html: article.description }} />
						</CardBody>
						<hr className='bg-info' />
					</Fragment>
				) : (
					<Fragment key={article.id}>
						<CardBody className='p-0'>
							{isSearchAll ? (
								<CardTitle className={getTextClassBySlant(columnId)}>
									{article.sourceName}
								</CardTitle>
							) : null}
							<CardText dangerouslySetInnerHTML={{ __html: article.text }} />
						</CardBody>
						<hr className='bg-info' />
					</Fragment>
				);
			});
			return articleList.length ? <CardBody>{articleList}</CardBody> : NOT_FOUND_MESSAGE;
		}
		return NOT_FOUND_MESSAGE;
	};

	const generateCollapseAndFullViews = () => {
		const collapseViews = [];
		const fullViews = [];

		const columnList = isSearchAll
			? SOURCE_SLANT
			: resultId
			? stateToDisplay.sourceList
			: sourceState.sourceListToSearch;

		columnList.forEach(column => {
			const articleListHTML = generateArticleList(column.id);
			collapseViews.push(generateCollapse(column, articleListHTML));
			fullViews.push(generateFull(column, articleListHTML));
		});

		return { collapseViews: collapseViews, fullViews: fullViews };
	};

	const displayShareButtons = () => {
		const currentUrl = `${process.env.NEXT_PUBLIC_API_URL}${router.asPath}`;
		const urlToShare = resultId
			? currentUrl
			: stateToDisplay.savedResultId
			? `${currentUrl}/${stateToDisplay.savedResultId}`
			: '';
		return <ShareButtons urlToShare={urlToShare} />;
	};

	const collapseAndFullViews = generateCollapseAndFullViews();
	return (
		<>
			{!resultId && <SaveResults />}
			{displayShareButtons()}
			<div className='d-none d-xl-block'>
				<CardGroup>{collapseAndFullViews.fullViews}</CardGroup>
			</div>
			<div className='d-block d-xl-none'>{collapseAndFullViews.collapseViews}</div>
		</>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
