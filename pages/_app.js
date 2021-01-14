import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import dynamic from 'next/dynamic';
import Head from 'next/head';

import UIActions from '../client/actions/ui-actions';
import Alerts from '../client/components/alerts';
import Header from '../client/components/header';
import Footer from '../client/components/footer';
import RouteLink from '../client/components/nav/route-link';
import { wrapper } from '../client/store/store';
import '../styles/globals.css';

const loginCompFile = process.env.NEXT_PUBLIC_TEST_DATA === 'true' ? 'fb-login-test' : 'fb-login';
const FbLogin = dynamic(() => import(`../client/components/login/${loginCompFile}`), {
	ssr: false
});

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
				<meta property='fb:app_id' content='2356113588028211'></meta>
				<link rel='icon' href='/favicon.ico' />
			</Head>

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
		</div>
	);
};

export default wrapper.withRedux(App);
