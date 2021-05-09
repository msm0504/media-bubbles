import { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-bootstrap';

const useAlerts = () => {
	const [alerts, setAlerts] = useState({});
	const nextId = useRef(1);

	const showAlert = (level, message) => {
		setAlerts({
			...alerts,
			[nextId.current++]: { level, message }
		});
	};

	const hideAlert = alertId => {
		const { [alertId]: hiddenAlert, ...otherAlerts } = alerts;
		setAlerts(otherAlerts);
	};

	const Alerts = () => {
		const alertRef = useRef(null);
		useEffect(() => {
			if (Object.keys(alerts).length) alertRef.current.scrollIntoView();
		}, [alerts]);

		const formatAlerts = () => {
			return Object.keys(alerts).map(alertId => {
				const alert = alerts[alertId];
				return (
					<Alert
						key={alertId}
						variant={alert.level}
						show={!!alertId}
						onClose={() => hideAlert(alertId)}
						dismissible
					>
						{alert.message}
					</Alert>
				);
			});
		};

		return <div ref={alertRef}>{formatAlerts()}</div>;
	};

	return [Alerts, showAlert];
};

export default useAlerts;
