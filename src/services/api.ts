import axios, { AxiosResponse, AxiosError } from 'axios';
import { 
  Lead, 
  DashboardMetrics, 
  ScrapingJob, 
  AuditResult, 
  ApiResponse, 
  PaginatedResponse,
  LeadFilters,
  TableSort,
  Config,
  AppConfig,
  Tag,
  SavedView,
  Comment,
  AuditEntry
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Dashboard API
export const dashboardAPI = {
  async getMetrics(): Promise<DashboardMetrics> {
    const response = await apiClient.get<ApiResponse<DashboardMetrics>>('/api/dashboard/metrics');
    return response.data.data!;
  },

  async getTotalRawLeads(): Promise<number> {
    const response = await apiClient.get<ApiResponse<{ count: number }>>('/api/leads/raw/count');
    return response.data.data!.count;
  },

  async getLeadsBySource(): Promise<{ source: string; count: number; }[]> {
    const response = await apiClient.get<ApiResponse<{ source: string; count: number; }[]>>('/api/leads/by-source');
    return response.data.data!;
  },

  async getStatusFunnel(): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>('/api/leads/status-funnel');
    return response.data.data!;
  },

  async getSLAMetrics(): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>('/api/metrics/sla');
    return response.data.data!;
  }
  
};

// Leads API
export const leadsAPI = {
  async getLeads(
    page: number = 1,
    pageSize: number = 25,
    filters?: LeadFilters,
    sort?: TableSort,
    signal?: AbortSignal
  ): Promise<PaginatedResponse<Lead>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }

    if (sort) {
      params.append('sortField', sort.field);
      params.append('sortDirection', sort.direction);
    }

  const response = await apiClient.get<PaginatedResponse<Lead>>(`/api/leads?${params.toString()}`,{ signal });
    return response.data;
  },

  async getLead(id: number): Promise<Lead> {
    const response = await apiClient.get<ApiResponse<Lead>>(`/api/leads/${id}`);
    return response.data.data!;
  },

  async updateLead(id: number, data: Partial<Lead>): Promise<Lead> {
    const response = await apiClient.patch<ApiResponse<Lead>>(`/api/leads/${id}`, data);
    return response.data.data!;
  },

  async deleteLead(id: number): Promise<void> {
    await apiClient.delete(`/api/leads/${id}`);
  },

  async bulkApprove(ids: number[]): Promise<void> {
    await apiClient.post('/api/leads/bulk/approve', { ids });
  },

  async bulkReject(ids: number[], reason?: string): Promise<void> {
    await apiClient.post('/api/leads/bulk/reject', { ids, reason });
  },

  async sendToDLQ(id: number, reason: string): Promise<void> {
    await apiClient.post(`/api/leads/${id}/dlq`, { reason });
  },

  async retryLead(id: number): Promise<void> {
    await apiClient.post(`/api/leads/${id}/retry`);
  },

  async exportLeads(filters?: LeadFilters): Promise<Blob> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }

    const response = await apiClient.get(`/api/leads/export?${params.toString()}`, {
      responseType: 'blob'
    });
    return response.data;
  },
  
  // Tag related functions
  async addTag(leadId: number, tagId: string): Promise<void> {
    await apiClient.post(`/api/leads/${leadId}/tags`, { tagId });
  },
  
  async removeTag(leadId: number, tagId: string): Promise<void> {
    await apiClient.delete(`/api/leads/${leadId}/tags/${tagId}`);
  },
  
  async getTags(): Promise<Tag[]> {
    const response = await apiClient.get<ApiResponse<Tag[]>>('/api/tags');
    return response.data.data || [];
  },
  
  async createTag(name: string, color: string): Promise<Tag> {
    const response = await apiClient.post<ApiResponse<Tag>>('/api/tags', { name, color });
    return response.data.data!;
  },
  
  async updateTag(id: string, data: Partial<Tag>): Promise<Tag> {
    const response = await apiClient.patch<ApiResponse<Tag>>(`/api/tags/${id}`, data);
    return response.data.data!;
  },
  
  async deleteTag(id: string): Promise<void> {
    await apiClient.delete(`/api/tags/${id}`);
  },
  
  // Saved Views functions
  async getSavedViews(): Promise<SavedView[]> {
    const response = await apiClient.get<ApiResponse<SavedView[]>>('/api/saved-views');
    return response.data.data || [];
  },
  
  async createSavedView(name: string, filters: LeadFilters, sort: TableSort): Promise<SavedView> {
    const response = await apiClient.post<ApiResponse<SavedView>>('/api/saved-views', { name, filters, sort });
    return response.data.data!;
  },
  
  async updateSavedView(id: string, data: Partial<SavedView>): Promise<SavedView> {
    const response = await apiClient.patch<ApiResponse<SavedView>>(`/api/saved-views/${id}`, data);
    return response.data.data!;
  },
  
  async deleteSavedView(id: string): Promise<void> {
    await apiClient.delete(`/api/saved-views/${id}`);
  },
  
  // Comments functions
  async getComments(leadId: number): Promise<Comment[]> {
    const response = await apiClient.get<ApiResponse<Comment[]>>(`/api/leads/${leadId}/comments`);
    return response.data.data || [];
  },
  
  async addComment(leadId: number, text: string, mentions: string[] = []): Promise<Comment> {
    const response = await apiClient.post<ApiResponse<Comment>>(`/api/leads/${leadId}/comments`, {
      text,
      mentions
    });
    return response.data.data!;
  },
  
  async deleteComment(leadId: number, commentId: string): Promise<void> {
    await apiClient.delete(`/api/leads/${leadId}/comments/${commentId}`);
  },
  
  async getAuditTrail(leadId: number): Promise<AuditEntry[]> {
    const response = await apiClient.get<ApiResponse<AuditEntry[]>>(`/api/leads/${leadId}/audit-trail`);
    return response.data.data || [];
  }
};

