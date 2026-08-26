import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginPage } from './LoginPage';

function renderLoginPage(overrides: Partial<React.ComponentProps<typeof LoginPage>> = {}) {
  const props: React.ComponentProps<typeof LoginPage> = {
    onGuestLogin: vi.fn(),
    onLogin: vi.fn((e) => e.preventDefault()),
    email: '',
    setEmail: vi.fn(),
    password: '',
    setPassword: vi.fn(),
    loading: false,
    ...overrides,
  };
  render(<LoginPage {...props} />);
  return props;
}

describe('LoginPage', () => {
  it('submits the sign-in form', async () => {
    // Required fields must be non-empty or jsdom's native HTML5 validation
    // blocks the submit event before onSubmit ever fires.
    const props = renderLoginPage({ email: 'demo@lifeline.ai', password: 'demo1234' });

    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(props.onLogin).toHaveBeenCalledTimes(1);
  });

  it('calls onGuestLogin when continuing as guest', async () => {
    const props = renderLoginPage();

    await userEvent.click(screen.getByRole('button', { name: /continue as guest/i }));

    expect(props.onGuestLogin).toHaveBeenCalledTimes(1);
  });

  it('disables both actions while loading', () => {
    renderLoginPage({ loading: true });

    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled();
  });
});
