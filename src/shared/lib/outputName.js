// Makes a safe download file name from the original name, like "report-edited.pdf".
export function outputName(inputName, suffix, extension = 'pdf') {
  const dot = inputName.lastIndexOf('.');
  const base = (dot >= 0 ? inputName.slice(0, dot) : inputName)
    .replace(/[^\p{L}\p{M}\p{N}_ -]/gu, '')
    .trim()
    .slice(0, 80);
  return `${base || 'file'}${suffix}.${extension}`;
}
