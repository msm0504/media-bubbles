import { AlertsProvider } from './alerts-context';
import { SearchResultProvider } from './search-result-context';
import type { ParentCompProps } from '@/types';

export const AppProviders: React.FC<ParentCompProps> = ({ children }) => (
	<AlertsProvider>
		<SearchResultProvider>{children}</SearchResultProvider>
	</AlertsProvider>
);
