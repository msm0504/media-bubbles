import { createContext } from 'react';

import useAlerts from '../hooks/use-alerts';

export const AlertsDispatch = createContext(() => {});

export const AlertsProvider = ({ children }) => {
	const [Alerts, showAlert] = useAlerts();

	return (
		<AlertsDispatch.Provider value={showAlert}>
			<Alerts />
			{children}
		</AlertsDispatch.Provider>
	);
};
