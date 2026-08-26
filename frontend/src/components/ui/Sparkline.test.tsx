import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Sparkline } from './Sparkline';

describe('Sparkline', () => {
  it('renders one bar per value', () => {
    const { container } = render(<Sparkline values={[70, 72, 68, 75]} />);
    const root = container.querySelector('[aria-hidden="true"]');
    expect(root?.children).toHaveLength(4);
  });

  it('renders nothing for an empty series', () => {
    const { container } = render(<Sparkline values={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('gives every bar a positive height even when all values are equal', () => {
    const { container } = render(<Sparkline values={[70, 70, 70]} />);
    const bars = container.querySelector('[aria-hidden="true"]')!.children;
    Array.from(bars).forEach((bar) => {
      expect((bar as HTMLElement).style.height).not.toBe('0%');
    });
  });
});
