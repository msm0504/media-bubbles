'use client';
import { useState, useEffect, useContext, useRef, useCallback, ReactElement } from 'react';
import debounce from 'lodash.debounce';
import { Input, Pagination } from './base-ui';
import Spinner from './spinner';
import ALERT_LEVEL from '@/constants/alert-level';
import { AlertsDispatch } from '@/contexts/alerts-context';
import { useSession } from '@/lib/auth-client';
import { callApi } from '@/services/api-service';
import camelCaseToWords from '@/util/camel-case-to-words';
import type { ItemDeletedResponse, ListItem, ListResponse } from '@/types';

type DeleteFnType = (itemId: string, itemName: string) => void;
export type ListItemProps<T> = {
	item: ListItem<T>;
	fnDeleteItem: DeleteFnType;
};

type AsyncListProps<T> = {
	apiListName: string;
	apiPath: string;
	keyField: string;
	ListItemComponent: React.FC<ListItemProps<T>>;
	loginRequired?: boolean;
	LoginRequiredComponent?: React.FC;
};

type Cache<T> = {
	[name: string]: { items: { [name: number]: ListItem<T>[] }; pageCount: number };
};

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
	const cache = useRef<Cache<T>>({});

	const getListItems = useCallback(async () => {
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
			cache.current = {
				...cache.current,
				[filter]: { items: { [page]: returnedItems }, pageCount },
			};
			setItems(returnedItems);
		} else if (page >= 1) {
			cache.current = {
				...cache.current,
				[filter]: {
					items: { ...cache.current[filter].items, [page]: returnedItems },
					pageCount,
				},
			};
			setItems(returnedItems);
		} else {
			throw `Queried for page ${page} of results containing ${filter}`;
		}
		if (Object.keys(cache).length > CACHE_SIZE) {
			const { [Object.keys(cache.current)[0]]: firstItem, ...rest } = cache.current;
			cache.current = rest;
		}
		setPageCount(pageCount);
		setLoading(false);
	}, [apiPath, filter, page]);

	useEffect(() => {
		if (!loginRequired || session) {
			if (cache.current[filter]?.items[page]) {
				setItems(cache.current[filter].items[page]);
				setPageCount(cache.current[filter].pageCount);
			} else {
				getListItems();
			}
		}
	}, [loginRequired, session, page, filter, getListItems]);

	if (loginRequired && !session)
		return (
			<div className='text-primary'>
				{LoginRequiredComponent ? <LoginRequiredComponent /> : 'Log in to view this page'}
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
			cache.current = {};
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
			<label className='flex w-full flex-col items-start gap-1 sm:m-auto sm:w-xl'>
				Filter:
				<Input name='filter' onValueChange={newValue => handleSearch(newValue)} />
			</label>
			{loading ? (
				<Spinner />
			) : (
				<>
					<ul className='flex list-none flex-col gap-2'>
						{items && items.length ? (
							items.map(item => (
								<ListItemComponent
									key={item[keyField as keyof T]}
									item={item}
									fnDeleteItem={deleteItem}
								/>
							))
						) : (
							<p>{`No ${camelCaseToWords(apiListName)} found`}</p>
						)}
					</ul>
					<div className='mt-2 flex flex-row-reverse'>
						<Pagination
							count={pageCount}
							page={page}
							onChange={handleLoadPage}
							color='primary'
							showFirstButton
							showLastButton
						/>
					</div>
				</>
			)}
		</div>
	);
};

export default AsyncList;
