'use client';

import { FormEvent, useState } from 'react';
import { useTranslations } from 'next-intl';

import { submitContact, type ContactType } from '@/lib/contact-api';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Nur diese beiden — für alles Übrige gibt es das Kontaktformular. */
const ARTEN: Extract<ContactType, 'feature' | 'feedback'>[] = ['feature', 'feedback'];

/**
 * Rückmeldungen und Funktionswünsche von der Website.
 *
 * Geht über denselben öffentlichen Weg wie die Kontaktanfrage, inklusive
 * dessen Spam-Schutz: ein für Menschen unsichtbares Feld und die Zeit
 * zwischen Laden und Absenden. Beides wandert unverändert mit, weil der
 * Server sich darauf verlässt.
 */
export function FeedbackForm() {
  const t = useTranslations('feedback');

  const [startedAt] = useState(() => Date.now());
  const [art, setArt] = useState<(typeof ARTEN)[number]>('feature');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nachricht, setNachricht] = useState('');
  const [honig, setHonig] = useState('');
  const [fehler, setFehler] = useState<Record<string, string>>({});
  const [zustand, setZustand] = useState<'idle' | 'sendet' | 'fertig'>('idle');
  const [apiFehler, setApiFehler] = useState<string | null>(null);

  const pruefen = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = t('errors.nameRequired');
    if (!email.trim()) next.email = t('errors.emailRequired');
    else if (!EMAIL_RE.test(email.trim())) next.email = t('errors.emailInvalid');
    if (!nachricht.trim()) next.message = t('errors.messageRequired');
    else if (nachricht.trim().length < 10) next.message = t('errors.messageTooShort');
    setFehler(next);
    return Object.keys(next).length === 0;
  };

  const absenden = async (e: FormEvent) => {
    e.preventDefault();
    setApiFehler(null);
    if (!pruefen()) return;

    setZustand('sendet');
    const ergebnis = await submitContact({
      type: art,
      name: name.trim(),
      email: email.trim(),
      message: nachricht.trim(),
      website: honig,
      startedAt,
    });

    if (ergebnis.ok) {
      setZustand('fertig');
      return;
    }

    setZustand('idle');
    setApiFehler(ergebnis.status === 429 ? t('errors.rateLimit') : t('errors.generic'));
  };

  if (zustand === 'fertig') {
    return (
      <div className="feedback__done">
        <span className="feedback__done-icon" aria-hidden="true">
          ✓
        </span>
        <h2 className="feedback__done-title">{t('successTitle')}</h2>
        <p className="feedback__done-text">{t('successBody')}</p>
      </div>
    );
  }

  return (
    <form className="feedback__form" onSubmit={absenden} noValidate>
      <fieldset className="feedback__kinds">
        <legend className="field__label">{t('kindLabel')}</legend>
        <div className="feedback__kind-row">
          {ARTEN.map((wert) => (
            <label
              key={wert}
              className={`feedback__kind${art === wert ? ' is-active' : ''}`}
            >
              <input
                type="radio"
                name="art"
                value={wert}
                checked={art === wert}
                onChange={() => setArt(wert)}
              />
              <span className="feedback__kind-title">{t(`kinds.${wert}.title`)}</span>
              <span className="feedback__kind-hint">{t(`kinds.${wert}.hint`)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={`field ${fehler.name ? 'field--error' : ''}`}>
        <label className="field__label" htmlFor="fb-name">
          {t('name')}
        </label>
        <input
          id="fb-name"
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
        {fehler.name && <span className="field__error">{fehler.name}</span>}
      </div>

      <div className={`field ${fehler.email ? 'field--error' : ''}`}>
        <label className="field__label" htmlFor="fb-email">
          {t('email')}
        </label>
        <input
          id="fb-email"
          className="input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        {fehler.email ? (
          <span className="field__error">{fehler.email}</span>
        ) : (
          <span className="field__hint">{t('emailHint')}</span>
        )}
      </div>

      <div className={`field ${fehler.message ? 'field--error' : ''}`}>
        <label className="field__label" htmlFor="fb-message">
          {t('message')}
        </label>
        <textarea
          id="fb-message"
          className="textarea"
          rows={6}
          value={nachricht}
          onChange={(e) => setNachricht(e.target.value)}
          placeholder={t(`kinds.${art}.placeholder`)}
        />
        {fehler.message && <span className="field__error">{fehler.message}</span>}
      </div>

      {/* Für Menschen unsichtbar; wer hier etwas einträgt, ist keiner. */}
      <div className="feedback__trap" aria-hidden="true">
        <label htmlFor="fb-website">Website</label>
        <input
          id="fb-website"
          tabIndex={-1}
          autoComplete="off"
          value={honig}
          onChange={(e) => setHonig(e.target.value)}
        />
      </div>

      {apiFehler && (
        <p className="feedback__error" role="alert">
          {apiFehler}
        </p>
      )}

      <button type="submit" className="btn btn--primary btn--lg" disabled={zustand === 'sendet'}>
        {zustand === 'sendet' ? '…' : t('submit')}
      </button>
    </form>
  );
}
