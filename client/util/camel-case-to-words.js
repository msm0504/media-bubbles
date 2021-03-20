const camelCaseToWords = str => str.replaceAll(/([A-Z])/g, ' $1').toLowerCase();
export default camelCaseToWords;