// QA API
export const qaAPI = {
  async getQAQueue(
    page: number = 1, 
    pageSize: number = 25,
    sampleSize: number = 5
  ): Promise<PaginatedResponse<Lead>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      sampleSize: sampleSize.toString(),
    });

    const response = await apiClient.get<PaginatedResponse<Lead>>(`/api/qa/queue?${params.toString()}`);
    return response.data;
  },

  async approveLead(id: number, notes?: string): Promise<void> {
    await apiClient.post(`/api/qa/approve/${id}`, { notes });
  },

  async rejectLead(id: number, notes: string): Promise<void> {
    await apiClient.post(`/api/qa/reject/${id}`, { notes });
  },

  async addNotes(id: number, notes: string): Promise<void> {
    await apiClient.post(`/api/qa/notes/${id}`, { notes });
  },

  async requeueLead(id: number, data: Partial<Lead>): Promise<void> {
    await apiClient.post(`/api/qa/requeue/${id}`, data);
  }
};

// Jobs API
export const jobsAPI = {
  async getJobs(): Promise<ScrapingJob[]> {
    const response = await apiClient.get<ApiResponse<ScrapingJob[]>>('/api/jobs');
    return response.data.data!;
  },

  async getJob(id: string): Promise<ScrapingJob> {
    const response = await apiClient.get<ApiResponse<ScrapingJob>>(`/api/jobs/${id}`);
    return response.data.data!;
  },

  async createJob(data: Omit<ScrapingJob, 'id' | 'createdAt' | 'updatedAt'>): Promise<ScrapingJob> {
    const response = await apiClient.post<ApiResponse<ScrapingJob>>('/api/jobs', data);
    return response.data.data!;
  },

  async updateJob(id: string, data: Partial<ScrapingJob>): Promise<ScrapingJob> {
    const response = await apiClient.patch<ApiResponse<ScrapingJob>>(`/api/jobs/${id}`, data);
    return response.data.data!;
  },

  async deleteJob(id: string): Promise<void> {
    await apiClient.delete(`/api/jobs/${id}`);
  },

  async startJob(id: string): Promise<void> {
    await apiClient.post(`/api/jobs/${id}/start`);
  },

  async pauseJob(id: string): Promise<void> {
    await apiClient.post(`/api/jobs/${id}/pause`);
  },

  async stopJob(id: string): Promise<void> {
    await apiClient.post(`/api/jobs/${id}/stop`);
  },

  async cloneJob(id: string, newName: string): Promise<ScrapingJob> {
    const response = await apiClient.post<ApiResponse<ScrapingJob>>(`/api/jobs/${id}/clone`, { name: newName });
    return response.data.data!;
  },

  async getJobLogs(id: string, lines: number = 100): Promise<string[]> {
    const response = await apiClient.get<ApiResponse<string[]>>(`/api/jobs/${id}/logs?lines=${lines}`);
    return response.data.data!;
  }
};

