// Build setup: React plugin, test setup, and the one-place site name for index.html.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { config } from './src/config.js';

const siteNamePlugin = {
  name: 'site-name',
  transformIndexHtml: (html) => {
    const named = html.replaceAll('%SITE_NAME%', config.siteName);
    // Lets Google check that you own the site. A plain label: no ad code runs and no cookies are set.
    const id = config.ads.publisherId;
    return id ? named.replace('</head>', `    <meta name="google-adsense-account" content="${id}" />\n  </head>`) : named;
  },
};

// Preloads the two main fonts so text does not jump when they arrive.
const fontPreloadPlugin = {
  name: 'font-preload',
  transformIndexHtml: {
    order: 'post',
    handler: (html, ctx) => {
      const names = Object.keys(ctx.bundle || {}).filter((n) => /(dm-sans-latin-400-normal|manrope-latin-800-normal).*\.woff2$/.test(n));
      const tags = names.map((n) => `<link rel="preload" as="font" type="font/woff2" crossorigin href="/${n}">`).join('\n    ');
      return html.replace('</head>', `    ${tags}\n  </head>`);
    },
  },
};

export default defineConfig({
  plugins: [react(), siteNamePlugin, fontPreloadPlugin],
  // Wide target so older phones and browsers can run the site.
  build: { target: ['es2020', 'chrome80', 'edge88', 'firefox78', 'safari13.1'], cssTarget: ['chrome80', 'safari13.1', 'firefox78'] },
  // Workers are loaded as modules so they can load pdf-lib on demand.
  worker: { format: 'es' },
  test: { environment: 'node', include: ['src/**/*.test.js', 'scripts/**/*.test.js'] },
});
