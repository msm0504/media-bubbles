import { useRouter } from 'next/router';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

import AsyncList, { DeleteFnType } from '../async-list';
import type { SavedResultSummary } from '@/types';

type SavedResultItemProps = {
	item: SavedResultSummary;
	fnDeleteItem: DeleteFnType;
};

const SavedResultItem: React.FC<SavedResultItemProps> = ({
	item: { _id, name, createdAt },
	fnDeleteItem
}) => {
	const router = useRouter();
	return (
		<>
			<div className='d-block d-sm-inline-block'>
				<p className='m-0'>{name}</p>
				<p className='m-0'>
					<small>{`Saved at: ${new Date(createdAt).toLocaleString()}`}</small>
				</p>
			</div>
			<Button
				className='float-end d-block d-sm-inline-block'
				variant='link'
				onClick={() => fnDeleteItem(_id, name)}
			>
				<FontAwesomeIcon
					id={`delete-${_id}-icon`}
					icon={faTrashCan}
					size='lg'
					aria-label={`Delete saved result ${name}`}
				/>
			</Button>
			<Button
				className='float-end d-block d-sm-inline-block'
				variant='outline-info'
				onClick={() => {
					router.push(`/headlines/${_id}`);
				}}
			>
				View
			</Button>
		</>
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
