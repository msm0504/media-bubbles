import PropTypes from 'prop-types';

import IconUtil from '../../util/icon-util';

const ColumnHeadingIcon = ({ className, column, isColumnSlant }) =>
	isColumnSlant ? (
		<div className={`color-bubble-container ${className}`}>
			<div className={`color-bubble ${column.name.toLowerCase()}`}>
				<img
					className='bubble-img'
					src='/images/BubbleLogo.png'
					alt={`Icon for ${column.name} slant`}
				/>
			</div>
		</div>
	) : (
		<img
			className={className}
			src={IconUtil.getIconUrl(column.url)}
			alt={`Logo for ${column.name}`}
			onError={event => {
				event.target.src = IconUtil.getIconUrlSecondTry(column.url);
			}}
		/>
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
