// Core data models based on Prisma schema
export interface RawLead {
  id: number;
  email: string;
  name: string;
  company: string;
  website: string;
  phone: string;
  createdAt: string;
  correlationId: string;
}

export interface VerifiedLead {
  id: number;
  email: string;
  name: string;
  company: string;
  website: string;
  phone: string;
  correlationId: string;
  createdAt: string;
  auditScore?: number;
  leadScore?: number;
  qaStatus?: QAStatus;
  qaReviewedAt?: string;
  qaReviewedBy?: string;
}

export interface AuditResult {
  id: number;
  correlationId: string;
  website: string;
  auditScore: number;
  performance: number;
  seo: number;
  ssl: number;
  mobile: number;
  auditData: Record<string, any>;
  timestamp: string;
  error?: string;
}

export interface DlqLead {
  id: number;
  email: string;
  name?: string;
  company: string;
  website: string;
  phone: string;
  correlationId: string;
  error: string;
  createdAt: string;
}

export interface ScoringJob {
  id: number;
  jobDate: string;
  status: JobStatus;
  leadsProcessed: number;
  startTime: string;
  endTime?: string;
  error?: string;
}

export interface Config {
  id: number;
  key: string;
  value?: string;
}

// Enums
export type QAStatus = 'pending' | 'approved' | 'rejected' | 'needs_review';
export type JobStatus = 'running' | 'completed' | 'failed' | 'paused';

// Tag interface for lead tagging
export interface Tag {
  id: string;
  name: string;
  color: string;
  /** Indicates this tag exists only locally and is pending sync with backend */
  pending?: boolean;
}

// Enhanced types for the UI
export interface Lead extends VerifiedLead {
  source?: string;
  scrapedAt?: string;
  auditBreakdown?: {
    performance: number;
    seo: number;
    ssl: number;
    mobile: number;
  };
  qaNotes?: string;
  timeline?: LeadTimeline[];
  actions?: LeadAction[];
  tags?: Tag[];
  assigneeId?: string;
  workflowStatus?: 'pending' | 'in_progress' | 'completed' | 'on_hold' | 'rejected';
  comments?: Comment[];
  auditTrail?: AuditEntry[];
}

export interface LeadTimeline {
  id: string;
  action: string;
  timestamp: string;
  user?: string;
  details?: string;
}

export interface LeadAction {
  type: 'view' | 'edit' | 'retry' | 'dlq' | 'download';
  label: string;
  icon: string;
  onClick: () => void;
}

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  mentions?: string[]; // User IDs that are mentioned
}

export interface AuditEntry {
  id: string;
  action: 'created' | 'updated' | 'status_changed' | 'assigned' | 'tag_added' | 'tag_removed' | 'comment_added';
  field?: string;
  oldValue?: string;
  newValue?: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

// Scraping job configuration
export interface ScrapingJob {
  id: string;
  name: string;
  source: string;
  filters: Record<string, any>;
  cron: string;
  concurrency: number;
  status: JobStatus;
  logs?: string[];
  createdAt: string;
  updatedAt: string;
}

// Data sources
export const DATA_SOURCES = [
  'google_maps',
  'linkedin',
  'facebook',
  'craigslist',
  'chamber',
  'yellowpages',
  'etsy',
  'gov_contracts',
  'healthcare',
  'business_events',
  'reviews',
  'trade',
  'open_data',
  'branch'
] as const;

export type DataSource = typeof DATA_SOURCES[number];

// Dashboard metrics
export interface DashboardMetrics {
  totalRawLeads: number;
  leadsBySource: { source: string; count: number; }[];
  statusFunnel: {
    raw: number;
    verified: number;
    audited: number;
    qaPassed: number;
    scored: number;
  };
  slaMetrics: {
    avgScrapeTime: number;
    avgAuditTime: number;
    qaBacklog: number;
  };
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Saved view interface for persisting filter configurations
export interface SavedView {
  id: string;
  name: string;
  filters: LeadFilters;
  sort: TableSort;
}

// Filter and search types
export interface LeadFilters {
  search?: string;
  source?: string[];
  qaStatus?: QAStatus[];
  auditScoreMin?: number;
  auditScoreMax?: number;
  leadScoreMin?: number;
  leadScoreMax?: number;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
}

export interface TableSort {
  field: string;
  direction: 'asc' | 'desc';
}

// User and auth types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export type UserRole = 'admin' | 'qa_rep' | 'sdr' | 'viewer';

// Configuration types
export interface AppConfig {
  auditWeights: {
    performance: number;
    seo: number;
    ssl: number;
    mobile: number;
  };
  captchaKeys: {
    siteKey: string;
    secretKey: string;
  };
  proxyList: string[];
  rateLimits: {
    requestsPerMinute: number;
    burstLimit: number;
  };
  gdprFlags: {
    optInRequired: boolean;
    dataRetentionDays: number;
  };
}

// WebSocket event types
export interface WebSocketEvent {
  type: string;
  data: any;
  timestamp: string;
}

// Chart data types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
  label?: string;
}

// Form types
export interface LeadFormData {
  name: string;
  email: string;
  company: string;
  website: string;
  phone: string;
}

export interface JobFormData {
  name: string;
  source: DataSource;
  filters: Record<string, any>;
  cron: string;
  concurrency: number;
}

// Notification types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary';
}
