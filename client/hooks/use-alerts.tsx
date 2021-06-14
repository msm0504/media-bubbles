import { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-bootstrap';

import { ShowAlertFn } from '../../types';

type UseAlerts = [React.FC, ShowAlertFn];
type Alert = { level: string; message: string };
type Alerts = { [key: number]: Alert };

const useAlerts = (): UseAlerts => {
	const [alerts, setAlerts] = useState<Alerts>({});
	const nextId = useRef(1);

	const showAlert = (level: string, message: string) => {
		setAlerts({
			...alerts,
			[nextId.current++]: { level, message }
		});
	};

	const hideAlert = (alertId: number) => {
		const { [alertId]: hiddenAlert, ...otherAlerts } = alerts;
		setAlerts(otherAlerts);
	};

	const Alerts = () => {
		const alertRef = useRef<HTMLDivElement>(null);
		useEffect(() => {
			if (Object.keys(alerts).length) alertRef.current?.scrollIntoView();
		}, [alerts]);

		const formatAlerts = () => {
			return Object.keys(alerts).map(alertId => {
				const alert = alerts[+alertId];
				return (
					<Alert
						key={alertId}
						variant={alert.level}
						show={!!alertId}
						onClose={() => hideAlert(+alertId)}
						dismissible
					>
						{alert.message}
					</Alert>
				);
			});
		};

		return (
			<div style={{ scrollMarginTop: '5rem' }} ref={alertRef}>
				{formatAlerts()}
			</div>
		);
	};

	return [Alerts, showAlert];
};

export default useAlerts;
