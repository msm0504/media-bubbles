import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Nav } from 'react-bootstrap';

type RouteLinkProps = {
	buttonText: string | JSX.Element;
	routePath: string;
	className?: string;
	isNav?: boolean;
};

const RouteLink: React.FC<RouteLinkProps> = ({
	buttonText,
	className = '',
	routePath,
	isNav = false
}) => {
	if (!buttonText) return null;

	const router = useRouter();
	const linkClicked = () => {
		if (router.pathname !== routePath) {
			router.push(routePath);
		}
	};

	return isNav ? (
		<Nav.Link as={Link} className='me-md-4' href={routePath} eventKey={routePath}>
			{buttonText}
		</Nav.Link>
	) : (
		<Button variant='link' className={`p-0 me-4 ${className}`} onClick={linkClicked}>
			{buttonText}
		</Button>
	);
};

export default RouteLink;
