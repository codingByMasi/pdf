// Contact form with no server: on send, it opens the visitor's email app with the message filled in.
import { useState } from 'react';
import { config } from '../../config.js';
import { useI18n } from '../../shared/i18n/useI18n.js';
import { Button } from '../../shared/ui/Button.jsx';
import { TextField } from '../../shared/ui/TextField.jsx';

export function ContactForm() {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function send(event) {
    event.preventDefault();
    const subject = encodeURIComponent(`${config.siteName}: ${name}`);
    const body = encodeURIComponent(`${message}\n\n${name}\n${email}`);
    window.location.href = `mailto:${config.contactEmail}?subject=${subject}&body=${body}`;
  }

  return (
    <form className="contact-form" onSubmit={send}>
      <h2>{t('contact.formLabel')}</h2>
      <TextField label={t('contact.formName')} value={name} required autoComplete="name" onChange={(e) => setName(e.target.value)} />
      <TextField label={t('contact.formEmail')} type="email" value={email} required autoComplete="email" onChange={(e) => setEmail(e.target.value)} />
      <TextField label={t('contact.formMessage')} multiline value={message} required onChange={(e) => setMessage(e.target.value)} />
      <Button type="submit">{t('contact.formSend')}</Button>
      <p className="field-hint">{t('contact.formNote')}</p>
    </form>
  );
}
