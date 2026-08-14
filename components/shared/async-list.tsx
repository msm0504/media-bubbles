'use client';
import { useState, useEffect, useContext, ReactElement } from 'react';
import { Input } from '@base-ui/react';
import debounce from 'lodash.debounce';
import { Pagination } from './base-ui';
import Spinner from './spinner';
import ALERT_LEVEL from '@/constants/alert-level';
import { AlertsDispatch } from '@/contexts/alerts-context';
import { useSession } from '@/lib/auth-client';
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
	const [filter, setFilter] = useState('');
	const [page, setPage] = useState(1);
	const [cache, setCache] = useState<Cache<T>>({});

	const getListItems = async () => {
		setLoading(true);
		const { items: returnedItems, pageCount } = await callApi<ListResponse<T>, GetParams>(
			'get',
			apiPath,
			{
				filter: filter,
				page: page,
			}
		);
		if (page === 1) {
			setCache({
				...cache,
				[filter]: { items: { [page]: returnedItems }, pageCount },
			});
			setItems(returnedItems);
		} else if (page >= 1) {
			setCache({
				...cache,
				[filter]: {
					items: { ...cache[filter].items, [page]: returnedItems },
					pageCount,
				},
			});
			setItems(returnedItems);
		} else {
			throw `Queried for page ${page} of results containing ${filter}`;
		}
		if (Object.keys(cache).length > CACHE_SIZE) {
			const { [Object.keys(cache)[0]]: _firstItem, ...rest } = cache;
			setCache(rest);
		}
		setPageCount(pageCount);
		setLoading(false);
	};

	useEffect(() => {
		if (!loginRequired || session) {
			if (cache[filter]?.items[page]) {
				setItems(cache[filter].items[page]);
				setPageCount(cache[filter].pageCount);
			} else {
				getListItems();
			}
		}
	}, [loginRequired, session, page, filter]);

	if (loginRequired && !session)
		return (
			<div className='mt-4 rounded-xl bg-white p-4'>
				<div className='text-primary'>
					{LoginRequiredComponent ? <LoginRequiredComponent /> : 'Log in to view this page'}
				</div>
			</div>
		);

	const deleteItem = async (itemId: string, itemName: string) => {
		const { itemDeleted } = await callApi<ItemDeletedResponse>('delete', `${apiPath}/${itemId}`);
		if (itemDeleted !== true) {
			showAlert(
				ALERT_LEVEL.warning,
				`Deleting ${itemName || itemId} failed. Please try again later.`
			);
		} else {
			showAlert(ALERT_LEVEL.success, `${itemName || itemId} deleted successfully.`);
			setPage(1);
			setCache({});
			getListItems();
		}
	};

	const handleSearch = debounce((query: string) => {
		setFilter(query);
		setPage(1);
	}, 300);

	const handleLoadPage = (selectedPage: number) => {
		setPage(selectedPage);
	};

	return (
		<div className='flex flex-col gap-4'>
			<label className='flex w-full flex-col items-start gap-1 rounded-xl bg-white p-4 sm:m-auto sm:w-xl'>
				Filter:
				<Input name='filter' onValueChange={newValue => handleSearch(newValue)} />
			</label>
			{loading ? (
				<Spinner />
			) : (
				<div className='rounded-xl bg-white p-4'>
					<ul className='list-none'>
						{items && items.length ? (
							items.map(item => (
								<ListItemComponent
									key={item[keyField as keyof T]}
									item={item}
									fnDeleteItem={deleteItem}
								/>
							))
						) : (
							<p className='text-primary'>{`No ${camelCaseToWords(apiListName)} found`}</p>
						)}
					</ul>
					<div className='flex flex-row-reverse'>
						<Pagination
							count={pageCount}
							page={page}
							onChange={handleLoadPage}
							color='primary'
							showFirstButton
							showLastButton
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default AsyncList;
