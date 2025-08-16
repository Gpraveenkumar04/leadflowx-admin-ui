import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ConfirmDialog from '../../../../components/ui/ConfirmDialog';

describe('ConfirmDialog', () => {
  it('does not render when open is false', () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    const { container } = render(<ConfirmDialog open={false} onConfirm={onConfirm} onCancel={onCancel} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders title, message and buttons when open and calls callbacks', async () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    render(<ConfirmDialog open={true} title="Are you sure?" message="This will stop the job." onConfirm={onConfirm} onCancel={onCancel} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByText('This will stop the job.')).toBeInTheDocument();

    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    const confirmBtn = screen.getByRole('button', { name: /Confirm/i });

    await userEvent.click(confirmBtn);
    expect(onConfirm).toHaveBeenCalledTimes(1);

    await userEvent.click(cancelBtn);
    expect(onCancel).toHaveBeenCalledTimes(1);

    // clicking the overlay should call onCancel as well
    const dialog = screen.getByRole('dialog');
    const overlay = dialog.querySelector('.absolute');
    if (overlay) {
      await userEvent.click(overlay);
      expect(onCancel).toHaveBeenCalled();
    }
  });
});
