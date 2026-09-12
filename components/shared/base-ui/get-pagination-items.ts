type GetPaginationItemsProps = {
	boundaryCount?: number;
	count: number;
	page: number;
	showFirstButton?: boolean;
	showLastButton?: boolean;
	siblingCount?: number;
};

export type PaginationItem = number | 'first' | 'previous' | 'last' | 'next' | 'ellipsis';

const range = (start: number, end: number) => {
	const length = end - start + 1;
	return Array.from({ length }, (_, i) => start + i);
};

// https://github.com/mui/material-ui/blob/master/packages/mui-material/src/usePagination/usePagination.js
const getPaginationItems = ({
	boundaryCount = 1,
	count,
	page,
	showFirstButton = false,
	showLastButton = false,
	siblingCount = 1,
}: GetPaginationItemsProps): PaginationItem[] => {
	const startPages = range(1, Math.min(boundaryCount, count));
	const endPages = range(Math.max(count - boundaryCount + 1, boundaryCount + 1), count);

	const siblingsStart = Math.max(
		Math.min(
			// Natural start
			page - siblingCount,
			// Lower boundary when page is high
			count - boundaryCount - siblingCount * 2 - 1
		),
		// Greater than startPages
		boundaryCount + 2
	);

	const siblingsEnd = Math.min(
		Math.max(
			// Natural end
			page + siblingCount,
			// Upper boundary when page is low
			boundaryCount + siblingCount * 2 + 2
		),
		// Less than endPages
		count - boundaryCount - 1
	);

	// Basic list of items to render
	// for example itemList = ['first', 'previous', 1, 'ellipsis', 4, 5, 6, 'ellipsis', 10, 'next', 'last']
	return [
		...(showFirstButton ? (['first'] as PaginationItem[]) : []),
		...(['previous'] as PaginationItem[]),
		...startPages,

		// Start ellipsis
		...(siblingsStart > boundaryCount + 2
			? (['ellipsis'] as PaginationItem[])
			: boundaryCount + 1 < count - boundaryCount
				? ([boundaryCount + 1] as PaginationItem[])
				: []),

		// Sibling pages
		...range(siblingsStart, siblingsEnd),

		// End ellipsis
		...(siblingsEnd < count - boundaryCount - 1
			? (['ellipsis'] as PaginationItem[])
			: count - boundaryCount > boundaryCount
				? ([count - boundaryCount] as PaginationItem[])
				: []),

		...endPages,
		...(['next'] as PaginationItem[]),
		...(showLastButton ? (['last'] as PaginationItem[]) : []),
	];
};

export default getPaginationItems;
