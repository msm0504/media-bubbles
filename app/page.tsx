import Image from 'next/image';
import Link from 'next/link';
import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/main.module.css';
import homeBackground from '../public/images/og_image.png';

type HomePageLinkProps = {
	message: string;
	routePath: string;
	srText: string;
};

const HomePageLink: React.FC<HomePageLinkProps> = ({ message, routePath, srText }) => (
	<Paper sx={{ display: 'flex', alignItems: 'center' }}>
		<Typography>{message}</Typography>
		<Button color='dark' component={Link} href={routePath}>
			<FontAwesomeIcon icon={faArrowRight} />
			<span className='sr-only'>{srText}</span>
		</Button>
	</Paper>
);

const Home: React.FC = () => (
	<Box sx={{ margin: 0, padding: 0 }}>
		<div className={styles.bgImgContainer}>
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
		<Box sx={{ background: 'transparent' }}>
			<Container maxWidth='md'>
				<Stack paddingY={8} spacing={4} alignItems='center' justifyContent='center'>
					<Typography
						className={styles.outlinedText}
						variant='h1'
						component='h1'
						fontWeight='bold'
						textAlign='center'
						color='light'
					>
						Media Bubbles
					</Typography>
					<Typography textAlign='center' fontWeight='bold' color='light'>
						{`
						In the age of social media and targeted advertising, it's easy to
						get trapped inside of our own bubbles. We only see information from sources we are already
						likely to agree with. This site provides a way out. Search for recent news from outlets
						across the spectrum, outlets you agree with ("Stay in my Bubble"), outlets you disagree with
						("Burst my Bubble"), or specific outlets of your choosing. Escape your information bubble!
					`}
					</Typography>
					<Button color='light' variant='contained' component={Link} href='/search'>
						Start Searching
					</Button>
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
				</Stack>
			</Container>
		</Box>
	</Box>
);

export default Home;
