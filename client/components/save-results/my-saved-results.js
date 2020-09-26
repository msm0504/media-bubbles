import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import {
	Button,
	CardBody,
	Col,
	FormGroup,
	Input,
	Label,
	ListGroup,
	ListGroupItem,
	Row
} from 'reactstrap';
import debounce from 'lodash.debounce';

import APIService from '../../services/api-service';

const CACHE_SIZE = 10;
const MAX_RESULTS = 25;

let filter;
let page;
let cache;
const initCache = () => {
	filter = '';
	page = 1;
	cache = {};
};

const mapStateToProps = ({ loginState }) => ({
	fbInitComplete: loginState.fbInitComplete,
	userId: loginState.fbUserId
});

const MySavedResults = ({ fbInitComplete, userId }) => {
	if (!(userId && fbInitComplete))
		return <CardBody className='text-info'>{'Log in to view your saved search results'}</CardBody>;

	const [options, setOptions] = useState([]);
	const [hasMore, setHasMore] = useState(false);
	const router = useRouter();

	async function getSavedResults() {
		const { savedResults: returnedOptions, hasMore } = await APIService.callApi(
			'get',
			'searchResult',
			{ filter, page }
		);
		if (page === 1) {
			cache[filter] = { options: returnedOptions, page, hasMore };
			setOptions(returnedOptions);
		} else if (page >= 1) {
			const updatedOptions = options.concat(returnedOptions);
			cache[filter] = { options: updatedOptions, page, hasMore };
			setOptions(updatedOptions);
		} else {
			throw `Queried for page ${page} of results containing ${filter}`;
		}
		if (Object.keys(cache).length > CACHE_SIZE) delete cache[Object.keys(cache)[0]];
		setHasMore(hasMore);
	}

	const getOptionsFromCache = () => {
		if (cache[filter] && cache[filter].page >= page) {
			setOptions(cache[filter].options.slice(0, MAX_RESULTS * page));
			setHasMore(cache[filter].hasMore || cache[filter].page > page);
			return true;
		}
		return false;
	};

	const handleSearch = query => {
		filter = query;
		page = 1;
		if (!getOptionsFromCache()) getSavedResults();
	};
	const debouncedSearch = debounce(handleSearch, 300);

	const handleLoadMore = () => {
		page += 1;
		if (!getOptionsFromCache()) getSavedResults();
	};

	useEffect(() => {
		initCache();
		getSavedResults();
	}, []);

	return (
		<>
			<Row className='mt-4'>
				<Col xs={12} md={{ size: 8, offset: 2 }} lg={{ size: 6, offset: 3 }}>
					<FormGroup className='row'>
						<Label xs={3} sm={2} for='my-results-filter'>
							Filter:
						</Label>
						<Col xs={9} sm={10}>
							<Input
								type='text'
								name='filter'
								id='my-results-filter'
								onChange={event => debouncedSearch(event.target.value)}
							/>
						</Col>
					</FormGroup>
				</Col>
			</Row>
			<ListGroup>
				{options.map((option, index) => (
					<ListGroupItem key={option._id} color={index % 2 === 0 ? '' : 'secondary'}>
						<div className='d-block d-sm-inline-block'>
							<p className='m-0'>{option.name}</p>
							<p className='m-0'>
								<small>{`Saved at: ${new Date(option.createdAt).toLocaleString()}`}</small>
							</p>
						</div>
						<Button
							className='float-right d-block d-sm-inline-block'
							outline
							color='primary'
							onClick={() => {
								router.push(`/headlines/${option._id}`);
							}}
						>
							View
						</Button>
					</ListGroupItem>
				))}
				{hasMore && (
					<ListGroupItem
						className='text-center'
						color='info'
						tag='button'
						action
						onClick={handleLoadMore}
					>
						Load More
					</ListGroupItem>
				)}
			</ListGroup>
		</>
	);
};

export default connect(mapStateToProps, null)(MySavedResults);
