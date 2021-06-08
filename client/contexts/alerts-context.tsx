import { createContext } from 'react';

import useAlerts from '../hooks/use-alerts';
import { ShowAlertFn } from '../../types';

export const AlertsDispatch = createContext<ShowAlertFn>(() => {});

export const AlertsProvider: React.FC = ({ children }) => {
	const [Alerts, showAlert] = useAlerts();

	return (
		<AlertsDispatch.Provider value={showAlert}>
			<Alerts />
			{children}
		</AlertsDispatch.Provider>
	);
};
