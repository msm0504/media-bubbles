import type { Metadata } from 'next';
import Link from 'next/link';
import { Paper, Stack, Typography } from '@mui/material';

export const metadata: Metadata = {
	title: 'About - Media Bubbles',
	alternates: {
		canonical: `${process.env.NEXT_PUBLIC_URL}/about`,
	},
};

const About: React.FC = () => (
	<>
		<Typography component='h2' variant='h3' color='info' marginBottom={2} fontWeight='bold'>
			About
		</Typography>
		<Paper>
			<Stack spacing={4}>
				<Typography component='h3' variant='h4' fontWeight='bold'>
					Our Mission
				</Typography>
				<Typography>
					{`An accepted truth: contemporary society is increasingly polarized. The common explanation is
				the media people consume is biased. However, we believe media bias has existed since the
				media’s inception. The difference today is how people consume media. Prior to cable and the
				internet, people read newspapers while eating breakfast at their kitchen tables. They
				watched a handful of broadcast television stations while lounging in their living rooms.
				Although people within a certain city or town could have different political views, they
				most likely read and heard similar news. In today’s world, with cable news and social media,
				people living in the same place could consume news from a wide range of sources, all with
				completely different biases. Instead of disagreeing on how best to respond to current
				events, people now disagree on the reality of current events themselves. This situation is
				no accident. Cable news networks and social media companies make money through engagement.
				People gravitate towards media they agree with; at the same time, it is in a company’s best
				interest to show its audience news they will agree with.`}
				</Typography>
				<Typography>
					{`Our goal at Media Bubbles is to afford people the opportunity to see outside of these filter
				bubbles. Instead of pining for a "simpler time", we believe society will need to adapt to
				the current media landscape. We provide an easy-to-use search function to sort news
				headlines from various sources and political biases in one streamlined place. A visual of
				news "across the spectrum" presents users a better snapshot of events under various filters.
				Media companies will have to compete with each other instead of isolating their audiences.
				Try out our `}
					<Link href='/search'>search tool</Link>
					{` to see for yourself. We hope this will be the first step towards living in a shared reality.`}
				</Typography>
				<Typography component='h3' variant='h4' fontWeight='bold'>
					How We Got Started
				</Typography>
				<Typography>
					{`Around 2017, we noticed a media bias chart being shared on social media, placing various
				news sources into categories of political bias. Soon after, of course, other charts were
				posted showing the "correct" way the first chart should have been arranged. Seeing this led
				us to a question, "What does it mean for a source to be biased?" By that time, it seemed
				understood that the major broadcast networks were center-left, MSNBC is liberal, and Fox
				News is conservative. But what does that mean in practice? Are sources simply providing
				differing analysis on the same events? Are they elevating stories that fit with their views
				and burying or not reporting on others? Are they using different words that are meant to
				lead their readers to certain conclusions? This site was created as a way to compare these
				various news sources and highlight how they each express bias.`}
				</Typography>
			</Stack>
		</Paper>
	</>
);

export default About;
