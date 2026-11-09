// Tells Hindi (Devanagari) letters apart from everything else, so each piece gets the right font.
const DEVA = /[ऀ-ॿ꣠-ꣿ᳐-᳿₹]/;

export function hasDeva(text) {
  return DEVA.test(text);
}

export function isDeva(char) {
  return DEVA.test(char);
}

// Cuts text into pieces of one script: [{ text, script: 'deva' | 'latin' }]. Joiner marks stay inside Hindi words.
export function splitByScript(text) {
  const runs = [];
  let prevDeva = false;
  for (const char of text) {
    const deva = DEVA.test(char) || ((char === '‌' || char === '‍') && prevDeva);
    prevDeva = deva;
    const script = deva ? 'deva' : 'latin';
    const last = runs[runs.length - 1];
    if (last && last.script === script) last.text += char;
    else runs.push({ text: char, script });
  }
  return runs;
}
