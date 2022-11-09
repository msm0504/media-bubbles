const NUM_LETTERS = 26;
const aCode = 'a'.charCodeAt(0);
const nameSuffix = '_test';

const generateSaveRecords = numRecords => {
	for (let i = 0; i < numRecords; i++) {
		const letter = String.fromCharCode(aCode + (i % NUM_LETTERS));
		const charsInPrefix = Math.floor(i / NUM_LETTERS) + 1;
		let prefix = '';
		while (prefix.length < charsInPrefix) prefix += letter;

		setTimeout(() => {
			fetch('http://localhost:8080/api/search-result', {
				method: 'POST',
				headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: `${prefix}${nameSuffix}`,
					articleMap: {},
					isSearchAll: false,
					sourceList: [],
					userId: '10157984953250379'
				})
			});
		}, i * 1000);
	}
};

generateSaveRecords(100);
