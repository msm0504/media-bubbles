class IconUtil {
	static getIconUrl(siteUrl) {
		const iconApiUrl = 'https://logo.clearbit.com';
		if (siteUrl.indexOf('abcnews') > -1) {
			return this.getIconUrlSecondTry(siteUrl);
		}
		return `${iconApiUrl}/${siteUrl}`;
	}

	static getIconUrlSecondTry(siteUrl, size) {
		const iconApiUrl2 = 'https://icon-locator.herokuapp.com/icon';
		const defaultSize = '70..120..200';
		return `${iconApiUrl2}?url=${siteUrl}&size=${size || defaultSize}`;
	}
}

export default IconUtil;
