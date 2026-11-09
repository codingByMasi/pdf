// App entry: mounts React and loads the global styles.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/base.css';
import './styles/layout.css';
import './styles/home.css';
import './styles/tool.css';
import './styles/components.css';
import './styles/images.css';
import './styles/editor.css';
import './styles/theme.css';
import { applyStoredTheme } from './shared/lib/theme.js';

applyStoredTheme();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Offline copy: only on the real site, and quietly ignored if the browser cannot do it.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}
