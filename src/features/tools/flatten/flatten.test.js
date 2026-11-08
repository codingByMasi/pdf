// Tests for flatten: form fields disappear, plain files pass, and picture pages are built.
import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { tinyJpg } from '../../../shared/lib/testImages.js';
import { flattenForms } from './flattenForms.js';
import { rasterPagesToPdf } from './rasterPagesToPdf.js';

describe('flattenForms', () => {
  it('turns form fields into page content', async () => {
    const doc = await PDFDocument.create();
    const page = doc.addPage([300, 300]);
    const field = doc.getForm().createTextField('name');
    field.setText('Ann');
    field.addToPage(page, { x: 20, y: 200, width: 150, height: 24 });
    const { bytes, fields } = await flattenForms(await doc.save());
    const flat = (await PDFDocument.load(bytes)).getPage(0);
    expect(flat.node.Annots()).toBeUndefined();
    expect(fields).toBe(1);
    expect((await PDFDocument.load(bytes)).getForm().getFields()).toHaveLength(0);
  });

  it('keeps a plain file as it is and says there were no fields', async () => {
    const doc = await PDFDocument.create();
    doc.addPage([300, 300]);
    expect((await flattenForms(await doc.save())).fields).toBe(0);
  });
});

describe('rasterPagesToPdf', () => {
  it('makes one page per picture at the given size', async () => {
    const bytes = await rasterPagesToPdf([{ bytes: tinyJpg, width: 200, height: 300 }, { bytes: tinyJpg, width: 400, height: 100 }]);
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBe(2);
    expect(doc.getPage(1).getSize()).toEqual({ width: 400, height: 100 });
  });
});
