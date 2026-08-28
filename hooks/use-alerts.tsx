'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Alert as MuiAlert } from '@mui/material';
import type { AlertColor } from '@mui/material';
import type { ShowAlertFn } from '@/types';

type UseAlerts = [React.FC, ShowAlertFn];
type AlertInfo = { level: AlertColor; message: string; pathname: string | null };

const useAlerts = (): UseAlerts => {
	const [alert, setAlert] = useState<AlertInfo>();
	const alertRef = useRef<HTMLDivElement>(null);
	const pathname = usePathname();

	useEffect(() => {
		if (alert) alertRef.current?.scrollIntoView();
	}, [alert]);

	const visibleAlert = alert?.pathname === pathname ? alert : undefined;

	const showAlert = useCallback(
		(level: AlertColor, message: string) => {
			setAlert({ level, message, pathname });
		},
		[pathname]
	);

	const hideAlert = () => {
		setAlert(undefined);
	};

	const Alert = () => (
		<div style={{ scrollMarginTop: '5rem' }} ref={alertRef}>
			{visibleAlert ? (
				<MuiAlert severity={visibleAlert.level} onClose={hideAlert}>
					{visibleAlert.message}
				</MuiAlert>
			) : null}
		</div>
	);

	return [Alert, showAlert];
};

export default useAlerts;
