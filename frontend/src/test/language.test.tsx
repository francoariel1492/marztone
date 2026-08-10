import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@/i18n';
import { LanguageSelector } from '@/components/common/LanguageSelector';

describe('LanguageSelector', () => {
  it('permite cambiar el idioma a inglés', () => {
    render(<LanguageSelector />);
    const enButton = screen.getByLabelText('English');
    fireEvent.click(enButton);
    expect(enButton).toHaveAttribute('aria-pressed', 'true');
  });
});
