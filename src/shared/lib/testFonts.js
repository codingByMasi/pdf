// For tests only: loads the font files from disk instead of the web.
import { readFile } from 'node:fs/promises';

const FILES = {
  'regular|latin': 'latin-regular.ttf',
  'regular|deva': 'devanagari-regular.ttf',
  'bold|latin': 'latin-bold.ttf',
  'bold|deva': 'devanagari-bold.ttf',
};

export async function loadTestFont(face, script) {
  return new Uint8Array(await readFile(new URL(`../../assets/fonts/${FILES[`${face}|${script}`]}`, import.meta.url)));
}
