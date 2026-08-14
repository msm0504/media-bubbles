'use client';
import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AppProviders } from '@/contexts';
import { ParentCompProps } from '@/types';
import Spinner from '@/components/shared/spinner';
import background from '@/public/images/background.png';
import bannerBackground from '@/public/images/banner.png';

const Header: React.FC = () => (
	<Link className='relative w-full overflow-hidden no-underline' href='/'>
		<Image
			alt='banner background'
			src={bannerBackground}
			quality={100}
			fill
			className='bg-size-[100% auto] -z-1 bg-no-repeat'
		/>
		<div className='mx-auto max-w-4xl px-4 py-16 text-center'>
			<h1 className='text-7xl font-bold text-white text-shadow-outlined'>Media Bubbles</h1>
		</div>
	</Link>
);

const NonHomeLayout: React.FC<ParentCompProps> = ({ children }) => (
	<div className='m-0 p-0'>
		<div className='fixed -z-10 h-screen w-screen overflow-hidden'>
			<Image
				alt='background'
				src={background}
				quality={100}
				fill
				sizes='100vw'
				style={{
					objectFit: 'cover',
				}}
			/>
		</div>
		<div className='bg-transparent'>
			<Header />
			<div className='mx-auto min-h-150 w-full p-2 md:p-5 2xl:container'>
				<Suspense fallback={<Spinner />}>
					<AppProviders>{children}</AppProviders>
				</Suspense>
			</div>
		</div>
	</div>
);

export default NonHomeLayout;
