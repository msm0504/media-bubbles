'use client';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Alert as MuiAlert } from '@mui/material';
import type { AlertColor } from '@mui/material';
import type { ShowAlertFn } from '@/types';

type UseAlerts = [React.FC, ShowAlertFn];
type AlertInfo = { level: AlertColor; message: string };

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

	const showAlert = (level: AlertColor, message: string) => {
		setAlert({ level, message });
	};

	const hideAlert = () => {
		setAlert(undefined);
	};

	const Alert = () => (
		<div style={{ scrollMarginTop: '5rem' }} ref={alertRef}>
			{alert ? (
				<MuiAlert severity={alert.level} onClose={hideAlert}>
					{alert.message}
				</MuiAlert>
			) : null}
		</div>
	);

	return [Alert, showAlert];
};

export default useAlerts;
