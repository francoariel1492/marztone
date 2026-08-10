import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(1, 'validation.required').max(120),
  email: z.string().min(1, 'validation.required').email('validation.email').max(180),
  phone: z.string().max(40).optional().or(z.literal('')),
  inquiryType: z.string().min(1, 'validation.required'),
  subject: z.string().min(1, 'validation.required').max(160),
  message: z.string().min(10, 'validation.minMessage').max(4000),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'validation.consent' }),
  }),
  // Honeypot: debe quedar vacío
  website: z.string().max(0).optional().or(z.literal('')),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
