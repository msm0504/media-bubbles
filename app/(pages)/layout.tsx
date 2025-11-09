'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Box, Container, Typography } from '@mui/material';
import { AppProviders } from '@/contexts';
import { ParentCompProps } from '@/types';
import background from '@/public/images/background.png';
import bannerBackground from '@/public/images/banner.png';
import styles from '@/styles/main.module.css';

const Header: React.FC = () => (
	<Box
		className={styles.headerImgContainer}
		width='100%'
		tabIndex={0}
		role='button'
		component={Link}
		href='/'
	>
		<Image
			alt='banner background'
			src={bannerBackground}
			quality={100}
			fill
			className={styles.headerImg}
		/>
		<Container
			sx={{ margin: 'auto', paddingX: 4, paddingY: 16, textAlign: 'center' }}
			maxWidth='md'
		>
			<Typography
				className={styles.outlinedText}
				variant='h1'
				component='h1'
				fontWeight='bold'
				color='light'
			>
				Media Bubbles
			</Typography>
		</Container>
	</Box>
);

const NonHomeLayout: React.FC<ParentCompProps> = ({ children }) => (
	<Box sx={{ margin: 0, padding: 0 }}>
		<div className={styles.bgImgContainer}>
			<Image
				alt='background'
				src={background}
				quality={100}
				fill
				sizes='100vw'
				style={{
					objectFit: 'cover',
				}}
			/>
		</div>
		<Box sx={{ background: 'transparent' }}>
			<Header />
			<Container maxWidth='xl' sx={{ padding: { xs: 2, md: 5 }, minHeight: '600px' }}>
				<AppProviders>{children}</AppProviders>
			</Container>
		</Box>
	</Box>
);

export default NonHomeLayout;
