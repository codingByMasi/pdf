// Builds the structured data (JSON-LD) for a page. Only things the page really shows. No ratings, no reviews.
const CONTEXT = 'https://schema.org';

const crumbs = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: item.url })),
});

const howTo = (name, steps) => ({
  '@type': 'HowTo',
  name,
  step: steps.map((text, i) => ({ '@type': 'HowToStep', position: i + 1, text })),
});

const faqPage = (faq) => ({
  '@type': 'FAQPage',
  mainEntity: faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
});

// c: { siteName, siteUrl, url, lang, name, description, home: {name,url}, parents: [{name,url}] }
export function homeGraph(c) {
  return {
    '@context': CONTEXT,
    '@graph': [
      { '@type': 'Organization', name: c.siteName, url: c.siteUrl, logo: `${c.siteUrl}/icon-512.png` },
      { '@type': 'WebSite', name: c.siteName, url: c.url, inLanguage: c.lang },
    ],
  };
}

export function toolGraph(c, steps, faq) {
  return {
    '@context': CONTEXT,
    '@graph': [
      {
        '@type': 'WebApplication',
        name: c.name,
        url: c.url,
        description: c.description,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any (web browser)',
        inLanguage: c.lang,
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      howTo(c.name, steps),
      faqPage(faq),
      crumbs([c.home, { name: c.name, url: c.url }]),
    ],
  };
}

export function listGraph(c) {
  return { '@context': CONTEXT, '@graph': [{ '@type': 'CollectionPage', name: c.name, url: c.url, description: c.description, inLanguage: c.lang }, crumbs([c.home, ...c.parents, { name: c.name, url: c.url }])] };
}

export function guideGraph(c, steps, date) {
  return {
    '@context': CONTEXT,
    '@graph': [
      {
        '@type': 'Article',
        headline: c.name,
        description: c.description,
        url: c.url,
        inLanguage: c.lang,
        datePublished: date,
        dateModified: date,
        author: { '@type': 'Organization', name: c.siteName, url: c.siteUrl },
        publisher: { '@type': 'Organization', name: c.siteName, url: c.siteUrl },
      },
      howTo(c.name, steps),
      crumbs([c.home, ...c.parents, { name: c.name, url: c.url }]),
    ],
  };
}
