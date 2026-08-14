import type { Metadata } from 'next';
import { Roboto_Slab } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import { config } from '@fortawesome/fontawesome-svg-core';
import { ParentCompProps } from '@/types';
import Footer from '@/components/shared/footer';
import TopNavbar from '@/components/shared/top-navbar';
import '@fortawesome/fontawesome-svg-core/styles.css';
import '../styles/globals.css';

config.autoAddCss = false;

export const metadata: Metadata = {
	title: 'Media Bubbles',
	description:
		'Escape your information bubble and view headlines from sources across the political spectrum.',
	keywords: [
		'media bubbles',
		'media bias',
		'filter bubble',
		'echo chamber',
		'across the political spectrum',
		'news across the political spectrum',
		'headlines across the political spectrum',
	],
};

const robotoSlab = Roboto_Slab({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-roboto-slab',
});

const RootLayout: React.FC<ParentCompProps> = ({ children }) => (
	<html lang='en' className={robotoSlab.variable}>
		<body>
			<div className='flex min-h-screen flex-col'>
				<TopNavbar />
				<div className='flex grow flex-col'>{children}</div>
				<Footer />
			</div>
		</body>
		{process.env.NEXT_PUBLIC_GA_ID ? (
			<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
		) : null}
	</html>
);

export default RootLayout;
