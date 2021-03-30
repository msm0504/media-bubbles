import Head from 'next/head';

const About = () => (
	<>
		<Head>
			<link rel='canonical' href={`${process.env.NEXT_PUBLIC_API_URL}/about`} />
		</Head>
		<h1 className='text-info'>About</h1>
		<p>
			I’m a center-left Democrat. Let’s just get that out of the way. Like most people who care
			about politics, I have my own views and biases. I started caring because I opposed the Iraq
			War. I will always view it as a mistake. I enjoyed The Daily Show and The Colbert Report, and
			after years of watching them point out the absurdity of Fox News, will never be able to watch
			it. I still enjoy shows that are a mix of comedy and political analysis, e.g. The Late Show,
			Last Week Tonight, and Real Time. I also check headlines and read articles on CNN’s website.
			Recently, I started listening to Pod Save America. There’s a lot more time to listen to things
			while sitting at home during a lockdown. Overall, these sources inform my view of the world.
		</p>
		<p>
			In early 2017, I saw a chart being shared on Facebook placing various news sources into
			categories of political bias. Soon after, of course, other charts were posted showing the
			“real” way the first chart should have been arranged. Seeing this led me to a question, “What
			does it mean for a source to be biased?” I feel like I’ve known for a long time that the
			so-called “mainstream media” is center-left. I know that MSNBC is liberal and Fox News is
			conservative. But what does that mean in practice? Are sources simply providing differing
			analysis on the same events? Are they elevating stories that fit with their views and burying
			or not reporting on others? Are they using different words that are meant to lead their
			readers to certain conclusions?
		</p>
		<p>
			I created this site in an attempt to answer these questions. I wanted a way to easily compare,
			side-by-side, what different sources are saying. The sources are categorized according to the
			ratings on{' '}
			<a href='https://www.allsides.com' rel='noreferrer' target='_blank'>
				AllSides.com
			</a>{' '}
			(another cool site you should check out). I generally don’t mind staying within my bubble and
			assume most others don’t either. However, we often hear about how the United States is
			becoming more polarized. I think that each side having its own sources of information fuels
			that. It’s easy to be polarized when we only have to watch and listen to our own side. How can
			we possibly engage with people on the opposite side, whichever it is for us, unless we
			understand the information they consume? That’s my hope for this site: to both highlight how
			sources express bias and show where different people’s political views come from.
		</p>
	</>
);

export default About;
