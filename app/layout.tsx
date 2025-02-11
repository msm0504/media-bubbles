import type { Metadata } from 'next';
import { Roboto_Slab } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Box, ThemeProvider } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { config } from '@fortawesome/fontawesome-svg-core';
import { ParentCompProps } from '@/types';
import Footer from '@/components/shared/footer';
import TopNavbar from '@/components/shared/top-navbar';
import theme from '@/styles/theme';
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
	<html lang='en'>
		<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
		<body className={robotoSlab.variable}>
			<AppRouterCacheProvider>
				<ThemeProvider theme={theme}>
					<SessionProvider>
						<Box display='flex' flexDirection='column' minHeight='100vh'>
							<TopNavbar />
							<Box flexGrow={1}>{children}</Box>
							<Footer />
						</Box>
					</SessionProvider>
				</ThemeProvider>
			</AppRouterCacheProvider>
		</body>
	</html>
);

export default RootLayout;
