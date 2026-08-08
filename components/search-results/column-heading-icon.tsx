import Image from 'next/image';
import type { Source } from '@/types';
import styles from '@/styles/search-results.module.css';

type ColumnHeadingIconProps = {
	column: Source;
	isColumnSlant: boolean;
};

const ColumnHeadingIcon: React.FC<ColumnHeadingIconProps> = ({ column, isColumnSlant }) => (
	<div className='m-2 block text-center'>
		{isColumnSlant ? (
			<Image
				className={styles.bubbleImg}
				src={`/images/slant-bubbles/bubble-${column.name.toLowerCase()}.png`}
				alt={`Icon for ${column.name} slant`}
				width={100}
				height={100}
			/>
		) : (
			<Image
				className={styles.sourceLogo}
				src={`/api/source-logo?id=${column.id}`}
				alt={`Logo for ${column.name}`}
				width={100}
				height={100}
			/>
		)}
	</div>
);

export default ColumnHeadingIcon;
