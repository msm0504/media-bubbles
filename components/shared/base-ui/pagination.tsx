import { useCallback } from 'react';
import {
	faAngleLeft,
	faAngleRight,
	faAnglesLeft,
	faAnglesRight,
	faEllipsis,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from './button';
import getPaginationItems, { type PaginationItem } from './get-pagination-items';
import type { Color } from '@/styles/color-variants';

type PaginationProps = {
	boundaryCount?: number;
	color?: Color;
	count: number;
	onChange: (newPage: number) => void;
	page: number;
	showFirstButton?: boolean;
	showLastButton?: boolean;
	siblingCount?: number;
};

type PaginationIconButtonProps = Pick<PaginationProps, 'count' | 'onChange' | 'page'>;

const PaginationFirst: React.FC<PaginationIconButtonProps> = ({ onChange, page }) => (
	<Button
		className='px-3 py-4'
		color='neutral'
		variant='text'
		disabled={page <= 1}
		onClick={() => onChange(1)}
	>
		<FontAwesomeIcon aria-label='first page' icon={faAnglesLeft} size='xs' />
	</Button>
);

const PaginationPrevious: React.FC<PaginationIconButtonProps> = ({ onChange, page }) => (
	<Button
		className='px-3 py-4'
		color='neutral'
		variant='text'
		disabled={page <= 1}
		onClick={() => onChange(page - 1)}
	>
		<FontAwesomeIcon aria-label='previous page' icon={faAngleLeft} size='xs' />
	</Button>
);

const PaginationNext: React.FC<PaginationIconButtonProps> = ({ count, onChange, page }) => (
	<Button
		className='px-3 py-4'
		color='neutral'
		variant='text'
		disabled={page >= count}
		onClick={() => onChange(page + 1)}
	>
		<FontAwesomeIcon aria-label='next page' icon={faAngleRight} size='xs' />
	</Button>
);

const PaginationLast: React.FC<PaginationIconButtonProps> = ({ count, onChange, page }) => (
	<Button
		className='px-3 py-4'
		color='neutral'
		variant='text'
		disabled={page >= count}
		onClick={() => onChange(count)}
	>
		<FontAwesomeIcon aria-label='last page' icon={faAnglesRight} size='xs' />
	</Button>
);

const Pagination: React.FC<PaginationProps> = ({
	boundaryCount,
	color = 'primary',
	count,
	onChange,
	page,
	showFirstButton,
	showLastButton,
	siblingCount,
}) => {
	const items = getPaginationItems({
		boundaryCount,
		count,
		page,
		showFirstButton,
		showLastButton,
		siblingCount,
	});

	const getPaginationButton = useCallback(
		(item: PaginationItem) => {
			const isActive = item === page;
			switch (item) {
				case 'first':
					return <PaginationFirst count={count} onChange={onChange} page={page} />;
				case 'previous':
					return <PaginationPrevious count={count} onChange={onChange} page={page} />;
				case 'ellipsis':
					return <FontAwesomeIcon aria-label='more pages' icon={faEllipsis} size='xs' />;
				case 'next':
					return <PaginationNext count={count} onChange={onChange} page={page} />;
				case 'last':
					return <PaginationLast count={count} onChange={onChange} page={page} />;
				default:
					return (
						<Button
							className='px-3 py-4 text-sm'
							color={isActive ? color : 'neutral'}
							variant={isActive ? 'contained' : 'text'}
							onClick={() => onChange(item)}
						>
							{item}
						</Button>
					);
			}
		},
		[color, count, onChange, page]
	);

	// https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/bases/base/ui/pagination.tsx
	return (
		<nav role='navigation' aria-label='pagination' className='mx-auto flex w-full justify-center'>
			<ul className='flex items-center gap-0.5'>
				{items.map((item, i) => (
					<li key={`${item}-${i}`}>{getPaginationButton(item)}</li>
				))}
			</ul>
		</nav>
	);
};

export default Pagination;
