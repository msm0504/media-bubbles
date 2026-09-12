import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
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

const fontBody = Inter({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-inter',
});

const fontHeading = Plus_Jakarta_Sans({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-plus-jakarta-sans',
});

const RootLayout: React.FC<ParentCompProps> = ({ children }) => (
	<html lang='en' className={`${fontBody.variable} ${fontHeading.variable}`}>
		<body>
			<div className='relative flex min-h-screen flex-col overflow-hidden'>
				<div className='bg-bubble bg-left'></div>
				<div className='bg-bubble bg-right'></div>
				<TopNavbar />
				<div className='grow'>{children}</div>
				<Footer />
			</div>
		</body>
		{process.env.NEXT_PUBLIC_GA_ID ? (
			<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
		) : null}
	</html>
);

export default RootLayout;
