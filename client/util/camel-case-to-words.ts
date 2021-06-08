const camelCaseToWords = (str: string): string => str.replace(/([A-Z])/g, ' $1').toLowerCase();
export default camelCaseToWords;
