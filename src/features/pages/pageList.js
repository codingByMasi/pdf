// The plain text pages: About, Privacy, Terms, Contact. "sections" is how many text blocks each has.
export const pages = [
  { id: 'about', path: '/about', sections: 5 },
  { id: 'privacy', path: '/privacy', sections: 13 },
  { id: 'terms', path: '/terms', sections: 9 },
  { id: 'licences', path: '/licences', sections: 5 },
  { id: 'help', path: '/help', sections: 8 },
  { id: 'contact', path: '/contact', sections: 1 },
];

export function findPageByPath(path) {
  return pages.find((page) => page.path === path);
}
