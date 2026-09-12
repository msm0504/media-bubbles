import capitalize from 'lodash.capitalize';

export const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const getRequiredMessage = (fieldName: string): string =>
	`${capitalize(fieldName)} is required`;
