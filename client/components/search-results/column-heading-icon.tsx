import { InvalidEvent } from 'react';

import IconUtil from '../../util/icon-util';
import { Source } from '../../../types';

type ColumnHeadingIconProps = {
	className: string;
	column: Source;
	isColumnSlant: boolean;
};

const ColumnHeadingIcon: React.FC<ColumnHeadingIconProps> = ({
	className,
	column,
	isColumnSlant
}) => (
	<div className={`text-center ${className}`}>
		{isColumnSlant ? (
			<img
				className='bubble-img'
				src={`/images/slant-bubbles/bubble-${column.name.toLowerCase()}.png`}
				alt={`Icon for ${column.name} slant`}
			/>
		) : (
			<img
				src={IconUtil.getIconUrl(column.url)}
				alt={`Logo for ${column.name}`}
				onError={(event: InvalidEvent<HTMLImageElement>) => {
					event.target.src = IconUtil.getIconUrlSecondTry(column.url);
				}}
			/>
		)}
		<span className='sr-only'>{`Search results for ${column.name}`}</span>
	</div>
);

export default ColumnHeadingIcon;
