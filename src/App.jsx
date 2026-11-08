// Top of the app: language provider, page frame, and which page to show.
import { I18nProvider } from './shared/i18n/I18nProvider.jsx';
import { useRoute } from './shared/lib/router.js';
import { Layout } from './app/Layout.jsx';
import { HomePage } from './features/home/HomePage.jsx';
import { ToolPage } from './features/tools/ToolPage.jsx';
import { NotFoundPage } from './features/home/NotFoundPage.jsx';
import { findToolByPath } from './features/tools/toolList.js';
import { findPageByPath } from './features/pages/pageList.js';
import { InfoPage } from './features/pages/InfoPage.jsx';

function Page() {
  const route = useRoute();
  if (route === '/') return <HomePage />;
  const tool = findToolByPath(route);
  if (tool) return <ToolPage key={tool.id} tool={tool} />;
  const page = findPageByPath(route);
  return page ? <InfoPage key={page.id} page={page} /> : <NotFoundPage />;
}

export default function App() {
  return (
    <I18nProvider>
      <Layout>
        <Page />
      </Layout>
    </I18nProvider>
  );
}
