import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { brands, regular } from '@fortawesome/fontawesome-svg-core/import.macro';

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
				className='twitter-btn d-inline-block mb-1 ms-3 me-1 rounded'
				onClick={() => {
					window.open(`https://twitter.com/intent/tweet?url=${encodeURI(urlToShare)}`, '_blank');
				}}
			>
				<FontAwesomeIcon icon={brands('twitter')} size='lg' />
				<span className='sr-only'>{'share on Twitter'}</span>
			</Button>
			<Button
				variant='info'
				className='facebook-btn d-inline-block mb-1 me-1 rounded'
				onClick={() => {
					window.open(
						`https://www.facebook.com/sharer/sharer.php?u=${encodeURI(urlToShare)}`,
						'_blank'
					);
				}}
			>
				<FontAwesomeIcon icon={brands('facebook-f')} size='lg' />
				<span className='sr-only'>{'share on Facebook'}</span>
			</Button>
			<Button
				variant='secondary'
				className='d-inline-block mb-1 me-1 rounded'
				onClick={() => {
					window.open(
						`mailto:?subject=${encodeURIComponent('Media Bubbles Results')}
          &body=${urlToShare}`,
						'_blank'
					);
				}}
			>
				<FontAwesomeIcon icon={regular('envelope')} size='lg' />
				<span className='sr-only'>{'email'}</span>
			</Button>
			{document && document.queryCommandSupported('copy') ? (
				<Button
					variant='secondary'
					className='d-inline-block mb-1 rounded'
					onClick={copyToClipboard}
				>
					<FontAwesomeIcon icon={regular('clipboard')} size='lg' />
					<span className='sr-only'>{'copy link'}</span>
				</Button>
			) : null}
		</>
	);
};

export default ShareButtons;
