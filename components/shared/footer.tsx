import { Link } from './base-ui';

const Footer: React.FC = () => (
	<footer className='w-full p-3'>
		<div className='m-auto flex w-full max-w-6xl flex-col gap-2 md:flex-row md:gap-5'>
			<div className='flex flex-col gap-2'>
				<Link color='neutral' href='https://bsky.app' target='_blank' rel='noreferrer'>
					Headline Searches Powered By Bluesky
				</Link>
				<Link
					color='neutral'
					href='https://www.allsides.com/bias/bias-ratings'
					target='_blank'
					rel='noreferrer'
				>
					Source Media Bias Ratings From AllSides.com
				</Link>
				<Link color='neutral' href='https://logo.dev' target='_blank' rel='noreferrer'>
					Logos provided by Logo.dev
				</Link>
			</div>
			<div className='flex flex-col gap-2'>
				<Link color='neutral' href='/privacy-policy' target='_blank'>
					Privacy Policy
				</Link>
				<Link color='neutral' href='/terms' target='_blank'>
					Terms and Conditions
				</Link>
			</div>
		</div>
	</footer>
);

export default Footer;
