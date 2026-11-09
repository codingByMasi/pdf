// Button that switches between the light and dark look (sun or moon icon).
import { useState } from 'react';
import { useI18n } from '../i18n/useI18n.js';
import { currentTheme, setTheme } from '../lib/theme.js';
import { Icon } from './Icon.jsx';

export function ThemeSwitch({ className = '' }) {
  const { t } = useI18n();
  const [theme, setCurrent] = useState(currentTheme);
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      type="button"
      className={`theme-button ${className}`.trim()}
      aria-label={t(next === 'dark' ? 'theme.toDark' : 'theme.toLight')}
      onClick={() => { setTheme(next); setCurrent(next); }}
    >
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={20} />
      <span className="theme-word">{t(next === 'dark' ? 'theme.dark' : 'theme.light')}</span>
    </button>
  );
}
