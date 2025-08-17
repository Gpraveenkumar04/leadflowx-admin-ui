import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmDialog from '../ConfirmDialog';

describe('ConfirmDialog', () => {
  test('renders title and message and responds to buttons', async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();
    const onCancel = jest.fn();

    render(<ConfirmDialog open={true} title="Hello" message="Are you sure?" onConfirm={onConfirm} onCancel={onCancel} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();

    await user.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);

    await user.click(screen.getByText('Confirm'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  test('uses provided labels and focuses confirm button on open', async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();
    const onCancel = jest.fn();

    render(<ConfirmDialog open={true} title="X" message="Y" onConfirm={onConfirm} onCancel={onCancel} confirmLabel="Run" cancelLabel="Nope" />);

    expect(screen.getByText('Run')).toBeInTheDocument();
    expect(screen.getByText('Nope')).toBeInTheDocument();

    // confirm button should be focused
    expect(document.activeElement).toBe(screen.getByText('Run'));

    // pressing Enter triggers confirm
    await user.keyboard('{Enter}');
    expect(onConfirm).toHaveBeenCalledTimes(1);

    // pressing Escape triggers cancel
    await user.keyboard('{Escape}');
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('enter does not confirm when disableConfirm is true', async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();
    const onCancel = jest.fn();

    render(<ConfirmDialog open={true} title="X" message="Y" onConfirm={onConfirm} onCancel={onCancel} disableConfirm={true} />);

    // pressing Enter should not call onConfirm
    await user.keyboard('{Enter}');
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
