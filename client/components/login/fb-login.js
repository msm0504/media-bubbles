import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';

import APIActions from '../../actions/api-actions';

const setFbAsyncInit = statusChangeCallback => {
	window.fbAsyncInit = () => {
		window.FB.Event.subscribe('auth.statusChange', statusChangeCallback);

		window.FB.init({
			appId: '2356113588028211',
			cookie: true,
			xfbml: true,
			status: true,
			version: 'v7.0'
		});
	};
};

const loadFbSdkAsync = () => {
	((d, s, id) => {
		var js,
			fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {
			return;
		}
		js = d.createElement(s);
		js.id = id;
		js.src = 'https://connect.facebook.net/en_US/sdk.js';
		fjs.parentNode.insertBefore(js, fjs);
	})(document, 'script', 'facebook-jssdk');
};

const mapStateToProps = ({ loginState }) => ({
	initComplete: loginState.fbInitComplete,
	userId: loginState.fbUserId
});

const mapDispatchToProps = {
	setInitComplete: APIActions.setFbInitComplete,
	setUserId: APIActions.fbUserChanged,
	setUserData: APIActions.setFbUserData,
	clearUserData: APIActions.clearFbUserData
};

const FbLogin = ({
	clearUserData,
	initComplete,
	setInitComplete,
	setUserData,
	setUserId,
	userId
}) => {
	const statusChangeCallback = response => {
		if (!initComplete) setInitComplete();

		if (response.status === 'connected') {
			document.cookie = `userId=${response.authResponse.userID}`;
			setUserId(response.authResponse.userID);
			window.FB.api('/me', { fields: ['email', 'name'] }, setUserData);
		} else {
			document.cookie = `userId=`;
			clearUserData();
		}
	};

	const loginClicked = () => {
		if (userId) {
			window.FB.logout();
		} else {
			window.FB.login(() => {}, { scope: 'public_profile,email' });
		}
	};

	useEffect(() => {
		setFbAsyncInit(statusChangeCallback);
		loadFbSdkAsync();
	}, []);

	useEffect(() => {
		if (initComplete) {
			return () => window.FB.Event.unsubscribe('auth.statusChange', statusChangeCallback);
		}
	}, [initComplete]);

	return (
		<div className='d-flex justify-content-end m-0'>
			<div id='fb-root'></div>
			<Button
				color='info'
				className='facebook-btn'
				id='fb-login'
				disabled={!initComplete}
				onClick={loginClicked}
			>
				<i className='fa fa-lg fa-facebook mr-2' aria-hidden='true'></i>
				<strong>{userId ? 'Log out' : 'Log in With Facebook'}</strong>
			</Button>
		</div>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(FbLogin);
