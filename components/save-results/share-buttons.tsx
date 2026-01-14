'use client';
import { Box, Button, Stack } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBluesky, faFacebookF, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faClipboard, faEnvelope } from '@fortawesome/free-regular-svg-icons';
import ScreenshotButton from './take-screenshot-button';
import styles from '@/styles/main.module.css';

type ShareButtonsProps = {
	urlToShare?: string;
};

const ShareButtons: React.FC<ShareButtonsProps> = ({ urlToShare = '' }) => {
	if (!urlToShare) return null;

	return (
		<Stack direction='row' marginBottom={1} flexWrap='wrap' gap={4}>
			<Button
				color='info'
				variant='contained'
				className={styles.bskyBtn}
				id='share-bsky'
				onClick={() => {
					window.open(`https://bsky.app/intent/compose?text=${encodeURI(urlToShare)}`, '_blank');
				}}
			>
				<FontAwesomeIcon aria-label='share on Bluesky' icon={faBluesky} size='lg' />
			</Button>
			<Button
				color='info'
				variant='contained'
				className={styles.facebookBtn}
				id='share-facebook'
				onClick={() => {
					window.open(
						`https://www.facebook.com/sharer/sharer.php?u=${encodeURI(urlToShare)}`,
						'_blank'
					);
				}}
			>
				<FontAwesomeIcon aria-label='share on Facebook' icon={faFacebookF} size='lg' />
			</Button>
			<Button
				color='dark'
				variant='contained'
				id='share-x'
				onClick={() => {
					window.open(`https://x.com/intent/post?url=${encodeURI(urlToShare)}`, '_blank');
				}}
			>
				<FontAwesomeIcon aria-label='share on X' icon={faXTwitter} size='lg' />
			</Button>
			<Button
				color='secondary'
				variant='contained'
				id='share-email'
				onClick={() => {
					window.open(
						`mailto:?subject=${encodeURIComponent('Media Bubbles Results')}
          &body=${urlToShare}`,
						'_blank'
					);
				}}
			>
				<FontAwesomeIcon aria-label='email link' icon={faEnvelope} size='lg' />
			</Button>
			{navigator && navigator.clipboard ? (
				<Button
					color='secondary'
					variant='contained'
					id='share-copy'
					onClick={() => navigator.clipboard.writeText(urlToShare)}
				>
					<FontAwesomeIcon aria-label='copy link' icon={faClipboard} size='lg' />
				</Button>
			) : null}
			<Box flexGrow={1}></Box>
			<ScreenshotButton urlToShare={urlToShare} />
		</Stack>
	);
};

export default ShareButtons;
