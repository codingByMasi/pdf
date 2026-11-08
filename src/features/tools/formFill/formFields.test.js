// Tests for the form filler and page replacing (used by Redact).
import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { tinyJpg } from '../../../shared/lib/testImages.js';
import { replacePages } from '../redact/replacePages.js';
import { fillFormFields, readFormFields } from './formFields.js';

async function sampleForm() {
  const doc = await PDFDocument.create();
  const page = doc.addPage([300, 400]);
  const form = doc.getForm();
  form.createTextField('name').addToPage(page, { x: 20, y: 340, width: 150, height: 24 });
  form.createCheckBox('agree').addToPage(page, { x: 20, y: 300, width: 20, height: 20 });
  const drop = form.createDropdown('city');
  drop.addOptions(['Delhi', 'Pune']);
  drop.addToPage(page, { x: 20, y: 260, width: 150, height: 24 });
  const radio = form.createRadioGroup('size');
  radio.addOptionToPage('S', page, { x: 20, y: 220, width: 20, height: 20 });
  radio.addOptionToPage('L', page, { x: 60, y: 220, width: 20, height: 20 });
  return doc.save();
}

describe('form filler', () => {
  it('lists the fields with types, options and pages', async () => {
    const fields = await readFormFields(await sampleForm());
    expect(fields.map((f) => [f.name, f.type])).toEqual([['name', 'text'], ['agree', 'check'], ['city', 'choice'], ['size', 'radio']]);
    expect(fields[2].options).toEqual(['Delhi', 'Pune']);
    expect(fields[0].page).toBe(0);
  });

  it('writes values back, and can lock the fields', async () => {
    const bytes = await fillFormFields(await sampleForm(), { name: 'Ann', agree: true, city: 'Pune', size: 'L' });
    const again = await readFormFields(bytes);
    expect(again.map((f) => f.value)).toEqual(['Ann', true, 'Pune', 'L']);
    const locked = await fillFormFields(await sampleForm(), { name: 'Ann' }, { flatten: true });
    expect((await PDFDocument.load(locked)).getForm().getFields()).toHaveLength(0);
  });

  it('explains when a letter cannot be shown', async () => {
    await expect(fillFormFields(await sampleForm(), { name: 'नमस्ते' })).rejects.toMatchObject({ errorKey: 'error.formChars' });
  });
});

describe('replacePages', () => {
  it('swaps chosen pages for pictures and keeps the others', async () => {
    const doc = await PDFDocument.create();
    doc.addPage([100, 100]);
    doc.addPage([200, 300]);
    doc.addPage([100, 100]);
    const out = await PDFDocument.load(await replacePages(await doc.save(), [{ index: 1, bytes: tinyJpg, width: 250, height: 350 }]));
    expect(out.getPageCount()).toBe(3);
    expect(out.getPage(1).getSize()).toEqual({ width: 250, height: 350 });
    expect(out.getPage(2).getSize()).toEqual({ width: 100, height: 100 });
  });
});
