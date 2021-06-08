import { AlertsProvider } from './alerts-context';
import { SearchResultProvider } from './search-result-context';

export const AppProviders: React.FC = ({ children }) => (
	<AlertsProvider>
		<SearchResultProvider>{children}</SearchResultProvider>
	</AlertsProvider>
);
