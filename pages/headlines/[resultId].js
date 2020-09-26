import APIActions from '../../client/actions/api-actions';
import UIActions from '../../client/actions/ui-actions';
import SearchResults from '../../client/components/search-results';
import ALERT_LEVEL from '../../client/constants/alert-level';
import APIService from '../../client/services/api-service';
import { wrapper } from '../../client/store/store';

const SavedSearchResults = () => <SearchResults />;

export default SavedSearchResults;

export const getServerSideProps = wrapper.getServerSideProps(async ({ params, store }) => {
	const loadedResult = await APIService.callApi('get', `searchResult/${params.resultId}`);

	if (!loadedResult) {
		store.dispatch(
			UIActions.showAlert(ALERT_LEVEL.danger, 'No saved search result found for this id')
		);
	} else {
		store.dispatch(APIActions.resultLoaded(loadedResult));
	}
});
