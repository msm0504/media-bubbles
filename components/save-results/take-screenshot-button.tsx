'use client';
import { useState, useContext, useMemo } from 'react';
import { Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-regular-svg-icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import ALERT_LEVEL from '@/constants/alert-level';
import { AlertsDispatch } from '@/contexts/alerts-context';
import { isAdmin } from '@/constants/admin-role';
import { useSession } from '@/lib/auth-client';
import { callApi } from '@/services/api-service';

type ScreenshotButtonProps = {
	urlToShare: string;
};

const ScreenshotButton: React.FC<ScreenshotButtonProps> = ({ urlToShare }) => {
	const [isProcessing, setProcessing] = useState<boolean>(false);
	const showAlert = useContext(AlertsDispatch);
	const { data: session } = useSession();
	const resultId = urlToShare.substring(urlToShare.lastIndexOf('/') + 1);

	const generateClicked = useMemo(
		() => async () => {
			setProcessing(true);
			try {
				await callApi('put', `search-result/${resultId}/screenshot`);
				showAlert(ALERT_LEVEL.success, 'Screenshot generated successfully.');
			} catch {
				showAlert(ALERT_LEVEL.warning, 'Generating screenshot failed. Please try again later.');
			} finally {
				setProcessing(false);
			}
		},
		[resultId, setProcessing, showAlert]
	);

	if (!isAdmin(session?.user.role)) return null;

	return (
		<Button
			color='primary'
			variant='contained'
			endIcon={
				<FontAwesomeIcon
					className='ms-2'
					icon={isProcessing ? faSpinner : faCamera}
					spinPulse={isProcessing}
				/>
			}
			onClick={generateClicked}
		>
			Generate Screenshot
		</Button>
	);
};

export default ScreenshotButton;
