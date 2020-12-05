import { useRouter } from 'next/router';
import { Button } from 'reactstrap';

import AsyncList from '../async-list';

const SavedResultItem = ({ _id, name, createdAt }) => {
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
				className='float-right d-block d-sm-inline-block'
				outline
				color='primary'
				onClick={() => {
					router.push(`/headlines/${_id}`);
				}}
			>
				View
			</Button>
		</>
	);
};

const MySavedResults = () => (
	<AsyncList
		apiGetPath='searchResult'
		apiListName='savedResults'
		keyField='_id'
		ListItemComponent={SavedResultItem}
		loginRequired
		loginRequiredMessage='Log in to view your saved search results'
	/>
);

export default MySavedResults;
