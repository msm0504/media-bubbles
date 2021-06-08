import { useEffect } from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import useAlerts from '../use-alerts';

Element.prototype.scrollIntoView = jest.fn();

const testAlert = { message: 'Urgent, urgent, emergency', level: 'danger' };

describe('useAlerts', () => {
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

	it('should render the component', () => {
		expect(screen.queryByText('Urgent, urgent, emergency')).toBeInTheDocument();
	});

	it('should close when button is clicked', () => {
		fireEvent.click(screen.getByLabelText('Close alert'));
		expect(screen.queryByText('Urgent, urgent, emergency')).not.toBeInTheDocument();
	});
});
