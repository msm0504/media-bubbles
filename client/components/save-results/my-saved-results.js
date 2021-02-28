import { useRouter } from 'next/router';
import { Button } from 'reactstrap';

import AsyncList from '../async-list';

const SavedResultItem = ({ _id, name, createdAt, fnDeleteItem }) => {
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
				color='link'
				onClick={() => fnDeleteItem(_id, name)}
			>
				<i
					className='fa fa-lg fa-trash-o'
					id={`delete-${_id}-icon`}
					aria-hidden='true'
					aria-label={`Delete saved result ${name}`}
				></i>
			</Button>
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
		apiListName='savedResults'
		apiPath='searchResult'
		keyField='_id'
		ListItemComponent={SavedResultItem}
		loginRequired
		loginRequiredMessage='Log in to view your saved search results'
	/>
);

export default MySavedResults;
