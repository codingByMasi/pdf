// Build setup: React plugin, test setup, and the one-place site name for index.html.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { config } from './src/config.js';

const siteNamePlugin = {
  name: 'site-name',
  transformIndexHtml: (html) => html.replaceAll('%SITE_NAME%', config.siteName),
};

export default defineConfig({
  plugins: [react(), siteNamePlugin],
  // Wide target so older phones and browsers can run the site.
  build: { target: ['es2020', 'chrome80', 'edge88', 'firefox78', 'safari13.1'], cssTarget: ['chrome80', 'safari13.1', 'firefox78'] },
  test: { environment: 'node', include: ['src/**/*.test.js', 'scripts/**/*.test.js'] },
});
