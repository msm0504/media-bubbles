import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

const formatRoute = routePath =>
	routePath.length && routePath.charAt(0) === '/' ? routePath : `/${routePath}`;

const RouteLink = ({ buttonText, className = '', routePath }) => {
	if (!buttonText) return null;

	const router = useRouter();
	const linkClicked = () => {
		const formattedRoute = formatRoute(routePath);
		if (router.pathname !== formattedRoute) {
			router.push(formattedRoute);
		}
	};

	return (
		<Button color='link' className={`p-0 me-4 ${className}`} onClick={linkClicked}>
			{buttonText}
		</Button>
	);
};

RouteLink.propTypes = {
	buttonText: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
	className: PropTypes.string,
	routePath: PropTypes.string.isRequired
};

export default RouteLink;
