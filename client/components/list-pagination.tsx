import { ReactElement } from 'react';
import { Pagination } from 'react-bootstrap';

type ListPaginationProps = {
	currentPage: number;
	totalPages: number;
	maxPagesToShow: number;
	pageSelectFn: (page: number) => void;
};

const ListPagination: React.FC<ListPaginationProps> = ({
	currentPage,
	totalPages,
	maxPagesToShow,
	pageSelectFn
}) => {
	if (totalPages < 1) return null;

	const getPaginationItems = (): ReactElement => {
		if (totalPages <= maxPagesToShow) {
			return (
				<>
					{new Array(totalPages).fill(1).map((_, index) => (
						<Pagination.Item
							key={`page${index + 1}`}
							active={index + 1 === currentPage}
							onClick={() => pageSelectFn(index + 1)}
						>
							{index + 1}
						</Pagination.Item>
					))}
				</>
			);
		}

		// Based on simple pagination algorithm found here:
		// https://gist.github.com/kottenator/9d936eb3e4e3c3e02598
		const delta = Math.floor(maxPagesToShow / 2);
		const left = currentPage - delta;
		const right = currentPage + delta + 1;
		const range: number[] = [];
		let prev: number | undefined;

		for (let i = 1; i <= totalPages; i++) {
			if (i === 1 || i === totalPages || (i >= left && i < right)) {
				range.push(i);
			}
		}

		return (
			<>
				{range.map(item => {
					const itemEl = (
						<>
							{prev && prev === 1 && item - prev > 1 && (
								<Pagination.Ellipsis
									key='pageEllipsisLeft'
									onClick={() => pageSelectFn(Math.max(currentPage - maxPagesToShow, 1))}
								/>
							)}
							{prev && prev > 1 && item - prev > 1 && (
								<Pagination.Ellipsis
									key='pageEllipsisRight'
									onClick={() => pageSelectFn(Math.min(currentPage + maxPagesToShow, totalPages))}
								/>
							)}
							<Pagination.Item
								key={`page${item}`}
								active={item === currentPage}
								onClick={() => pageSelectFn(item)}
							>
								{item}
							</Pagination.Item>
						</>
					);
					prev = item;
					return itemEl;
				})}
			</>
		);
	};

	return (
		<Pagination className='float-end mt-1' aria-label='change list page being displayed'>
			<Pagination.First disabled={currentPage <= 1} onClick={() => pageSelectFn(1)} />
			<Pagination.Prev disabled={currentPage <= 1} onClick={() => pageSelectFn(currentPage - 1)} />
			{getPaginationItems()}
			<Pagination.Next
				disabled={currentPage >= totalPages}
				onClick={() => pageSelectFn(currentPage + 1)}
			/>
			<Pagination.Last
				disabled={currentPage >= totalPages}
				onClick={() => pageSelectFn(totalPages)}
			/>
		</Pagination>
	);
};

export default ListPagination;
