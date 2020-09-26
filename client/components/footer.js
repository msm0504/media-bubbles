import Link from 'next/link';

const Footer = () => (
	<div className='card-footer text-muted'>
		<p className='d-inline-block'>
			<Link href='/privacy-policy' target='_blank'>
				<a>Privacy Policy</a>
			</Link>
			<br />
			<Link href='/terms' target='_blank'>
				<a>Terms and Conditions</a>
			</Link>
			<br />
		</p>
		<p className='d-inline-block ml-sm-5'>
			<a href='https://newsapi.org/' target='_blank' rel='noreferrer'>
				Headline Searches Powered By NewsAPI.org
			</a>
			<br />
			<a href='https://www.allsides.com/bias/bias-ratings' target='_blank' rel='noreferrer'>
				Source Media Bias Ratings From AllSides.com
			</a>
			<br />
		</p>
	</div>
);

export default Footer;
