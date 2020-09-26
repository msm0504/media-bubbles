import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

const formatRoute = routePath =>
	routePath.length && routePath.charAt(0) === '/' ? routePath : `/${routePath}`;

const RouteLink = ({ buttonText, routePath }) => {
	if (!buttonText.length) return null;

	const router = useRouter();
	const linkClicked = () => {
		const formattedRoute = formatRoute(routePath);
		if (router.pathname !== formattedRoute) {
			router.push(formattedRoute);
		}
	};

	return (
		<Button color='link' className='p-0 mr-4' onClick={linkClicked}>
			{buttonText}
		</Button>
	);
};

RouteLink.propTypes = {
	buttonText: PropTypes.string.isRequired,
	routePath: PropTypes.string.isRequired
};

export default RouteLink;
