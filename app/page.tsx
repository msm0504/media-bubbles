'use client';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import homeBackground from '../public/images/og_image.png';
import { LinkButton } from '@/components/shared/base-ui';

type HomePageLinkProps = {
	message: string;
	routePath: string;
	srText: string;
};

const HomePageLink: React.FC<HomePageLinkProps> = ({ message, routePath, srText }) => (
	<div className='flex items-center rounded-xl bg-white p-3'>
		<p>{message}</p>
		<LinkButton color='neutral' variant='text' href={routePath}>
			<FontAwesomeIcon size='sm' aria-label={srText} icon={faArrowRight} />
		</LinkButton>
	</div>
);

const Home: React.FC = () => (
	<div className='m-0 flex grow flex-col p-0'>
		<div className='fixed -z-10 h-screen w-screen overflow-hidden'>
			<Image
				alt='background'
				src={homeBackground}
				quality={100}
				fill
				sizes='100vw'
				style={{
					objectFit: 'cover',
				}}
			/>
		</div>
		<div className='m-auto max-w-4xl bg-transparent px-2'>
			<div className='mb-2 flex flex-col items-center justify-center gap-4 py-8'>
				<h1 className='text-center text-7xl font-bold text-white text-shadow-outlined'>
					Media Bubbles
				</h1>
				<p className='text-center font-bold text-white'>
					{`
						In the age of social media and targeted advertising, it's easy to
						get trapped inside of our own bubbles. We only see information from sources we are already
						likely to agree with. This site provides a way out. Search for recent news from outlets
						across the spectrum, outlets you agree with ("Stay in my Bubble"), outlets you disagree with
						("Burst my Bubble"), or specific outlets of your choosing. Escape your information bubble!
					`}
				</p>
				<LinkButton className='text-lg' color='neutral' variant='outlined' href='/search'>
					Start Searching
				</LinkButton>
			</div>
			<div className='flex flex-col items-center justify-center gap-4 py-8'>
				<HomePageLink
					message='See the latest news from sources across the political spectrum.'
					routePath='/latest'
					srText='go to Latest News page'
				/>
				<HomePageLink
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
		</div>
	</div>
);

export default Home;