// Configuration API
export const configAPI = {
  async getConfig(): Promise<AppConfig> {
    const response = await apiClient.get<ApiResponse<AppConfig>>('/api/config');
    return response.data.data!;
  },

  async updateConfig(config: Partial<AppConfig>): Promise<AppConfig> {
    const response = await apiClient.patch<ApiResponse<AppConfig>>('/api/config', config);
    return response.data.data!;
  },

  async getConfigValue(key: string): Promise<string | null> {
    const response = await apiClient.get<ApiResponse<{ value: string | null }>>(`/api/config/${key}`);
    return response.data.data!.value;
  },

  async setConfigValue(key: string, value: string): Promise<void> {
    await apiClient.put(`/api/config/${key}`, { value });
  }
};

// Metrics API
export const metricsAPI = {
  async getMetrics(timeRange: string = '1h'): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>(`/api/metrics?range=${timeRange}`);
    return response.data.data!;
  },

  async getScrapingMetrics(): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>('/api/metrics/scraping');
    return response.data.data!;
  },

  async getKafkaMetrics(): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>('/api/metrics/kafka');
    return response.data.data!;
  },

  async getErrorMetrics(): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>('/api/metrics/errors');
    return response.data.data!;
  },

  async getAlerts(): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>('/api/alerts');
    return response.data.data!;
  }
};

// Scrapers / Workers API
export const scrapersAPI = {
  async getWorkers(): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>('/api/scrapers');
    return response.data.data || [];
  },

  async getWorker(idOrName: string): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>(`/api/scrapers/${idOrName}`);
    return response.data.data!;
  },

  async startWorker(name: string): Promise<void> {
    await apiClient.post(`/api/scrapers/${name}/start`);
  },

  async stopWorker(name: string): Promise<void> {
    await apiClient.post(`/api/scrapers/${name}/stop`);
  },

  async getWorkerLogs(name: string, lines: number = 100): Promise<string[]> {
    const response = await apiClient.get<ApiResponse<string[]>>(`/api/scrapers/${name}/logs?lines=${lines}`);
    return response.data.data || [];
  }
  ,
  async createWorker(name: string): Promise<void> {
    // Create a scraper worker resource on the backend. Backends may accept { name } payload.
    await apiClient.post('/api/scrapers', { name });
  },

  // Google Maps scraper convenience helpers
  async getGoogleMapsStatus(): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>('/api/scrapers/google-maps/status');
    return response.data.data!;
  },

  async getGoogleMapsLeads(params?: { limit?: number; location?: string; businessType?: string }): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any>>('/api/scrapers/google-maps/leads', { params });
    return (response.data.data && response.data.data.leads) || [];
  },

  async startGoogleMaps(params?: { location?: string; businessType?: string; userId?: string; maxQualifiedLeads?: number }): Promise<void> {
    await apiClient.post('/api/scrapers/google-maps/start', params || {});
  },

  async stopGoogleMaps(): Promise<void> {
    await apiClient.post('/api/scrapers/google-maps/stop');
  },

  async exportGoogleMaps(): Promise<Blob> {
    const response = await apiClient.get('/api/scrapers/google-maps/export', { responseType: 'blob' });
    return response.data;
  }
};

// Audit API
export const auditAPI = {
  async getAuditResult(correlationId: string): Promise<AuditResult> {
    const response = await apiClient.get<ApiResponse<AuditResult>>(`/api/audit/${correlationId}`);
    return response.data.data!;
  },

  async reauditLead(correlationId: string): Promise<AuditResult> {
    const response = await apiClient.post<ApiResponse<AuditResult>>(`/api/audit/retry/${correlationId}`);
    return response.data.data!;
  }
};

// Authentication API
export const authAPI = {
  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    const response = await apiClient.post<ApiResponse<{ token: string; user: any }>>('/api/auth/login', {
      email,
      password
    });
    return response.data.data!;
  },

  async logout(): Promise<void> {
    await apiClient.post('/api/auth/logout');
  },

  async getCurrentUser(): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>('/api/auth/me');
    return response.data.data!;
  },

  async refreshToken(): Promise<{ token: string }> {
    const response = await apiClient.post<ApiResponse<{ token: string }>>('/api/auth/refresh');
    return response.data.data!;
  }
};

export { apiClient };
