'use client';
import { useState, useEffect, useRef, useContext, ReactElement } from 'react';
import {
	Container,
	List,
	Pagination,
	Paper,
	Stack,
	TextField,
	Typography,
	debounce,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import Spinner from './spinner';
import ALERT_LEVEL from '@/constants/alert-level';
import { AlertsDispatch } from '@/contexts/alerts-context';
import { callApi } from '@/services/api-service';
import camelCaseToWords from '@/util/camel-case-to-words';
import type { ItemDeletedResponse, ListItem, ListResponse } from '@/types';

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

const AsyncList = <T,>({
	apiListName,
	apiPath,
	keyField,
	ListItemComponent,
	loginRequired = false,
	LoginRequiredComponent,
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
			<Paper sx={{ marginTop: 4 }}>
				<Typography component='div' color='primary'>
					{LoginRequiredComponent ? <LoginRequiredComponent /> : 'Log in to view this page'}
				</Typography>
			</Paper>
		);

	const getListItems = async () => {
		setLoading(true);
		const { items: returnedItems, pageCount } = await callApi<ListResponse<T>, GetParams>(
			'get',
			apiPath,
			{
				filter: filter.current,
				page: page.current,
			}
		);
		if (page.current === 1) {
			cache.current = {
				...cache.current,
				[filter.current]: { items: { [page.current]: returnedItems }, pageCount },
			};
			setItems(returnedItems);
		} else if (page.current >= 1) {
			cache.current = {
				...cache.current,
				[filter.current]: {
					items: { ...cache.current[filter.current].items, [page.current]: returnedItems },
					pageCount,
				},
			};
			setItems(returnedItems);
		} else {
			throw `Queried for page ${page.current} of results containing ${filter.current}`;
		}
		if (Object.keys(cache.current).length > CACHE_SIZE)
			delete cache.current[Object.keys(cache.current)[0]];
		setPageCount(pageCount);
		setLoading(false);
	};

	const deleteItem = async (itemId: string, itemName: string) => {
		const { itemDeleted } = await callApi<ItemDeletedResponse>('delete', `${apiPath}/${itemId}`);
		if (itemDeleted !== true) {
			showAlert(
				ALERT_LEVEL.warning,
				`Deleting ${itemName || itemId} failed. Please try again later.`
			);
		} else {
			showAlert(ALERT_LEVEL.success, `${itemName || itemId} deleted successfully.`);
			page.current = 1;
			cache.current = {};
			getListItems();
		}
	};

	const getItemsFromCache = () => {
		if (cache.current[filter.current]?.items[page.current]) {
			setItems(cache.current[filter.current].items[page.current]);
			setPageCount(cache.current[filter.current].pageCount);
			return true;
		}
		return false;
	};

	const handleSearch = debounce((query: string) => {
		filter.current = query;
		page.current = 1;
		if (!getItemsFromCache()) getListItems();
	}, 300);

	const handleLoadPage = (_event: React.ChangeEvent<unknown>, selectedPage: number) => {
		page.current = selectedPage;
		if (!getItemsFromCache()) getListItems();
	};

	return (
		<>
			<Stack direction='row' justifyContent='center'>
				<Container maxWidth='sm' component={Paper}>
					<TextField
						fullWidth
						name='filter'
						onChange={event => handleSearch(event.target.value)}
						label='Filter:'
					/>
				</Container>
			</Stack>
			{loading ? (
				<Spinner />
			) : (
				<Paper>
					<List>
						{items && items.length ? (
							items.map(item => (
								<ListItemComponent
									key={item[keyField as keyof T]}
									item={item}
									fnDeleteItem={deleteItem}
								/>
							))
						) : (
							<Typography color='primary'>{`No ${camelCaseToWords(apiListName)} found`}</Typography>
						)}
					</List>
					<Stack direction='row-reverse'>
						<Pagination
							count={pageCount}
							page={page.current}
							onChange={handleLoadPage}
							variant='outlined'
							shape='rounded'
							color='primary'
							showFirstButton
							showLastButton
						/>
					</Stack>
				</Paper>
			)}
		</>
	);
};

export default AsyncList;
