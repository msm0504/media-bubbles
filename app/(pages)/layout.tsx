'use client';
import { Suspense } from 'react';
import { AppProviders } from '@/contexts';
import { ParentCompProps } from '@/types';
import Spinner from '@/components/shared/spinner';

const NonHomeLayout: React.FC<ParentCompProps> = ({ children }) => (
	<div className='mx-auto min-h-150 w-full max-w-7xl p-2 md:p-5'>
		<Suspense fallback={<Spinner />}>
			<AppProviders>{children}</AppProviders>
		</Suspense>
	</div>
);

export default NonHomeLayout;
