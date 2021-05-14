import Head from 'next/head';
import { useRouter } from 'next/router';
import { Provider } from 'next-auth/client';

import Header from '../client/components/header';
import Footer from '../client/components/footer';
import TopNavbar from '../client/components/nav/top-navbar';
import { AppProviders } from '../client/contexts';
import '../styles/globals.css';
const App = ({ Component, pageProps }) => {
	const router = useRouter();
	const isHome = router.pathname === '/';

	const title = 'Media Bubbles';
	const description =
		'Escape your information bubble and view headlines from sources across the political spectrum.';

	return (
		<>
			<Head>
				<title key='title'>{title}</title>
				<meta name='description' content={description}></meta>
				<meta
					name='keywords'
					content='media bubbles, media bias, filter bubble, echo chamber, across the political spectrum, news across the political spectrum, headlines across the political spectrum'
				></meta>
				<meta property='og:title' content={title} key='ogTitle'></meta>
				<meta property='og:description' content={description} key='ogDesc'></meta>
				<meta property='og:url' content={process.env.NEXT_PUBLIC_API_URL} key='ogUrl'></meta>
				<meta
					property='og:image'
					content={`${process.env.NEXT_PUBLIC_API_URL}/images/og_image.png`}
					key='ogImage'
				></meta>
				<meta property='fb:app_id' content='2356113588028211'></meta>
				<meta name='twitter:card' content='summary'></meta>
				<meta
					name='twitter:image'
					content={`${process.env.NEXT_PUBLIC_API_URL}/images/og_image_twitter.png`}
				></meta>
				<link rel='icon' href='/favicon.ico' />
				<link rel='canonical' href={process.env.NEXT_PUBLIC_API_URL} key='canonical' />
			</Head>

			<Provider session={pageProps.session}>
				<TopNavbar />
				<div className={`container-fluid p-0${isHome ? ' home-bg' : ' page-bg'}`}>
					<div className='card border-0' style={{ background: 'transparent' }}>
						{isHome ? (
							<Component {...pageProps} />
						) : (
							<>
								<Header />
								<div className='card-body p-2 p-md-4' style={{ minHeight: '600px' }}>
									<AppProviders>
										<Component {...pageProps} />
									</AppProviders>
								</div>
							</>
						)}
						<Footer />
					</div>
				</div>
			</Provider>
		</>
	);
};

export default App;
