import { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Alert } from 'reactstrap';
import UIActions from '../actions/ui-actions';

const mapStateToProps = state => {
	return { alertState: state.alertState };
};

const mapDispatchToProps = {
	onHideAlert: UIActions.hideAlert
};

const Alerts = ({ alertState, onHideAlert }) => {
	const alertRef = useRef(null);
	useEffect(() => {
		if (Object.keys(alertState).length) alertRef.current.scrollIntoView();
	}, [alertState]);

	const getAlertList = () => {
		return Object.keys(alertState).map(alertId => {
			const alert = alertState[alertId];
			return (
				<Alert
					key={alertId}
					color={alert.level}
					isOpen={!!alertId}
					toggle={() => onHideAlert(alertId)}
				>
					{alert.message}
				</Alert>
			);
		});
	};

	return <div ref={alertRef}>{getAlertList()}</div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Alerts);
