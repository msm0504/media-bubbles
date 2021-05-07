import { useState, useEffect, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Form, ListGroup, Pagination, Row } from 'react-bootstrap';
import { useSession } from 'next-auth/client';
import debounce from 'lodash.debounce';

import ALERT_LEVEL from '../constants/alert-level';
import { AlertsDispatch } from '../contexts/alerts-context';
import { callApi } from '../services/api-service';
import camelCaseToWords from '../util/camel-case-to-words';

const CACHE_SIZE = 10;

const AsyncList = ({
	apiListName,
	apiPath,
	keyField,
	ListItemComponent,
	loginRequired,
	LoginRequiredComponent
}) => {
	const showAlert = useContext(AlertsDispatch);
	const [session] = useSession();
	const [items, setItems] = useState([]);
	const [pageCount, setPageCount] = useState(0);
	const filter = useRef('');
	const page = useRef(1);
	const cache = useRef({});

	useEffect(() => {
		initCache();
		if (!loginRequired || session) getListItems();
	}, [loginRequired, session]);

	const initCache = () => {
		filter.current = '';
		page.current = 1;
		cache.current = {};
	};

	if (loginRequired && !session)
		return (
			<Card.Body className='text-primary bg-white rounded-xl mt-4'>
				{LoginRequiredComponent ? <LoginRequiredComponent /> : 'Log in to view this page'}
			</Card.Body>
		);

	async function getListItems() {
		const { [apiListName]: returnedItems, pageCount } = await callApi('get', apiPath, {
			filter: filter.current,
			page: page.current
		});
		if (page.current === 1) {
			cache.current = {
				...cache.current,
				[filter.current]: { items: { [page.current]: returnedItems }, pageCount }
			};
			setItems(returnedItems);
		} else if (page.current >= 1) {
			cache.current = {
				...cache.current,
				[filter.current]: {
					items: { ...cache.current[filter.current].items, [page.current]: returnedItems },
					pageCount
				}
			};
			setItems(returnedItems);
		} else {
			throw `Queried for page ${page.current} of results containing ${filter.current}`;
		}
		if (Object.keys(cache.current).length > CACHE_SIZE)
			delete cache.current[Object.keys(cache.current)[0]];
		setPageCount(pageCount);
	}

	async function deleteItem(itemId, itemName) {
		const { itemDeleted } = await callApi('delete', `${apiPath}/${itemId}`);
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
		if (cache.current[filter.current]?.items[page.current]) {
			setItems(cache.current[filter.current].items[page.current]);
			setPageCount(cache.current[filter.current].pageCount);
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

	const handleLoadPage = selectedPage => {
		page.current = selectedPage;
		if (!getOptionsFromCache()) getListItems();
	};

	return (
		<>
			<Row className='mt-4'>
				<Col xs={12} md={{ size: 8, offset: 2 }} lg={{ size: 6, offset: 3 }}>
					<Form.Group className='row'>
						<Form.Label xs={3} sm={2} htmlFor={`${apiListName}-filter`}>
							Filter:
						</Form.Label>
						<Col xs={9} sm={10}>
							<Form.Control
								type='text'
								name='filter'
								id={`${apiListName}-filter`}
								onChange={event => debouncedSearch(event.target.value)}
							/>
						</Col>
					</Form.Group>
				</Col>
			</Row>
			<ListGroup>
				{items && items.length ? (
					items.map((item, index) => (
						<ListGroup.Item
							key={item[keyField]}
							variant={index % 2 === 0 ? '' : 'secondary'}
							className={
								index === 0
									? 'rounded-top-xl'
									: index === items.length - 1
									? 'rounded-bottom-xl'
									: ''
							}
						>
							<ListItemComponent {...item} fnDeleteItem={deleteItem} />
						</ListGroup.Item>
					))
				) : (
					<Card.Body className='text-primary bg-white rounded-xl'>{`No ${camelCaseToWords(
						apiListName
					)} found`}</Card.Body>
				)}
				{pageCount ? (
					<Pagination listClassName='float-end mt-1' aria-label='change list page being displayed'>
						<Pagination.First disabled={page.current <= 1} onClick={() => handleLoadPage(1)} />
						<Pagination.Prev
							disabled={page.current <= 1}
							onClick={() => handleLoadPage(page.current - 1)}
						/>
						{new Array(pageCount).fill(1).map((_, index) => (
							<Pagination.Item
								key={`page${index + 1}`}
								active={index + 1 === page.current}
								onClick={() => handleLoadPage(index + 1)}
							>
								{index + 1}
							</Pagination.Item>
						))}
						<Pagination.Next
							disabled={page.current >= pageCount}
							onClick={() => handleLoadPage(page.current + 1)}
						/>
						<Pagination.Last
							disabled={page.current >= pageCount}
							onClick={() => handleLoadPage(pageCount)}
						/>
					</Pagination>
				) : null}
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
	LoginRequiredComponent: PropTypes.elementType
};

AsyncList.defaultProps = {
	loginRequired: false
};

export default AsyncList;
