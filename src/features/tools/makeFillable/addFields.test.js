// Tests that real fields are added, with safe unique names.
import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { addFields, parseOptions } from './addFields.js';

async function makePdf() {
  const doc = await PDFDocument.create();
  doc.addPage([400, 600]);
  doc.addPage([400, 600]);
  return doc.save();
}
const field = (fieldKind, extra = {}) => ({ type: 'field', fieldKind, name: 'Name', x: 0.1, y: 0.1, w: 0.4, h: 0.05, ...extra });

describe('addFields', () => {
  it('adds a text box, a tick box and a drop-down', async () => {
    const result = await addFields(await makePdf(), {
      0: [field('text'), field('check', { name: 'Agree', w: 0.04 }), field('dropdown', { name: 'City', options: 'Delhi\nMumbai\nDelhi' })],
    });
    expect(result.count).toBe(3);
    const form = (await PDFDocument.load(result.bytes)).getForm();
    expect(form.getFields().map((f) => f.getName()).sort()).toEqual(['Agree', 'City', 'Name']);
    expect(form.getDropdown('City').getOptions()).toEqual(['Delhi', 'Mumbai']);
  });
  it('gives repeated names a number and cleans odd letters', async () => {
    const result = await addFields(await makePdf(), { 0: [field('text')], 1: [field('text'), field('text', { name: 'नाम' })] });
    const names = (await PDFDocument.load(result.bytes)).getForm().getFields().map((f) => f.getName()).sort();
    expect(names).toEqual(['Name', 'Name_2', 'text3']);
  });
  it('uses default list words when none are typed', () => {
    expect(parseOptions('  \n')).toEqual(['Option 1', 'Option 2']);
    expect(parseOptions('Café\nनाम')).toEqual(['Café', '???']);
  });
});
