import { useRouter } from 'next/router';
import { Button } from 'react-bootstrap';

import HomePageLink from '../client/components/nav/home-page-link';

const Home: React.FC = () => {
	const router = useRouter();

	return (
		<>
			<div
				className='d-flex flex-column align-items-center justify-content-end'
				style={{ minHeight: '500px' }}
			>
				<h1 className='heading-text display-1 fw-bold text-light mt-6'>Media Bubbles</h1>
				<p className='px-4 text-center fw-bold text-light' style={{ maxWidth: '42rem' }}>
					{`
				In the age of social media and targeted advertising, it's easy to
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
			<div className='d-flex flex-column align-items-center'>
				<HomePageLink
					className='mt-5'
					message='Learn about our mission and how we got started.'
					routePath='/about'
					srText='go to About page'
				/>
				<HomePageLink
					message='Have a suggestion or question for us? Send us a message.'
					routePath='/contact'
					srText='go to Contact Us page'
				/>
			</div>
		</>
	);
};

export default Home;
