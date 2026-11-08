// Lists the fill-in fields of a PDF, and writes the values back into the form.
import { getPdfLib, loadPdf } from '../../../shared/lib/pdfLoad.js';
import { dropDeadAnnotations } from '../flatten/flattenForms.js';

// Returns [{ name, type: 'text' | 'check' | 'choice' | 'radio', value, options, multiline, readOnly, page }].
export async function readFormFields(bytes) {
  const { PDFTextField, PDFCheckBox, PDFDropdown, PDFOptionList, PDFRadioGroup } = await getPdfLib();
  const doc = await loadPdf(bytes);
  const pages = doc.getPages();
  const list = [];
  for (const field of doc.getForm().getFields()) {
    let entry = null;
    if (field instanceof PDFTextField) entry = { type: 'text', value: field.getText() ?? '', multiline: field.isMultiline() };
    else if (field instanceof PDFCheckBox) entry = { type: 'check', value: field.isChecked() };
    else if (field instanceof PDFDropdown || field instanceof PDFOptionList) {
      entry = { type: 'choice', value: field.getSelected()[0] ?? '', options: field.getOptions() };
    } else if (field instanceof PDFRadioGroup) entry = { type: 'radio', value: field.getSelected() ?? '', options: field.getOptions() };
    if (!entry) continue;
    let page = -1;
    try {
      const ref = field.acroField.getWidgets()[0]?.P();
      page = pages.findIndex((p) => p.ref === ref);
    } catch {
      page = -1;
    }
    list.push({ name: field.getName(), readOnly: field.isReadOnly(), page, ...entry });
  }
  return list;
}

// values: { [fieldName]: string | boolean }. Returns the new PDF bytes.
export async function fillFormFields(bytes, values, { flatten = false } = {}) {
  const { PDFTextField, PDFCheckBox, PDFDropdown, PDFOptionList, PDFRadioGroup } = await getPdfLib();
  const doc = await loadPdf(bytes);
  const form = doc.getForm();
  for (const field of form.getFields()) {
    const name = field.getName();
    if (!(name in values) || field.isReadOnly()) continue;
    const value = values[name];
    if (field instanceof PDFTextField) field.setText(value === '' ? undefined : String(value));
    else if (field instanceof PDFCheckBox) (value ? field.check() : field.uncheck());
    else if (field instanceof PDFDropdown || field instanceof PDFOptionList) {
      if (value === '') field.clear();
      else field.select(String(value));
    } else if (field instanceof PDFRadioGroup && value !== '') field.select(String(value));
  }
  try {
    form.updateFieldAppearances();
    if (flatten) {
      form.flatten();
      dropDeadAnnotations(doc);
    }
    return await doc.save();
  } catch {
    throw Object.assign(new Error('letters not supported'), { errorKey: 'error.formChars' });
  }
}
