import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faClipboard, faEnvelope } from '@fortawesome/free-regular-svg-icons';

import styles from '@/styles/styles.module.css';

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
		<>
			<Button
				variant='info'
				className={`${styles.facebookBtn} d-inline-block mb-1 ms-3 me-1 rounded`}
				id='share-facebook'
				onClick={() => {
					window.open(
						`https://www.facebook.com/sharer/sharer.php?u=${encodeURI(urlToShare)}`,
						'_blank'
					);
				}}
			>
				<FontAwesomeIcon icon={faFacebookF} size='lg' />
				<span className='sr-only'>{'share on Facebook'}</span>
			</Button>
			<Button
				variant='dark'
				className='d-inline-block mb-1 me-1 rounded'
				id='share-twitter'
				onClick={() => {
					window.open(`https://twitter.com/intent/tweet?url=${encodeURI(urlToShare)}`, '_blank');
				}}
			>
				<FontAwesomeIcon icon={faXTwitter} size='lg' />
				<span className='sr-only'>{'share on Twitter'}</span>
			</Button>
			<Button
				variant='secondary'
				className='d-inline-block mb-1 me-1 rounded'
				id='share-email'
				onClick={() => {
					window.open(
						`mailto:?subject=${encodeURIComponent('Media Bubbles Results')}
          &body=${urlToShare}`,
						'_blank'
					);
				}}
			>
				<FontAwesomeIcon icon={faEnvelope} size='lg' />
				<span className='sr-only'>{'email'}</span>
			</Button>
			{document && document.queryCommandSupported('copy') ? (
				<Button
					variant='secondary'
					className='d-inline-block mb-1 rounded'
					id='share-copy'
					onClick={copyToClipboard}
				>
					<FontAwesomeIcon icon={faClipboard} size='lg' />
					<span className='sr-only'>{'copy link'}</span>
				</Button>
			) : null}
		</>
	);
};

export default ShareButtons;
