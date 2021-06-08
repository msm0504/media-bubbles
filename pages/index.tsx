import { useRouter } from 'next/router';
import { Button } from 'react-bootstrap';

const Home: React.FC = () => {
	const router = useRouter();

	return (
		<div
			className='d-flex flex-column h-100 align-items-center justify-content-center text-light'
			style={{ minHeight: '600px' }}
		>
			<h1 className='heading-text display-1 fw-bold'>Media Bubbles</h1>
			<p className='px-4 text-center fw-bold' style={{ maxWidth: '42rem' }}>
				{`
				Welcome to Media Bubbles! In the age of social media and targeted advertising, it's easy to
				get trapped inside of our own bubbles. We only see information from sources we are already
				likely to agree with. This site provides a way out. Search for recent news from outlets
				across the spectrum, outlets you agree with ("Stay in my Bubble"), outlets you disagree with
				("Burst my Bubble"), or specific outlets of your choosing. Escape your information bubble!
				`}
			</p>
			<p>
				<Button className='p-3' variant='light' onClick={() => router.push('/search')}>
					Start Searching
				</Button>
			</p>
		</div>
	);
};

export default Home;
