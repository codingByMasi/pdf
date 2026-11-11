// Site-wide settings: the site name, file limits, and the ads on/off switch.
export const config = {
  siteName: 'PDF Shortener',
  // CHANGE THESE two when you have your real web address and email.
  siteUrl: 'https://pdfshortener.com',
  contactEmail: 'pdfshortener@gmail.com',
  defaultLang: 'en',
  // Keep enabled false until Google approves the site. Then set publisherId (ca-pub-...) and the slot ids, and see docs/12-adsense.md.
  ads: { enabled: false, publisherId: 'ca-pub-6973524994504204', slots: { footer: '' } },
  limits: {
    maxFileMB: 100,
    maxFiles: 50,
    maxThumbPages: 150,
    maxImagePages: 100,
  },
};
