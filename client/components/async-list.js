import { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CardBody, Col, FormGroup, Input, Label, ListGroup, ListGroupItem, Row } from 'reactstrap';
import debounce from 'lodash.debounce';

import UIActions from '../actions/ui-actions';
import ALERT_LEVEL from '../constants/alert-level';
import APIService from '../services/api-service';

const CACHE_SIZE = 10;

const mapStateToProps = ({ loginState }) => ({
	fbInitComplete: loginState.fbInitComplete,
	userId: loginState.fbUserInfo.userId
});

const mapDispatchToProps = {
	showAlert: UIActions.showAlert
};

const AsyncList = ({
	apiListName,
	apiPath,
	fbInitComplete,
	keyField,
	ListItemComponent,
	loginRequired,
	loginRequiredMessage,
	maxResults,
	showAlert,
	userId
}) => {
	const [items, setItems] = useState([]);
	const [hasMore, setHasMore] = useState(false);
	const filter = useRef('');
	const page = useRef(1);
	const cache = useRef({});

	useEffect(() => {
		initCache();
		if (!loginRequired || (userId && fbInitComplete)) getListItems();
	}, [loginRequired, userId, fbInitComplete]);

	const initCache = () => {
		filter.current = '';
		page.current = 1;
		cache.current = {};
	};

	if (loginRequired && !(userId && fbInitComplete))
		return (
			<CardBody className='text-info'>
				{loginRequiredMessage || 'Log in to view this page'}
			</CardBody>
		);

	async function getListItems() {
		const { [apiListName]: returnedItems, hasMore } = await APIService.callApi('get', apiPath, {
			filter: filter.current,
			page: page.current
		});
		if (page.current === 1) {
			cache.current = {
				...cache.current,
				[filter.current]: { items: returnedItems, page: page.current, hasMore }
			};
			setItems(returnedItems);
		} else if (page.current >= 1) {
			const updatedItems = items.concat(returnedItems);
			cache.current = {
				...cache.current,
				[filter.current]: { items: updatedItems, page: page.current, hasMore }
			};
			setItems(updatedItems);
		} else {
			throw `Queried for page ${page.current} of results containing ${filter.current}`;
		}
		if (Object.keys(cache.current).length > CACHE_SIZE)
			delete cache.current[Object.keys(cache.current)[0]];
		setHasMore(hasMore);
	}

	async function deleteItem(itemId, itemName) {
		const { itemDeleted } = await APIService.callApi('delete', `${apiPath}/${itemId}`);
		if (itemDeleted !== true) {
			showAlert(
				ALERT_LEVEL.danger,
				`Deleting ${itemName || itemId} failed. Please try again later.`
			);
		} else {
			showAlert(ALERT_LEVEL.success, `${itemName || itemId} deleted successfully.`);
			page.current = 1;
			cache.current = {};
			getListItems();
		}
	}

	const getOptionsFromCache = () => {
		if (cache.current[filter.current] && cache.current[filter.current].page >= page.current) {
			setItems(cache.current[filter.current].items.slice(0, maxResults * page.current));
			setHasMore(
				cache.current[filter.current].hasMore || cache.current[filter.current].page > page.current
			);
			return true;
		}
		return false;
	};

	const handleSearch = query => {
		filter.current = query;
		page.current = 1;
		if (!getOptionsFromCache()) getListItems();
	};
	const debouncedSearch = debounce(handleSearch, 300);

	const handleLoadMore = () => {
		page.current += 1;
		if (!getOptionsFromCache()) getListItems();
	};

	return (
		<>
			<Row className='mt-4'>
				<Col xs={12} md={{ size: 8, offset: 2 }} lg={{ size: 6, offset: 3 }}>
					<FormGroup className='row'>
						<Label xs={3} sm={2} for={`${apiListName}-filter`}>
							Filter:
						</Label>
						<Col xs={9} sm={10}>
							<Input
								type='text'
								name='filter'
								id={`${apiListName}-filter`}
								onChange={event => debouncedSearch(event.target.value)}
							/>
						</Col>
					</FormGroup>
				</Col>
			</Row>
			<ListGroup>
				{items.map((item, index) => (
					<ListGroupItem key={item[keyField]} color={index % 2 === 0 ? '' : 'secondary'}>
						<ListItemComponent {...item} fnDeleteItem={deleteItem} />
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
	apiListName: PropTypes.string.isRequired,
	apiPath: PropTypes.string.isRequired,
	keyField: PropTypes.string.isRequired,
	ListItemComponent: PropTypes.elementType.isRequired,
	loginRequired: PropTypes.bool,
	loginRequiredMessage: PropTypes.string,
	maxResults: PropTypes.number
};

AsyncList.defaultProps = {
	loginRequired: false,
	maxResults: 25
};

export default connect(mapStateToProps, mapDispatchToProps)(AsyncList);
