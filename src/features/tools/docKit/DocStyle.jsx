// Two shared choices for document makers: the language written inside the PDF, and the accent colour.
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';

export const ACCENTS = { blue: '#1d4ed8', green: '#15803d', red: '#b91c1c', purple: '#6d28d9', black: '#111827' };

// Returns { docLang, accent } and the two controls.
export function useDocStyle(withLang = true) {
  const { t, lang } = useI18n();
  const [docLang, setDocLang] = usePref('doc.lang', '');
  const [accentName, setAccent] = usePref('doc.accent', 'blue');
  const chosenLang = docLang === 'en' || docLang === 'hi' ? docLang : lang === 'hi' ? 'hi' : 'en';
  const controls = (
    <>
      {withLang ? <ChoiceGroup chips legend={t('doc.lang')} value={chosenLang} onChange={setDocLang} options={[{ value: 'en', label: 'English' }, { value: 'hi', label: 'हिन्दी' }]} /> : null}
      <ChoiceGroup chips legend={t('doc.accent')} value={accentName} onChange={setAccent} options={Object.keys(ACCENTS).map((v) => ({ value: v, label: t(`doc.c.${v}`) }))} />
    </>
  );
  return { docLang: chosenLang, accent: ACCENTS[accentName] ?? ACCENTS.blue, controls };
}
