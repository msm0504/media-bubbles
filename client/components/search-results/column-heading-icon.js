import PropTypes from 'prop-types';

import IconUtil from '../../util/icon-util';

const ColumnHeadingIcon = ({ className, column, isColumnSlant }) => (
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
				onError={event => {
					event.target.src = IconUtil.getIconUrlSecondTry(column.url);
				}}
			/>
		)}
		<span className='sr-only'>{`Search results for ${column.name}`}</span>
	</div>
);

ColumnHeadingIcon.propTypes = {
	className: PropTypes.string,
	column: PropTypes.shape({
		id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		url: PropTypes.string
	}),
	isColumnSlant: PropTypes.bool
};

ColumnHeadingIcon.defaultProps = {
	className: '',
	isColumnSlant: false
};

export default ColumnHeadingIcon;
