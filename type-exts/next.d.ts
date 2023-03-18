import type { NextComponentType, NextPageContext } from 'next';
/*
	From Next Auth's Typescript example
	https://github.com/nextauthjs/next-auth-typescript-example/blob/main/types/next.d.ts
*/
import type { Session } from 'next-auth';
import type { Router } from 'next/router';

declare module 'next/app' {
	type AppProps<P = Record<string, unknown>> = {
		Component: NextComponentType<NextPageContext, any, P>;
		router: Router;
		__N_SSG?: boolean;
		__N_SSP?: boolean;
		pageProps: P & {
			/** Initial session passed in from `getServerSideProps` or `getInitialProps` */
			session?: Session;
		};
	};
}
