import Image from 'next/image';
import type { Source } from '@/types';

type ColumnHeadingIconProps = {
	column: Source;
	isColumnSlant: boolean;
};

const ColumnHeadingIcon: React.FC<ColumnHeadingIconProps> = ({ column, isColumnSlant }) => (
	<div className='m-2 block text-center'>
		{isColumnSlant ? (
			<Image
				className='h-25 w-auto rounded-[50%]'
				src={`/images/slant-bubbles/bubble-${column.name.toLowerCase()}.png`}
				alt={`Icon for ${column.name} slant`}
				width={100}
				height={100}
			/>
		) : (
			<Image
				className='h-25 w-auto'
				src={`/api/source-logo?id=${column.id}`}
				alt={`Logo for ${column.name}`}
				width={100}
				height={100}
			/>
		)}
	</div>
);

export default ColumnHeadingIcon;
