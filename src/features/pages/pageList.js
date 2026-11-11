// The plain text pages: Privacy, Terms, Contact. "sections" is how many text blocks each has.
export const pages = [
  { id: 'privacy', path: '/privacy', sections: 5 },
  { id: 'terms', path: '/terms', sections: 6 },
  { id: 'licences', path: '/licences', sections: 5 },
  { id: 'help', path: '/help', sections: 8 },
  { id: 'contact', path: '/contact', sections: 1 },
];

export function findPageByPath(path) {
  return pages.find((page) => page.path === path);
}
