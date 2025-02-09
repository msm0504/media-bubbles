import Link from 'next/link';
import { Box, Container, Link as MuiLink, Stack } from '@mui/material';

const Footer: React.FC = () => (
	<footer>
		<Box bgcolor='common.white' width='100%' padding={3}>
			<Container maxWidth='xl'>
				<Stack
					direction={{ xs: 'column', md: 'row' }}
					spacing={{ xs: 2, md: 5 }}
					justifyContent={{ md: 'start' }}
				>
					<Stack spacing={2}>
						<MuiLink href='https://bsky.app' target='_blank' rel='noreferrer'>
							Headline Searches Powered By Bluesky
						</MuiLink>
						<MuiLink
							href='https://www.allsides.com/bias/bias-ratings'
							target='_blank'
							rel='noreferrer'
						>
							Source Media Bias Ratings From AllSides.com
						</MuiLink>
						<MuiLink href='https://logo.dev' target='_blank' rel='noreferrer'>
							Logos provided by Logo.dev
						</MuiLink>
					</Stack>
					<Stack spacing={2}>
						<MuiLink component={Link} href='/privacy-policy' target='_blank'>
							Privacy Policy
						</MuiLink>
						<MuiLink component={Link} href='/terms' target='_blank'>
							Terms and Conditions
						</MuiLink>
					</Stack>
				</Stack>
			</Container>
		</Box>
	</footer>
);

export default Footer;
