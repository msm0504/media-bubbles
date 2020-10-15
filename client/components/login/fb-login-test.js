import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';

import APIActions from '../../actions/api-actions';

const testUser = {
	userID: '10157984953250379',
	name: 'Mark Monday',
	email: 'mark.monday0504@gmail.com'
};

const mapStateToProps = ({
	loginState: {
		fbUserInfo: { userId }
	}
}) => ({ userId });

const mapDispatchToProps = {
	setInitComplete: APIActions.setFbInitComplete,
	setUserId: APIActions.fbUserChanged,
	setUserData: APIActions.setFbUserData,
	clearUserData: APIActions.clearFbUserData
};

const FbLogin = ({ clearUserData, setInitComplete, setUserData, setUserId, userId }) => {
	useEffect(() => {
		if (window) {
			setTimeout(() => {
				setInitComplete();
				if (userId) document.cookie = `userId=${userId}`;
			}, 200);
		}
	}, []);

	const loginClicked = () => {
		if (userId) {
			document.cookie = `userId=`;
			clearUserData();
		} else {
			document.cookie = `userId=${testUser.userID}`;
			setUserId(testUser.userID);
			setUserData(testUser);
		}
	};

	return (
		<div className='d-flex justify-content-end m-0'>
			<div id='fb-root'></div>
			<Button color='info' className='facebook-btn' id='fb-login' onClick={loginClicked}>
				<i className='fa fa-lg fa-facebook mr-2' aria-hidden='true'></i>
				<strong>{userId ? 'Log out' : 'Log in With Facebook'}</strong>
			</Button>
		</div>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(FbLogin);
