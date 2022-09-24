import { useState, useEffect, useRef, useContext, ReactElement } from 'react';
import { Card, Col, Form, ListGroup, Row } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import debounce from 'lodash.debounce';

import ListPagination from './list-pagination';
import Spinner from './spinner';
import ALERT_LEVEL from '../constants/alert-level';
import { AlertsDispatch } from '../contexts/alerts-context';
import { callApi } from '../services/api-service';
import camelCaseToWords from '../util/camel-case-to-words';
import { ItemDeletedResponse, ListItem, ListResponse } from '../../types';

export type DeleteFnType = (itemId: string, itemName: string) => void;
interface ListItemProps<T> {
	item: ListItem<T>;
	fnDeleteItem: DeleteFnType;
}

interface AsyncListProps<T> {
	apiListName: string;
	apiPath: string;
	keyField: string;
	ListItemComponent: React.FC<ListItemProps<T>>;
	loginRequired?: boolean;
	LoginRequiredComponent?: React.FC;
}

interface Cache<T> {
	[name: string]: { items: { [name: number]: ListItem<T>[] }; pageCount: number };
}

type GetParams = {
	filter: string;
	page: number;
};

const CACHE_SIZE = 10;
const MAX_PAGES = 3;

const AsyncList = <T,>({
	apiListName,
	apiPath,
	keyField,
	ListItemComponent,
	loginRequired = false,
	LoginRequiredComponent
}: AsyncListProps<T>): ReactElement => {
	const showAlert = useContext(AlertsDispatch);
	const { data: session } = useSession();
	const [items, setItems] = useState<ListItem<T>[]>([]);
	const [pageCount, setPageCount] = useState(0);
	const [loading, setLoading] = useState(false);
	const filter = useRef('');
	const page = useRef(1);
	const cache = useRef<Cache<T>>({});

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
		setLoading(true);
		const { items: returnedItems, pageCount } = await callApi<ListResponse<T>, GetParams>(
			'get',
			apiPath,
			{
				filter: filter.current,
				page: page.current
			}
		);
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
		setLoading(false);
	}

	async function deleteItem(itemId: string, itemName: string) {
		const { itemDeleted } = await callApi<ItemDeletedResponse>('delete', `${apiPath}/${itemId}`);
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

	const getItemsFromCache = () => {
		if (cache.current[filter.current]?.items[page.current]) {
			setItems(cache.current[filter.current].items[page.current]);
			setPageCount(cache.current[filter.current].pageCount);
			return true;
		}
		return false;
	};

	const handleSearch = (query: string) => {
		filter.current = query;
		page.current = 1;
		if (!getItemsFromCache()) getListItems();
	};
	const debouncedSearch = debounce(handleSearch, 300);

	const handleLoadPage = (selectedPage: number) => {
		page.current = selectedPage;
		if (!getItemsFromCache()) getListItems();
	};

	return (
		<>
			<Row className='mt-4'>
				<Col xs={{ span: 10, offset: 1 }} lg={{ span: 8, offset: 2 }}>
					<Form.Group className='row mb-3 align-items-center'>
						<Col xs={2} sm={1} lg={2}>
							<Form.Label className='float-end text-center' htmlFor={`${apiListName}-filter`}>
								Filter:
							</Form.Label>
						</Col>
						<Col xs={8} sm={9} lg={6}>
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
			{loading ? (
				<Spinner />
			) : (
				<ListGroup as='ul'>
					{items && items.length ? (
						items.map((item, index) => (
							<ListGroup.Item
								key={item[keyField as keyof T]}
								as='li'
								variant={index % 2 === 0 ? '' : 'secondary'}
								className={
									index === 0
										? 'rounded-top-xl'
										: index === items.length - 1
										? 'rounded-bottom-xl'
										: ''
								}
							>
								<ListItemComponent item={item} fnDeleteItem={deleteItem} />
							</ListGroup.Item>
						))
					) : (
						<Card.Body className='text-primary bg-white rounded-xl'>{`No ${camelCaseToWords(
							apiListName
						)} found`}</Card.Body>
					)}
				</ListGroup>
			)}
			<ListPagination
				currentPage={page.current}
				totalPages={pageCount}
				maxPagesToShow={MAX_PAGES}
				pageSelectFn={handleLoadPage}
			/>
		</>
	);
};

export default AsyncList;
