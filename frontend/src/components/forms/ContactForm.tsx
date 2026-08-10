import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { contactSchema, type ContactFormValues } from '@/schemas/contact';
import { publicApi } from '@/api/public';
import { useLocalizedContent } from '@/hooks/useLocalizedContent';

const INQUIRY_TYPES = ['general', 'custom', 'repair', 'restoration', 'setup'] as const;

export function ContactForm() {
  const { t } = useTranslation();
  const { isEn } = useLocalizedContent();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { inquiryType: 'general', consent: undefined, website: '' },
  });

  const mutation = useMutation({
    mutationFn: (values: ContactFormValues) =>
      publicApi.sendContact({ ...values, language: isEn ? 'EN' : 'ES' }),
    onSuccess: () => {
      setStatus('success');
      reset();
    },
    onError: () => setStatus('error'),
  });

  const err = (key: keyof ContactFormValues) =>
    errors[key] ? t(errors[key]?.message ?? 'validation.required') : undefined;

  return (
    <form
      onSubmit={handleSubmit((values) => {
        setStatus('idle');
        mutation.mutate(values);
      })}
      className="card space-y-4 p-6 sm:p-8"
      noValidate
    >
      {/* Honeypot invisible */}
      <div className="hidden" aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">
            {t('contact.form.name')}
          </label>
          <input id="name" className="input" {...register('name')} aria-invalid={!!errors.name} />
          {err('name') && <p className="mt-1 text-xs text-red-600">{err('name')}</p>}
        </div>
        <div>
          <label className="label" htmlFor="email">
            {t('contact.form.email')}
          </label>
          <input
            id="email"
            type="email"
            className="input"
            {...register('email')}
            aria-invalid={!!errors.email}
          />
          {err('email') && <p className="mt-1 text-xs text-red-600">{err('email')}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="phone">
            {t('contact.form.phone')}
          </label>
          <input id="phone" className="input" {...register('phone')} />
        </div>
        <div>
          <label className="label" htmlFor="inquiryType">
            {t('contact.form.inquiryType')}
          </label>
          <select id="inquiryType" className="input" {...register('inquiryType')}>
            {INQUIRY_TYPES.map((type) => (
              <option key={type} value={type}>
                {t(`contact.form.types.${type}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="subject">
          {t('contact.form.subject')}
        </label>
        <input id="subject" className="input" {...register('subject')} aria-invalid={!!errors.subject} />
        {err('subject') && <p className="mt-1 text-xs text-red-600">{err('subject')}</p>}
      </div>

      <div>
        <label className="label" htmlFor="message">
          {t('contact.form.message')}
        </label>
        <textarea
          id="message"
          rows={5}
          className="input resize-y"
          {...register('message')}
          aria-invalid={!!errors.message}
        />
        {err('message') && <p className="mt-1 text-xs text-red-600">{err('message')}</p>}
      </div>

      <div className="flex items-start gap-2">
        <input
          id="consent"
          type="checkbox"
          className="mt-1 h-4 w-4 accent-copper-500"
          {...register('consent')}
        />
        <label htmlFor="consent" className="text-sm text-wood-600 dark:text-cream-200/70">
          {t('contact.form.consent')}
        </label>
      </div>
      {err('consent') && <p className="text-xs text-red-600">{err('consent')}</p>}

      <button type="submit" className="btn-primary w-full" disabled={mutation.isPending}>
        {mutation.isPending ? t('contact.form.sending') : t('contact.form.submit')}
      </button>

      {status === 'success' && (
        <p className="flex items-center gap-2 rounded-lg bg-green-600/10 p-3 text-sm text-green-700 dark:text-green-400" role="status">
          <CheckCircle2 size={18} /> {t('contact.form.success')}
        </p>
      )}
      {status === 'error' && (
        <p className="flex items-center gap-2 rounded-lg bg-red-600/10 p-3 text-sm text-red-700 dark:text-red-400" role="alert">
          <AlertCircle size={18} /> {t('contact.form.error')}
        </p>
      )}
    </form>
  );
}
