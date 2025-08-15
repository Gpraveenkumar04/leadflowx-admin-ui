import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import JobForm from '../../../components/jobs/JobForm';

describe('JobForm', () => {
  it('renders and submits valid data', () => {
    const onSubmit = jest.fn();
    const onClose = jest.fn();

    render(<JobForm isOpen={true} onClose={onClose} onSubmit={onSubmit} />);

  const nameInput = screen.getByLabelText(/job name/i);
  fireEvent.change(nameInput, { target: { value: 'Test Job' } });

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    expect(onSubmit).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });
});
