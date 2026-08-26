import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders its label and responds to clicks', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Schedule Now</Button>);

    const button = screen.getByRole('button', { name: 'Schedule Now' });
    await userEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire onClick while disabled', async () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Schedule Now
      </Button>
    );

    await userEvent.click(screen.getByRole('button', { name: 'Schedule Now' }));

    expect(onClick).not.toHaveBeenCalled();
  });
});
