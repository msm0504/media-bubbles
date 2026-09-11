'use client';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import AsyncList, { ListItemProps } from '../shared/async-list';
import { Button } from '../shared/base-ui';
import type { SavedResultSummary } from '@/types';

const SavedResultItem: React.FC<ListItemProps<SavedResultSummary>> = ({
	item: { _id, name, createdAt },
	fnDeleteItem,
}) => {
	const router = useRouter();
	return (
		<li className='flex items-center gap-2 px-2 py-1 even:bg-slate-100 dark:even:bg-slate-800'>
			<div className='grow'>
				<p>{name}</p>
				<p className='text-sm'>{`Saved at: ${new Date(createdAt).toLocaleString()}`}</p>
			</div>
			<Button
				color='info'
				variant='text'
				onClick={() => {
					router.push(`/headlines/${_id}`);
				}}
			>
				<FontAwesomeIcon
					id={`view-results-${_id}-icon`}
					aria-label={`View saved result ${name}`}
					size='lg'
					icon={faNewspaper}
				/>
			</Button>
			<Button color='error' variant='text' onClick={() => fnDeleteItem(_id, name)}>
				<FontAwesomeIcon
					id={`delete-${_id}-icon`}
					aria-label={`Delete saved result ${name}`}
					size='lg'
					icon={faTrashCan}
				/>
			</Button>
		</li>
	);
};

const LoginRequiredComponent: React.FC = () => (
	<>
		<p>Any search results you save while logged in will be shown here.</p>
		<p>Log in to view your saved search results.</p>
	</>
);

const MySavedResults: React.FC = () => (
	<AsyncList<SavedResultSummary>
		apiListName='savedResults'
		apiPath='search-result'
		keyField='_id'
		ListItemComponent={SavedResultItem}
		loginRequired
		LoginRequiredComponent={LoginRequiredComponent}
	/>
);

export default MySavedResults;
