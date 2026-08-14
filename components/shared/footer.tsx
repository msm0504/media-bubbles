import { Link } from './base-ui';

const Footer: React.FC = () => (
	<footer className='w-full bg-white p-3'>
		<div className='m-auto flex w-full flex-col gap-2 md:flex-row md:gap-5 2xl:container'>
			<div className='flex flex-col gap-2'>
				<Link href='https://bsky.app' target='_blank' rel='noreferrer'>
					Headline Searches Powered By Bluesky
				</Link>
				<Link href='https://www.allsides.com/bias/bias-ratings' target='_blank' rel='noreferrer'>
					Source Media Bias Ratings From AllSides.com
				</Link>
				<Link href='https://logo.dev' target='_blank' rel='noreferrer'>
					Logos provided by Logo.dev
				</Link>
			</div>
			<div className='flex flex-col gap-2'>
				<Link href='/privacy-policy' target='_blank'>
					Privacy Policy
				</Link>
				<Link href='/terms' target='_blank'>
					Terms and Conditions
				</Link>
			</div>
		</div>
	</footer>
);

export default Footer;
