'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import type { ShowAlertFn } from '@/types';
import type { Color } from '@/styles/color-variants';
import { Alert } from '@/components/shared/base-ui';

type UseAlerts = [React.FC, ShowAlertFn];
type AlertInfo = { level: Color; message: string; pathname: string | null };

const useAlerts = (): UseAlerts => {
	const [alert, setAlert] = useState<AlertInfo>();
	const alertRef = useRef<HTMLDivElement>(null);
	const pathname = usePathname();

	useEffect(() => {
		if (alert) alertRef.current?.scrollIntoView();
	}, [alert]);

	const visibleAlert = alert?.pathname === pathname ? alert : undefined;

	const showAlert = useCallback(
		(level: Color, message: string) => {
			setAlert({ level, message, pathname });
		},
		[pathname]
	);

	const hideAlert = () => {
		setAlert(undefined);
	};

	const AlertDisplay = () => (
		<div className='scroll-mt-20' ref={alertRef}>
			{visibleAlert ? (
				<Alert color={visibleAlert.level} description={visibleAlert.message} onClose={hideAlert} />
			) : null}
		</div>
	);

	return [AlertDisplay, showAlert];
};

export default useAlerts;
