import { useRouter } from 'next/router';
import { Button, Card } from 'react-bootstrap';

type HomePageLinkProps = {
	message: string;
	routePath: string;
	srText: string;
	className?: string;
};

const HomePageLink: React.FC<HomePageLinkProps> = ({
	className = '',
	message,
	routePath,
	srText
}) => {
	const router = useRouter();

	return (
		<Card.Body
			className={`bg-white rounded-xl mb-3 mx-2 d-inline-flex align-items-center ${className}`}
		>
			<Card.Text className='fw-bold m-0'>{message}</Card.Text>
			<Button className='float-end' variant='light' onClick={() => router.push(routePath)}>
				<i className='fa-solid fa-lg fa-arrow-right' aria-hidden='true'></i>
				<span className='sr-only'>{srText}</span>
			</Button>
		</Card.Body>
	);
};

export default HomePageLink;
