import { Button } from 'reactstrap';
import { useRouter } from 'next/router';

const BackButton = ({ className }) => {
	const router = useRouter();

	return (
		<Button
			outline
			className={`d-inline-block ${className || ''}`}
			color='info'
			size='lg'
			onClick={router.back}
		>
			<strong>Back</strong>
		</Button>
	);
};

export default BackButton;
