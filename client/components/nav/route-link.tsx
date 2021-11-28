import { useRouter } from 'next/router';
import { Button, Nav } from 'react-bootstrap';

type RouteLinkProps = {
	buttonText: string | JSX.Element;
	routePath: string;
	className?: string;
	isNav?: boolean;
};

const formatRoute = (routePath: string) =>
	routePath.length && routePath.charAt(0) === '/' ? routePath : `/${routePath}`;

const RouteLink: React.FC<RouteLinkProps> = ({
	buttonText,
	className = '',
	routePath,
	isNav = false
}) => {
	if (!buttonText) return null;

	const formattedRoute = formatRoute(routePath);
	const router = useRouter();
	const linkClicked = () => {
		if (router.pathname !== formattedRoute) {
			router.push(formattedRoute);
		}
	};

	return isNav ? (
		<Nav.Link className='me-md-4' href='#' eventKey={formatRoute(routePath)} onClick={linkClicked}>
			{buttonText}
		</Nav.Link>
	) : (
		<Button variant='link' className={`p-0 me-4 ${className}`} onClick={linkClicked}>
			{buttonText}
		</Button>
	);
};

export default RouteLink;
