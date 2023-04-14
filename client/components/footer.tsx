import Link from 'next/link';

const Footer: React.FC = () => (
	<div className='card-footer bg-white text-muted'>
		<p className='d-inline-block'>
			<Link href='/privacy-policy'>
				<a target='_blank'>Privacy Policy</a>
			</Link>
			<br />
			<Link href='/terms'>
				<a target='_blank'>Terms and Conditions</a>
			</Link>
			<br />
		</p>
		<p className='d-inline-block ms-sm-5'>
			<a href='https://bing.com/' target='_blank' rel='noreferrer'>
				Headline Searches Powered By Microsoft Bing
			</a>
			<br />
			<a href='https://www.allsides.com/bias/bias-ratings' target='_blank' rel='noreferrer'>
				Source Media Bias Ratings From AllSides.com
			</a>
			<br />
			<a href='https://clearbit.com' target='_blank' rel='noreferrer'>
				Logos provided by Clearbit
			</a>
			<br />
		</p>
	</div>
);

export default Footer;
