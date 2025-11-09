'use client';
import { Button, Stack } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBluesky, faFacebookF, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faClipboard, faEnvelope } from '@fortawesome/free-regular-svg-icons';
import styles from '@/styles/main.module.css';

type ShareButtonsProps = {
	urlToShare?: string;
};

const ShareButtons: React.FC<ShareButtonsProps> = ({ urlToShare = '' }) => {
	if (!urlToShare) return null;

	const copyToClipboard = () => {
		const el = document.createElement('textarea');
		el.style.height = '0px';
		el.style.width = '1px';
		document.body.appendChild(el);
		el.value = urlToShare;
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);
	};

	return (
		<Stack direction='row' marginBottom={1} spacing={4}>
			<Button
				color='info'
				variant='contained'
				className={styles.bskyBtn}
				id='share-bsky'
				onClick={() => {
					window.open(`https://bsky.app/intent/compose?text=${encodeURI(urlToShare)}`, '_blank');
				}}
			>
				<FontAwesomeIcon icon={faBluesky} size='xl' />
				<span className='sr-only'>{'share on Bluesky'}</span>
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
				<FontAwesomeIcon icon={faFacebookF} size='xl' />
				<span className='sr-only'>{'share on Facebook'}</span>
			</Button>
			<Button
				color='dark'
				variant='contained'
				id='share-x'
				onClick={() => {
					window.open(`https://x.com/intent/post?url=${encodeURI(urlToShare)}`, '_blank');
				}}
			>
				<FontAwesomeIcon icon={faXTwitter} size='xl' />
				<span className='sr-only'>{'share on X'}</span>
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
				<FontAwesomeIcon icon={faEnvelope} size='xl' />
				<span className='sr-only'>{'email'}</span>
			</Button>
			{document && document.queryCommandSupported('copy') ? (
				<Button color='secondary' variant='contained' id='share-copy' onClick={copyToClipboard}>
					<FontAwesomeIcon icon={faClipboard} size='xl' />
					<span className='sr-only'>{'copy link'}</span>
				</Button>
			) : null}
		</Stack>
	);
};

export default ShareButtons;
