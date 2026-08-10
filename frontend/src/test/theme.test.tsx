import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeProvider, useTheme } from '@/store/theme';

function ThemeProbe() {
  const { mode, isDark, setMode } = useTheme();
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <span data-testid="dark">{String(isDark)}</span>
      <button onClick={() => setMode('dark')}>dark</button>
      <button onClick={() => setMode('light')}>light</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  it('cambia a modo oscuro y aplica la clase dark', () => {
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByText('dark'));
    expect(screen.getByTestId('mode').textContent).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    fireEvent.click(screen.getByText('light'));
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
