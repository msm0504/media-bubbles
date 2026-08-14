'use client';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import type { ShowAlertFn } from '@/types';
import type { Color } from '@/styles/color-variants';
import { Alert } from '@/components/shared/base-ui';

type UseAlerts = [React.FC, ShowAlertFn];
type AlertInfo = { level: Color; message: string };

const useAlerts = (): UseAlerts => {
	const [alert, setAlert] = useState<AlertInfo>();
	const alertRef = useRef<HTMLDivElement>(null);
	const pathname = usePathname();

	useEffect(() => {
		if (alert) alertRef.current?.scrollIntoView();
	}, [alert]);

	useEffect(() => {
		setAlert(undefined);
	}, [pathname]);

	const showAlert = (level: Color, message: string) => {
		setAlert({ level, message });
	};

	const hideAlert = () => {
		setAlert(undefined);
	};

	const AlertDisplay = () =>
		alert ? (
			<div className='scroll-mt-20' ref={alertRef}>
				<Alert color={alert.level} description={alert.message} />
			</div>
		) : null;

	return [AlertDisplay, showAlert];
};

export default useAlerts;
