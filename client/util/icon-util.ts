class IconUtil {
	static getIconUrl(siteUrl: string): string {
		const iconApiUrl = 'https://logo.clearbit.com';
		if (siteUrl.includes('abcnews') || siteUrl.includes('americanconservative')) {
			return this.getIconUrlSecondTry(siteUrl);
		}
		siteUrl = siteUrl.replace('huffingtonpost', 'huffpost');
		return `${iconApiUrl}/${siteUrl}`;
	}

	static getIconUrlSecondTry(siteUrl: string, size?: string): string {
		const iconApiUrl2 = 'https://icon-locator.herokuapp.com/icon';
		const defaultSize = '70..120..200';
		return `${iconApiUrl2}?url=${siteUrl}&size=${size || defaultSize}`;
	}
}

export default IconUtil;
