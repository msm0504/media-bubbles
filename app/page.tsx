'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
import { Button, Paper } from '@/components/shared/base-ui';

type HomePageLinkProps = {
	message: string;
	routePath: string;
	srText: string;
};

const HomePageLink: React.FC<HomePageLinkProps> = ({ message, routePath, srText }) => (
	<div className='flex items-center rounded-xl bg-white p-3'>
		<p>{message}</p>
		<Button color='neutral' variant='text' href={routePath}>
			<FontAwesomeIcon size='sm' aria-label={srText} icon={faArrowRightLong} />
		</Button>
	</div>
);

const Home: React.FC = () => (
	<div className='m-auto grid max-w-6xl grid-cols-1 gap-4 px-2 md:grid-cols-2'>
		<Paper className='mb-2 flex flex-col justify-center gap-4 py-8'>
			<h2 className='text-5xl font-extrabold'>
				See the{' '}
				<span className='bg-linear-[100deg] from-info via-primary via-48% to-error bg-clip-text text-transparent'>
					whole story.
				</span>
				<br />
				Not just one side.
			</h2>
			<p className='text-slate-700'>
				{`
						In the age of social media and targeted advertising, it's easy to
						get trapped inside of our own bubbles. We only see information from sources we are already
						likely to agree with. This site provides a way out. Search for recent news from outlets
						across the spectrum, outlets you agree with ("Stay in my Bubble"), outlets you disagree with
						("Burst my Bubble"), or specific outlets of your choosing. Escape your information bubble!
					`}
			</p>
			<div className='flex flex-row gap-2'>
				<Button className='grow-2' color='neutral' variant='contained' href='/search'>
					Explore the headlines
					<FontAwesomeIcon size='2xs' icon={faArrowRightLong} />
				</Button>
				<Button className='grow' color='neutral' variant='text' href='/about'>
					Learn how it works
					<FontAwesomeIcon size='2xs' icon={faArrowRightLong} />
				</Button>
			</div>
		</Paper>
		<Paper className='flex flex-col items-center justify-center gap-4 py-8'>
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
		</Paper>
	</div>
);

export default Home;
