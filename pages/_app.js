import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Head from 'next/head';
import { Provider } from 'next-auth/client';

import UIActions from '../client/actions/ui-actions';
import Alerts from '../client/components/alerts';
import Header from '../client/components/header';
import Footer from '../client/components/footer';
import FbLogin from '../client/components/login/fb-login';
import RouteLink from '../client/components/nav/route-link';
import { wrapper } from '../client/store/store';
import '../styles/globals.css';
const App = ({ Component, pageProps }) => {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(UIActions.loadLocalStorage());
	}, []);

	return (
		<div className='container-fluid'>
			<Head>
				<title>Media Bubbles</title>
				<meta
					name='description'
					content='Escape your information bubble and view headlines from sources across the political spectrum.'
				></meta>
				<meta property='og:url' content={process.env.NEXT_PUBLIC_API_URL} key='ogUrl'></meta>
				<meta property='og:image' content='/images/og_image.png' key='ogImage'></meta>
				<meta property='fb:app_id' content='2356113588028211'></meta>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<Provider session={pageProps.session}>
				<div className='card'>
					<Header />
					<div className='card-body' style={{ minHeight: '600px' }}>
						<FbLogin />
						<div className='d-flex justify-content-end mb-2'>
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
