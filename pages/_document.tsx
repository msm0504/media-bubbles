import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
	render(): JSX.Element {
		return (
			<Html lang='en'>
				<Head>
					<link
						href='https://fonts.googleapis.com/css2?family=Roboto+Slab&display=swap'
						rel='stylesheet'
					/>
					<link rel='manifest' href='/pwa/manifest.json' />
					<link rel='apple-touch-icon' href='/pwa/icon.png'></link>
					<meta name='theme-color' content='#a800e6' />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
