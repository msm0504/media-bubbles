import Link from 'next/link';

const Footer: React.FC = () => (
	<div className='card-footer bg-white text-muted'>
		<div className='d-flex flex-column flex-md-row justify-content-md-around'>
			<p className='d-flex flex-column'>
				<a href='https://bing.com/news' target='_blank' rel='noreferrer'>
					Headline Searches Powered By Microsoft Bing
				</a>
				<a href='https://www.allsides.com/bias/bias-ratings' target='_blank' rel='noreferrer'>
					Source Media Bias Ratings From AllSides.com
				</a>
				<a href='https://clearbit.com' target='_blank' rel='noreferrer'>
					Logos provided by Clearbit
				</a>
			</p>
			<p className='d-flex flex-column'>
				<Link href='/privacy-policy'>
					<a target='_blank'>Privacy Policy</a>
				</Link>
				<Link href='/terms'>
					<a target='_blank'>Terms and Conditions</a>
				</Link>
			</p>
		</div>
	</div>
);

export default Footer;
