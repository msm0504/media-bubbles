import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Roboto_Slab } from 'next/font/google';
import Script from 'next/script';
import { SessionProvider } from 'next-auth/react';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

import Header from '../client/components/header';
import Footer from '../client/components/footer';
import TopNavbar from '../client/components/nav/top-navbar';
import { AppProviders } from '../client/contexts';
import * as gtag from '../lib/gtag';
import background from '../public/images/background.png';
import homeBackground from '../public/images/og_image.png';
import styles from '../styles/styles.module.css';
import '../styles/custom-theme.scss';

config.autoAddCss = false;

const robotoSlab = Roboto_Slab({
	subsets: ['latin'],
	display: 'swap'
});

const title = 'Media Bubbles';
const description =
	'Escape your information bubble and view headlines from sources across the political spectrum.';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
	const router = useRouter();
	const isHome = router.pathname === '/';

	useEffect(() => {
		if (gtag.GA_TRACKING_ID) {
			const handleRouteChange = (url: URL) => {
				gtag.pageview(url);
			};
			router.events.on('routeChangeComplete', handleRouteChange);
			return () => {
				router.events.off('routeChangeComplete', handleRouteChange);
			};
		}
	}, [router.events]);

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
				<meta property='og:url' content={process.env.NEXT_PUBLIC_URL} key='ogUrl'></meta>
				<meta
					property='og:image'
					content={`${process.env.NEXT_PUBLIC_URL}/images/og_image.png`}
					key='ogImage'
				></meta>
				<meta property='og:type' content='website'></meta>
				<meta property='fb:app_id' content='2356113588028211'></meta>
				<meta name='twitter:card' content='summary' key='twitterCard'></meta>
				<meta
					name='twitter:image'
					content={`${process.env.NEXT_PUBLIC_URL}/images/og_image_twitter.png`}
					key='twitterImage'
				></meta>
				<link rel='icon' href='/favicon.ico' />
				<link rel='canonical' href={process.env.NEXT_PUBLIC_URL} key='canonical' />
				{gtag.GA_TRACKING_ID ? (
					<script
						dangerouslySetInnerHTML={{
							__html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gtag.GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `
						}}
					/>
				) : null}
			</Head>
			{/* Global Site Tag (gtag.js) - Google Analytics */}
			{gtag.GA_TRACKING_ID ? (
				<Script
					strategy='afterInteractive'
					src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
				/>
			) : null}
			<SessionProvider session={pageProps.session}>
				<main className={robotoSlab.className}>
					<TopNavbar />
					<div className={'container-fluid p-0'}>
						<div className={styles.bgImgContainer}>
							<Image
								alt='background'
								src={isHome ? homeBackground : background}
								placeholder='blur'
								quality={100}
								fill
								sizes='100vw'
								style={{
									objectFit: 'cover'
								}}
							/>
						</div>
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
				</main>
			</SessionProvider>
		</>
	);
};

export default App;
