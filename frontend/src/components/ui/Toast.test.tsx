import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast } from './Toast';

function Trigger() {
  const { showToast } = useToast();
  return <button onClick={() => showToast('Vitals recorded', 'success')}>Trigger</button>;
}

describe('ToastProvider', () => {
  it('shows a toast when showToast is called, and dismisses it on demand', async () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>
    );

    await userEvent.click(screen.getByRole('button', { name: 'Trigger' }));
    expect(screen.getByRole('status')).toHaveTextContent('Vitals recorded');

    await userEvent.click(screen.getByRole('button', { name: /dismiss notification/i }));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('throws when useToast is used outside a ToastProvider', () => {
    const BadComponent = () => {
      useToast();
      return null;
    };
    // Suppress the expected React error-boundary console noise for this one assertion.
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<BadComponent />)).toThrow('useToast must be used within a ToastProvider');
    spy.mockRestore();
  });
});
