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
				src={`${process.env.NEXT_PUBLIC_URL}/api/source-logo?id=${column.id}&url=${column.url}`}
				alt={`Logo for ${column.name}`}
			/>
		)}
		<span className='sr-only'>{`Search results for ${column.name}`}</span>
	</div>
);

export default ColumnHeadingIcon;
