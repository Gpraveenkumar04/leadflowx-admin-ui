import { z } from 'zod'

// Comment validation schema
export const commentSchema = z.object({
  id: z.string().optional(),
  content: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment is too long'),
  authorId: z.string(),
  timestamp: z.date().or(z.string()).optional(),
  entityType: z.enum(['lead', 'job', 'task']),
  entityId: z.string(),
  visibility: z.enum(['public', 'private', 'team']).default('public'),
})

// Notification schema
export const notificationSchema = z.object({
  id: z.string(),
  type: z.enum([
    'lead_assigned',
    'lead_approved',
    'lead_rejected',
    'job_completed',
    'job_failed',
    'comment_added',
    'mention',
  ]),
  title: z.string(),
  message: z.string(),
  read: z.boolean().default(false),
  timestamp: z.date().or(z.string()),
  entityType: z.enum(['lead', 'job', 'task', 'comment']).optional(),
  entityId: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
})

// Search filters schema
export const searchFiltersSchema = z.object({
  query: z.string().optional(),
  tags: z.array(z.string()).optional(),
  dateRange: z.object({
    start: z.date().or(z.string()).optional(),
    end: z.date().or(z.string()).optional(),
  }).optional(),
  status: z.array(z.string()).optional(),
  assignedTo: z.array(z.string()).optional(),
  sortBy: z.enum(['date', 'name', 'status', 'priority']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
})

// Tag schema
export const tagSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Tag name cannot be empty').max(50, 'Tag name is too long'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
  description: z.string().max(200, 'Description is too long').optional(),
})

// Saved view schema
export const savedViewSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'View name cannot be empty').max(50, 'View name is too long'),
  filters: searchFiltersSchema,
  isDefault: z.boolean().default(false),
  isShared: z.boolean().default(false),
  createdBy: z.string(),
  updatedAt: z.date().or(z.string()).optional(),
})

// Common response types
export type Comment = z.infer<typeof commentSchema>
export type Notification = z.infer<typeof notificationSchema>
export type SearchFilters = z.infer<typeof searchFiltersSchema>
export type Tag = z.infer<typeof tagSchema>
export type SavedView = z.infer<typeof savedViewSchema>

// Validation helpers
export const validateComment = (data: unknown) => commentSchema.safeParse(data)
export const validateNotification = (data: unknown) => notificationSchema.safeParse(data)
export const validateSearchFilters = (data: unknown) => searchFiltersSchema.safeParse(data)
export const validateTag = (data: unknown) => tagSchema.safeParse(data)
export const validateSavedView = (data: unknown) => savedViewSchema.safeParse(data)
