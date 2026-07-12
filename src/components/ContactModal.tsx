"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { X, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { submitContact, type ContactType } from "@/lib/contact-api";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTACT_TYPES: ContactType[] = ["demo", "contact", "hardware", "gateway"];

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

export function ContactModal({
  type,
  onClose,
}: {
  type: ContactType;
  onClose: () => void;
}) {
  const t = useTranslations("contact");
  const titleId = useId();

  const [startedAt] = useState(() => Date.now());
  const [form, setForm] = useState({
    type,
    name: "",
    email: "",
    organization: "",
    message: "",
    website: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [apiError, setApiError] = useState<{ message: string; details?: string[] } | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const validate = () => {
    const next: FieldErrors = {};
    if (!form.name.trim()) next.name = t("errors.nameRequired");
    if (!form.email.trim()) next.email = t("errors.emailRequired");
    else if (!EMAIL_RE.test(form.email.trim())) next.email = t("errors.emailInvalid");
    if (!form.message.trim()) next.message = t("errors.messageRequired");
    else if (form.message.trim().length < 10) next.message = t("errors.messageTooShort");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;

    setStatus("submitting");
    const result = await submitContact({
      type: form.type,
      name: form.name.trim(),
      email: form.email.trim(),
      organization: form.organization.trim() || undefined,
      message: form.message.trim(),
      website: form.website,
      startedAt,
    });

    if (result.ok) {
      setSuccessMessage(result.message ?? t("successBody"));
      setStatus("success");
      return;
    }

    setStatus("idle");
    if (result.status === 429) {
      setApiError({ message: t("errors.rateLimit") });
    } else if (result.status === 400) {
      setApiError({ message: result.message ?? t("errors.generic"), details: result.details });
    } else {
      setApiError({ message: t("errors.generic") });
    }
  };

  return (
    <div
      className="contact-modal-overlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="contact-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <button
          type="button"
          className="contact-modal__close"
          aria-label={t("close")}
          onClick={onClose}
        >
          <X aria-hidden="true" />
        </button>

        {status === "success" ? (
          <div className="contact-modal__success">
            <span className="contact-modal__success-icon" aria-hidden="true">
              <CheckCircle2 />
            </span>
            <h2 id={titleId} className="contact-modal__title contact-modal__title--center">
              {t("successTitle")}
            </h2>
            <p>{successMessage}</p>
            <div className="contact-modal__actions">
              <button type="button" className="btn btn--primary" onClick={onClose}>
                {t("successClose")}
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 id={titleId} className="contact-modal__title">
              {t("title")}
            </h2>

            {apiError && (
              <div className="contact-modal__banner contact-modal__banner--error" role="alert">
                <span className="contact-modal__banner-row">
                  <AlertCircle aria-hidden="true" />
                  {apiError.message}
                </span>
                {apiError.details && apiError.details.length > 0 && (
                  <ul>
                    {apiError.details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <form className="contact-modal__fields" onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label htmlFor={`${titleId}-type`}>{t("typeLabel")}</label>
                <select
                  id={`${titleId}-type`}
                  value={form.type}
                  onChange={(e) => update("type", e.target.value as ContactType)}
                >
                  {CONTACT_TYPES.map((ct) => (
                    <option key={ct} value={ct}>
                      {t(`type.${ct}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div className={`field ${errors.name ? "field--error" : ""}`}>
                <label htmlFor={`${titleId}-name`}>{t("nameLabel")}</label>
                <input
                  id={`${titleId}-name`}
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  placeholder={t("namePlaceholder")}
                  onChange={(e) => update("name", e.target.value)}
                />
                {errors.name && <span className="field__error">{errors.name}</span>}
              </div>

              <div className={`field ${errors.email ? "field--error" : ""}`}>
                <label htmlFor={`${titleId}-email`}>{t("emailLabel")}</label>
                <input
                  id={`${titleId}-email`}
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  placeholder={t("emailPlaceholder")}
                  onChange={(e) => update("email", e.target.value)}
                />
                {errors.email && <span className="field__error">{errors.email}</span>}
              </div>

              <div className="field">
                <label htmlFor={`${titleId}-organization`}>
                  {t("organizationLabel")} <em>({t("organizationOptional")})</em>
                </label>
                <input
                  id={`${titleId}-organization`}
                  type="text"
                  autoComplete="organization"
                  value={form.organization}
                  placeholder={t("organizationPlaceholder")}
                  onChange={(e) => update("organization", e.target.value)}
                />
              </div>

              <div className={`field ${errors.message ? "field--error" : ""}`}>
                <label htmlFor={`${titleId}-message`}>{t("messageLabel")}</label>
                <textarea
                  id={`${titleId}-message`}
                  value={form.message}
                  placeholder={t("messagePlaceholder")}
                  onChange={(e) => update("message", e.target.value)}
                />
                {errors.message && <span className="field__error">{errors.message}</span>}
              </div>

              {/* Honeypot: must stay empty. Hidden from sighted users, keyboard focus, and screen readers. */}
              <div className="contact-modal__hp" aria-hidden="true">
                <label htmlFor={`${titleId}-website`}>Website</label>
                <input
                  id={`${titleId}-website`}
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => update("website", e.target.value)}
                />
              </div>

              <div className="contact-modal__actions">
                <button
                  type="submit"
                  className="btn btn--primary btn--lg"
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="contact-modal__spinner" aria-hidden="true" />
                      {t("submitting")}
                    </>
                  ) : (
                    t("submit")
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
