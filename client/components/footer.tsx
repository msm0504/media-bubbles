import Link from 'next/link';
import { Card } from 'react-bootstrap';

const Footer: React.FC = () => (
	<Card.Footer className='bg-white text-muted'>
		<div className='d-flex flex-column flex-md-row justify-content-md-start'>
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
			<p className='d-flex flex-column ms-md-4'>
				<Link href='/privacy-policy' target='_blank'>
					Privacy Policy
				</Link>
				<Link href='/terms' target='_blank'>
					Terms and Conditions
				</Link>
			</p>
		</div>
	</Card.Footer>
);

export default Footer;
