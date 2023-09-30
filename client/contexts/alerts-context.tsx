import { createContext } from 'react';

import useAlerts from '../hooks/use-alerts';
import type { ParentCompProps, ShowAlertFn } from '@/types';

export const AlertsDispatch = createContext<ShowAlertFn>(() => {});

export const AlertsProvider: React.FC<ParentCompProps> = ({ children }) => {
	const [Alerts, showAlert] = useAlerts();

	return (
		<AlertsDispatch.Provider value={showAlert}>
			<Alerts />
			{children}
		</AlertsDispatch.Provider>
	);
};
