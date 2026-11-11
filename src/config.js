// Site-wide settings: the site name, file limits, and the ads on/off switch.
export const config = {
  siteName: 'PDF Shortner',
  // CHANGE THESE two when you have your real web address and email.
  siteUrl: 'https://pdfshortner.com',
  contactEmail: 'hello@example.com',
  defaultLang: 'en',
  ads: { enabled: false },
  limits: {
    maxFileMB: 100,
    maxFiles: 50,
    maxThumbPages: 150,
    maxImagePages: 100,
  },
};
