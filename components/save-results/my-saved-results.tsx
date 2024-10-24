'use client';
import { useRouter } from 'next/navigation';
import { Button, IconButton, ListItem, ListItemText, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

import AsyncList, { DeleteFnType } from '../shared/async-list';
import type { SavedResultSummary } from '@/types';

type SavedResultItemProps = {
	item: SavedResultSummary;
	fnDeleteItem: DeleteFnType;
};

const SavedResultItem: React.FC<SavedResultItemProps> = ({
	item: { _id, name, createdAt },
	fnDeleteItem,
}) => {
	const router = useRouter();
	return (
		<ListItem>
			<ListItemText
				primary={name}
				secondary={`Saved at: ${new Date(createdAt).toLocaleString()}`}
			/>
			<Button
				color='info'
				variant='outlined'
				onClick={() => {
					router.push(`/headlines/${_id}`);
				}}
			>
				View
			</Button>
			<IconButton
				aria-label={`Delete saved result ${name}`}
				color='primary'
				onClick={() => fnDeleteItem(_id, name)}
			>
				<FontAwesomeIcon id={`delete-${_id}-icon`} icon={faTrashCan} />
			</IconButton>
		</ListItem>
	);
};

const LoginRequiredComponent: React.FC = () => (
	<>
		<Typography>Any search results you save while logged in will be shown here.</Typography>
		<Typography>Log in to view your saved search results.</Typography>
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
