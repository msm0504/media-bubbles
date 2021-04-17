import { useState, useEffect } from 'react';
import { Button } from 'reactstrap';

const ShareButtons = ({ urlToShare = '' }) => {
	if (!urlToShare) return null;

	const [hasShareApi, setHasShareApi] = useState(false);
	useEffect(() => {
		if (navigator?.share) setHasShareApi(true);
	}, []);

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

	return hasShareApi ? (
		<Button
			className='mb-1 ml-3 d-inline-block'
			color='info'
			onClick={() => {
				navigator.share({ title: 'Media Bubbles Results', url: urlToShare });
			}}
		>
			<strong>Share</strong>
		</Button>
	) : (
		<>
			<Button
				color='info'
				className='facebook-btn d-inline-block mb-1 ml-3 mr-1 rounded'
				onClick={() => {
					window.open(
						`https://www.facebook.com/sharer/sharer.php?u=${encodeURI(urlToShare)}`,
						'_blank'
					);
				}}
			>
				<i className='fa fa-lg fa-facebook' aria-hidden='true'></i>
				<span className='sr-only'>{'share on Facebook'}</span>
			</Button>
			<Button
				color='info'
				className='twitter-btn d-inline-block mb-1 mr-1 rounded'
				onClick={() => {
					window.open(`https://twitter.com/intent/tweet?url=${encodeURI(urlToShare)}`, '_blank');
				}}
			>
				<i className='fa fa-lg fa-twitter' aria-hidden='true'></i>
				<span className='sr-only'>{'share on Twitter'}</span>
			</Button>
			<Button
				color='secondary'
				className='d-inline-block mb-1 mr-1 rounded'
				onClick={() => {
					window.open(
						`mailto:?subject=${encodeURIComponent('Media Bubbles Results')}
          &body=${urlToShare}`,
						'_blank'
					);
				}}
			>
				<i className='fa fa-lg fa-envelope-o' aria-hidden='true'></i>
				<span className='sr-only'>{'email'}</span>
			</Button>
			{document && document.queryCommandSupported('copy') ? (
				<Button color='secondary' className='d-inline-block mb-1 rounded' onClick={copyToClipboard}>
					<i className='fa fa-clipboard fa-lg' aria-hidden='true'></i>
					<span className='sr-only'>{'copy link'}</span>
				</Button>
			) : null}
		</>
	);
};

export default ShareButtons;
