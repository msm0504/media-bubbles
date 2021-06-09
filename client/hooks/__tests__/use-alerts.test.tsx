import { useEffect } from 'react';
import { cleanup, render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import useAlerts from '../use-alerts';

Element.prototype.scrollIntoView = jest.fn();

const testAlert = { message: 'Urgent, urgent, emergency', level: 'danger' };

beforeEach(() => {
	const Wrapper = () => {
		const [Alerts, showAlert] = useAlerts();

		useEffect(() => {
			showAlert(testAlert.level, testAlert.message);
		}, []);

		return <Alerts />;
	};
	render(<Wrapper />);
});

afterEach(cleanup);

test('renders the component', () => {
	expect(screen.queryByText('Urgent, urgent, emergency')).toBeInTheDocument();
});

test('closes when button is clicked', () => {
	fireEvent.click(screen.getByLabelText('Close alert'));
	expect(screen.queryByText('Urgent, urgent, emergency')).not.toBeInTheDocument();
});
