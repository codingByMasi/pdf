// Which tools show a short "use it responsibly" note under the tool, and which note. Data only.
export const notices = {
  editPdf: 'rights',
  annotate: 'rights',
  formFill: 'rights',
  pdfInfo: 'rights',
  findReplace: 'rights',
  headerFooter: 'rights',
  watermark: 'rights',
  sign: 'sign',
  redact: 'redact',
  stamp: 'stamp',
  qrPages: 'rights',
  photoSheet: 'id',
  voiceRecorder: 'record',
  screenRecorder: 'record',
  invoiceMaker: 'docs',
  letterMaker: 'docs',
  visitingCard: 'docs',
  certificateMaker: 'docs',
  namePlate: 'docs',
  emiCalc: 'calc',
  numberWords: 'words',
  imageText: 'rights',
  imageBlur: 'rights',
  imageBackground: 'rights',
};

export function noticeFor(toolId) {
  return notices[toolId] ? `notice.${notices[toolId]}` : null;
}
