import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CardBody, Col, FormGroup, Input, Label, ListGroup, ListGroupItem, Row } from 'reactstrap';
import debounce from 'lodash.debounce';

import APIService from '../services/api-service';

const CACHE_SIZE = 10;
const MAX_RESULTS = 25;

let filter;
let page;
let cache;
const initCache = () => {
	filter = '';
	page = 1;
	cache = {};
};

const mapStateToProps = ({ loginState }) => ({
	fbInitComplete: loginState.fbInitComplete,
	userId: loginState.fbUserInfo.userId
});

const AsyncList = ({
	apiGetPath,
	apiListName,
	fbInitComplete,
	ListItemComponent,
	loginRequired,
	loginRequiredMessage,
	userId
}) => {
	if (loginRequired && !(userId && fbInitComplete))
		return (
			<CardBody className='text-info'>
				{loginRequiredMessage || 'Log in to view this page'}
			</CardBody>
		);

	const [items, setItems] = useState([]);
	const [hasMore, setHasMore] = useState(false);

	async function getSavedResults() {
		const { [apiListName]: returnedItems, hasMore } = await APIService.callApi('get', apiGetPath, {
			filter,
			page
		});
		if (page === 1) {
			cache[filter] = { items: returnedItems, page, hasMore };
			setItems(returnedItems);
		} else if (page >= 1) {
			const updatedItems = items.concat(returnedItems);
			cache[filter] = { items: updatedItems, page, hasMore };
			setItems(updatedItems);
		} else {
			throw `Queried for page ${page} of results containing ${filter}`;
		}
		if (Object.keys(cache).length > CACHE_SIZE) delete cache[Object.keys(cache)[0]];
		setHasMore(hasMore);
	}

	const getOptionsFromCache = () => {
		if (cache[filter] && cache[filter].page >= page) {
			setItems(cache[filter].items.slice(0, MAX_RESULTS * page));
			setHasMore(cache[filter].hasMore || cache[filter].page > page);
			return true;
		}
		return false;
	};

	const handleSearch = query => {
		filter = query;
		page = 1;
		if (!getOptionsFromCache()) getSavedResults();
	};
	const debouncedSearch = debounce(handleSearch, 300);

	const handleLoadMore = () => {
		page += 1;
		if (!getOptionsFromCache()) getSavedResults();
	};

	useEffect(() => {
		initCache();
		if (!loginRequired || (userId && fbInitComplete)) getSavedResults();
	}, [userId]);

	return (
		<>
			<Row className='mt-4'>
				<Col xs={12} md={{ size: 8, offset: 2 }} lg={{ size: 6, offset: 3 }}>
					<FormGroup className='row'>
						<Label xs={3} sm={2} for='my-results-filter'>
							Filter:
						</Label>
						<Col xs={9} sm={10}>
							<Input
								type='text'
								name='filter'
								id='my-results-filter'
								onChange={event => debouncedSearch(event.target.value)}
							/>
						</Col>
					</FormGroup>
				</Col>
			</Row>
			<ListGroup>
				{items.map((item, index) => (
					<ListGroupItem key={item._id} color={index % 2 === 0 ? '' : 'secondary'}>
						<ListItemComponent {...item} />
					</ListGroupItem>
				))}
				{hasMore && (
					<ListGroupItem
						className='text-center'
						color='info'
						tag='button'
						action
						onClick={handleLoadMore}
					>
						Load More
					</ListGroupItem>
				)}
			</ListGroup>
		</>
	);
};

AsyncList.propTypes = {
	apiGetPath: PropTypes.string.isRequired,
	apiListName: PropTypes.string.isRequired,
	ListItemComponent: PropTypes.elementType.isRequired,
	loginRequired: PropTypes.bool,
	loginRequiredMessage: PropTypes.string
};

AsyncList.defaultProps = {
	loginRequired: false
};

export default connect(mapStateToProps, null)(AsyncList);
