import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Head from 'next/head';
import { Provider } from 'next-auth/client';

import UIActions from '../client/actions/ui-actions';
import Alerts from '../client/components/alerts';
import Header from '../client/components/header';
import Footer from '../client/components/footer';
import Logout from '../client/components/login/logout';
import RouteLink from '../client/components/nav/route-link';
import { wrapper } from '../client/store/store';
import '../styles/globals.css';
const App = ({ Component, pageProps }) => {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(UIActions.loadLocalStorage());
	}, []);

	const title = 'Media Bubbles';
	const description =
		'Escape your information bubble and view headlines from sources across the political spectrum.';

	return (
		<div className='container-fluid p-0'>
			<Head>
				<title>{title}</title>
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
				<link rel='canonical' href={process.env.NEXT_PUBLIC_API_URL} />
			</Head>

			<Provider session={pageProps.session}>
				<div className='card' style={{ background: 'transparent' }}>
					<Header />
					<div className='card-body p-2 p-md-4' style={{ minHeight: '600px' }}>
						<Logout />
						<div className='d-flex justify-content-end mb-3'>
							<RouteLink buttonText='Home' routePath='/' />
							<RouteLink buttonText='About' routePath='/about' />
							<RouteLink buttonText='Blog' routePath='/blog' />
							<RouteLink buttonText='Contact Us' routePath='/contact' />
						</div>
						<Alerts />
						<Component {...pageProps} />
					</div>
					<Footer />
				</div>
			</Provider>
		</div>
	);
};

export default wrapper.withRedux(App);
