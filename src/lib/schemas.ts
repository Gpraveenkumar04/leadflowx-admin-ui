import { z } from 'zod'

// Base schemas for common fields
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address')

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
  .optional()

export const urlSchema = z
  .string()
  .url('Invalid URL')
  .optional()
  .or(z.literal(''))

export const companySchema = z
  .string()
  .min(1, 'Company name is required')
  .max(100, 'Company name is too long')

// Complex schemas for forms
export const leadSchema = z.object({
  company: companySchema,
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: emailSchema,
  phone: phoneSchema,
  website: urlSchema,
  source: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

export const jobSchema = z.object({
  name: z.string().min(1, 'Job name is required').max(100, 'Job name is too long'),
  type: z.enum(['scraping', 'processing', 'scoring'], {
    errorMap: () => ({ message: 'Please select a valid job type' }),
  }),
  schedule: z.string().min(1, 'Schedule is required'),
  active: z.boolean().default(true),
  config: z.record(z.unknown()).optional(),
  priority: z.number().int().min(1).max(5).default(3),
})

// Form response types
export type LeadFormData = z.infer<typeof leadSchema>
export type JobFormData = z.infer<typeof jobSchema>

// Validation helpers
export function validateForm<T extends z.ZodType>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error }
}
