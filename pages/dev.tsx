import React, { useState } from 'react';
import { 
  CodeBracketIcon,
  DocumentTextIcon,
  CloudArrowDownIcon,
  CheckBadgeIcon,
  ClipboardDocumentIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import Layout from '../src/components/Layout';
import { clsx } from 'clsx';

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  description: string;
  parameters?: string[];
  example?: string;
}

const API_ENDPOINTS: ApiEndpoint[] = [
  {
    method: 'GET',
    endpoint: '/api/leads',
    description: 'Retrieve paginated list of leads with optional filters',
    parameters: ['page', 'pageSize', 'source', 'qaStatus', 'search'],
    example: 'GET /api/leads?page=1&pageSize=25&source=google_maps'
  },
  {
    method: 'GET',
    endpoint: '/api/leads/{id}',
    description: 'Get detailed information about a specific lead',
    parameters: ['id'],
    example: 'GET /api/leads/123'
  },
  {
    method: 'POST',
    endpoint: '/api/leads',
    description: 'Create a new lead in the system',
    example: 'POST /api/leads\n{\n  "name": "John Doe",\n  "email": "john@example.com",\n  "company": "Example Corp",\n  "website": "https://example.com",\n  "phone": "+1234567890"\n}'
  },
  {
    method: 'PATCH',
    endpoint: '/api/leads/{id}',
    description: 'Update an existing lead',
    parameters: ['id'],
    example: 'PATCH /api/leads/123\n{\n  "qaStatus": "approved",\n  "qaReviewedBy": "user@company.com"\n}'
  },
  {
    method: 'POST',
    endpoint: '/api/leads/bulk/approve',
    description: 'Bulk approve multiple leads',
    example: 'POST /api/leads/bulk/approve\n{\n  "ids": [123, 124, 125]\n}'
  },
  {
    method: 'GET',
    endpoint: '/api/jobs',
    description: 'List all scraping jobs',
    example: 'GET /api/jobs'
  },
  {
    method: 'POST',
    endpoint: '/api/jobs',
    description: 'Create a new scraping job',
    example: 'POST /api/jobs\n{\n  "name": "NYC Restaurants",\n  "source": "google_maps",\n  "filters": {"category": "restaurant", "location": "New York"},\n  "cron": "0 */2 * * *",\n  "concurrency": 5\n}'
  },
  {
    method: 'POST',
    endpoint: '/api/jobs/{id}/start',
    description: 'Start a scraping job',
    parameters: ['id'],
    example: 'POST /api/jobs/abc123/start'
  },
  {
    method: 'GET',
    endpoint: '/api/dashboard/metrics',
    description: 'Get dashboard metrics and statistics',
    example: 'GET /api/dashboard/metrics'
  }
];

const SDK_EXAMPLES = {
  python: `# LeadFlowX Python SDK
import leadflowx

# Initialize client
client = leadflowx.Client(api_key="your-api-key", base_url="http://localhost:8080")

# Get leads
leads = client.leads.list(page=1, page_size=25, source="google_maps")

# Create a new lead
lead = client.leads.create({
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Example Corp",
    "website": "https://example.com",
    "phone": "+1234567890"
})

# Update lead status
client.leads.update(lead.id, {"qaStatus": "approved"})

# Create scraping job
job = client.jobs.create({
    "name": "NYC Restaurants",
    "source": "google_maps",
    "filters": {"category": "restaurant", "location": "New York"},
    "cron": "0 */2 * * *",
    "concurrency": 5
})

# Start job
client.jobs.start(job.id)`,

  go: `// LeadFlowX Go SDK
package main

import (
    "context"
    "log"
    
    "github.com/leadflowx/go-sdk"
)

func main() {
    client := leadflowx.NewClient("your-api-key", "http://localhost:8080")
    
    // Get leads
    leads, err := client.Leads.List(context.Background(), &leadflowx.ListLeadsOptions{
        Page:     1,
        PageSize: 25,
        Source:   "google_maps",
    })
    if err != nil {
        log.Fatal(err)
    }
    
    // Create a new lead
    lead, err := client.Leads.Create(context.Background(), &leadflowx.Lead{
        Name:    "John Doe",
        Email:   "john@example.com",
        Company: "Example Corp",
        Website: "https://example.com",
        Phone:   "+1234567890",
    })
    if err != nil {
        log.Fatal(err)
    }
    
    // Create scraping job
    job, err := client.Jobs.Create(context.Background(), &leadflowx.Job{
        Name:        "NYC Restaurants",
        Source:      "google_maps",
        Filters:     map[string]interface{}{"category": "restaurant", "location": "New York"},
        Cron:        "0 */2 * * *",
        Concurrency: 5,
    })
    if err != nil {
        log.Fatal(err)
    }
    
    // Start job
    err = client.Jobs.Start(context.Background(), job.ID)
    if err != nil {
        log.Fatal(err)
    }
}`,

  javascript: `// LeadFlowX JavaScript/Node.js SDK
const LeadFlowX = require('@leadflowx/sdk');

// Initialize client
const client = new LeadFlowX({
  apiKey: 'your-api-key',
  baseURL: 'http://localhost:8080'
});

async function main() {
  try {
    // Get leads
    const leads = await client.leads.list({
      page: 1,
      pageSize: 25,
      source: 'google_maps'
    });
    
    // Create a new lead
    const lead = await client.leads.create({
      name: 'John Doe',
      email: 'john@example.com',
      company: 'Example Corp',
      website: 'https://example.com',
      phone: '+1234567890'
    });
    
    // Update lead status
    await client.leads.update(lead.id, {
      qaStatus: 'approved'
    });
    
    // Create scraping job
    const job = await client.jobs.create({
      name: 'NYC Restaurants',
      source: 'google_maps',
      filters: { category: 'restaurant', location: 'New York' },
      cron: '0 */2 * * *',
      concurrency: 5
    });
    
    // Start job
    await client.jobs.start(job.id);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

main();`
};

export default function DevPortal() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'api' | 'sdk' | 'changelog'>('overview');
  const [selectedSDK, setSelectedSDK] = useState<'python' | 'go' | 'javascript'>('python');
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const copyToClipboard = (text: string, endpoint?: string) => {
    navigator.clipboard.writeText(text);
    if (endpoint) {
      setCopiedEndpoint(endpoint);
      setTimeout(() => setCopiedEndpoint(null), 2000);
    }
  };

  const getMethodClass = (method: string) => {
    switch (method) {
      case 'GET': return 'badge-primary';
      case 'POST': return 'badge-success';
      case 'PUT': return 'badge-warning';
      case 'PATCH': return 'badge-warning';
      case 'DELETE': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-[var(--color-text)] sm:text-3xl sm:truncate">
              Developer Portal
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              APIs, SDKs, and documentation for LeadFlowX integration
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <div className="badge badge-success">
              <CheckBadgeIcon className="h-4 w-4 mr-1" />
              API Status: Healthy
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-[var(--color-border)]">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'api', label: 'API Reference' },
              { key: 'sdk', label: 'SDKs & Examples' },
              { key: 'changelog', label: 'Changelog' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key as any)}
                className={clsx(
                  'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                  selectedTab === tab.key
                    ? 'border-[var(--color-primary-500)] text-[var(--color-primary-500)]'
                    : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-border-hover)]'
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-medium text-[var(--color-text)]">Getting Started</h3>
                </div>
                <div className="card-body">
                  <div className="prose prose-sm max-w-none text-[var(--color-text-muted)]">
                    <p>
                      Welcome to the LeadFlowX Developer Portal. This comprehensive API allows you to:
                    </p>
                    <ul>
                      <li>Retrieve and manage leads from your database</li>
                      <li>Create and control scraping jobs</li>
                      <li>Access real-time metrics and monitoring data</li>
                      <li>Integrate QA workflows into your applications</li>
                    </ul>
                    <h4>Authentication</h4>
                    <p>
                      All API requests require authentication using an API key. Include your API key in the 
                      <code>Authorization</code> header:
                    </p>
                    <div className="bg-[var(--color-bg-subtle)] text-[var(--color-text)] p-3 rounded font-mono text-sm">
                      Authorization: Bearer your-api-key-here
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-medium text-[var(--color-text)]">Rate Limits</h3>
                </div>
                <div className="card-body">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-[var(--color-primary-100)] rounded-lg">
                      <div className="text-2xl font-bold text-[var(--color-primary-600)]">1000</div>
                      <div className="text-sm text-[var(--color-primary-600)]">Requests/hour</div>
                    </div>
                    <div className="text-center p-4 bg-[var(--color-success-100)] rounded-lg">
                      <div className="text-2xl font-bold text-[var(--color-success-600)]">50</div>
                      <div className="text-sm text-[var(--color-success-600)]">Concurrent</div>
                    </div>
                    <div className="text-center p-4 bg-[var(--color-bg-subtle)] rounded-lg">
                      <div className="text-2xl font-bold text-[var(--color-text)]">10MB</div>
                      <div className="text-sm text-[var(--color-text-muted)]">Max payload</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-medium text-[var(--color-text)]">Quick Links</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-3">
                    <a href="#" className="flex items-center justify-between p-2 hover:bg-[var(--color-bg-subtle)] rounded">
                      <span className="text-sm text-[var(--color-text)]">OpenAPI Specification</span>
                      <ArrowTopRightOnSquareIcon className="h-4 w-4 text-[var(--color-text-subtle)]" />
                    </a>
                    <a href="#" className="flex items-center justify-between p-2 hover:bg-[var(--color-bg-subtle)] rounded">
                      <span className="text-sm text-[var(--color-text)]">Postman Collection</span>
                      <ArrowTopRightOnSquareIcon className="h-4 w-4 text-[var(--color-text-subtle)]" />
                    </a>
                    <a href="#" className="flex items-center justify-between p-2 hover:bg-[var(--color-bg-subtle)] rounded">
                      <span className="text-sm text-[var(--color-text)]">GitHub Repository</span>
                      <ArrowTopRightOnSquareIcon className="h-4 w-4 text-[var(--color-text-subtle)]" />
                    </a>
                    <a href="#" className="flex items-center justify-between p-2 hover:bg-[var(--color-bg-subtle)] rounded">
                      <span className="text-sm text-[var(--color-text)]">Status Page</span>
                      <ArrowTopRightOnSquareIcon className="h-4 w-4 text-[var(--color-text-subtle)]" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-medium text-[var(--color-text)]">SDKs</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[var(--color-text)]">Python SDK</span>
                      <button className="btn btn-sm btn-primary">
                        <CloudArrowDownIcon className="h-4 w-4 mr-1" />
                        Download
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[var(--color-text)]">Go SDK</span>
                      <button className="btn btn-sm btn-primary">
                        <CloudArrowDownIcon className="h-4 w-4 mr-1" />
                        Download
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[var(--color-text)]">Node.js SDK</span>
                      <button className="btn btn-sm btn-primary">
                        <CloudArrowDownIcon className="h-4 w-4 mr-1" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* API Reference Tab */}
        {selectedTab === 'api' && (
          <div className="space-y-6">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-[var(--color-text)]">API Endpoints</h3>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  Complete reference for all available API endpoints
                </p>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  {API_ENDPOINTS.map((endpoint, index) => (
                    <div key={index} className="border border-[var(--color-border)] rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className={clsx('badge', getMethodClass(endpoint.method))}>
                            {endpoint.method}
                          </span>
                          <code className="text-sm font-mono text-[var(--color-text)]">
                            {endpoint.endpoint}
                          </code>
                        </div>
                        <button
                          onClick={() => copyToClipboard(endpoint.example || endpoint.endpoint, endpoint.endpoint)}
                          className="text-[var(--color-text-subtle)] hover:text-[var(--color-text)]"
                          title="Copy example"
                        >
                          {copiedEndpoint === endpoint.endpoint ? (
                            <CheckBadgeIcon className="h-4 w-4 text-[var(--color-success-500)]" />
                          ) : (
                            <ClipboardDocumentIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-[var(--color-text-muted)] mb-3">{endpoint.description}</p>
                      {endpoint.parameters && (
                        <div className="mb-3">
                          <span className="text-xs font-medium text-[var(--color-text-subtle)]">Parameters: </span>
                          <span className="text-xs text-[var(--color-text-muted)]">
                            {endpoint.parameters.join(', ')}
                          </span>
                        </div>
                      )}
                      {endpoint.example && (
                        <div className="bg-[var(--color-bg-subtle)] text-[var(--color-text)] p-3 rounded font-mono text-xs overflow-x-auto">
                          <pre>{endpoint.example}</pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SDK Tab */}
        {selectedTab === 'sdk' && (
          <div className="space-y-6">
            <div className="card">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-[var(--color-text)]">SDK Examples</h3>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                      Code examples for popular programming languages
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {Object.keys(SDK_EXAMPLES).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setSelectedSDK(lang as any)}
                        className={clsx(
                          'px-3 py-1 text-sm font-medium rounded transition-colors',
                          selectedSDK === lang
                            ? 'bg-[var(--color-primary-500)] text-white'
                            : 'bg-[var(--color-bg-subtle)] text-[var(--color-text)] hover:bg-[var(--color-bg-hover)]'
                        )}
                      >
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="relative">
                  <button
                    onClick={() => copyToClipboard(SDK_EXAMPLES[selectedSDK])}
                    className="absolute top-2 right-2 text-[var(--color-text-subtle)] hover:text-[var(--color-text)] z-10"
                    title="Copy code"
                  >
                    <ClipboardDocumentIcon className="h-5 w-5" />
                  </button>
                  <div className="bg-[var(--color-bg-subtle)] text-[var(--color-text)] p-4 rounded font-mono text-sm overflow-x-auto">
                    <pre>{SDK_EXAMPLES[selectedSDK]}</pre>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="card">
                <div className="card-header">
                  <h4 className="text-md font-medium text-[var(--color-text)]">Installation</h4>
                </div>
                <div className="card-body">
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong className="text-[var(--color-text)]">Python:</strong>
                      <div className="bg-[var(--color-bg-subtle)] p-2 rounded font-mono text-xs mt-1">
                        pip install leadflowx
                      </div>
                    </div>
                    <div>
                      <strong className="text-[var(--color-text)]">Go:</strong>
                      <div className="bg-[var(--color-bg-subtle)] p-2 rounded font-mono text-xs mt-1">
                        go get github.com/leadflowx/go-sdk
                      </div>
                    </div>
                    <div>
                      <strong className="text-[var(--color-text)]">Node.js:</strong>
                      <div className="bg-[var(--color-bg-subtle)] p-2 rounded font-mono text-xs mt-1">
                        npm install @leadflowx/sdk
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h4 className="text-md font-medium text-[var(--color-text)]">Documentation</h4>
                </div>
                <div className="card-body">
                  <div className="space-y-2">
                    <a href="#" className="block text-sm text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)]">
                      Python SDK Docs →
                    </a>
                    <a href="#" className="block text-sm text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)]">
                      Go SDK Docs →
                    </a>
                    <a href="#" className="block text-sm text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)]">
                      Node.js SDK Docs →
                    </a>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h4 className="text-md font-medium text-[var(--color-text)]">Support</h4>
                </div>
                <div className="card-body">
                  <div className="space-y-2">
                    <a href="#" className="block text-sm text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)]">
                      GitHub Issues →
                    </a>
                    <a href="#" className="block text-sm text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)]">
                      Discord Community →
                    </a>
                    <a href="#" className="block text-sm text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)]">
                      Email Support →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Changelog Tab */}
        {selectedTab === 'changelog' && (
          <div className="space-y-6">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-[var(--color-text)]">Release Notes</h3>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  Latest updates and changes to the LeadFlowX API
                </p>
              </div>
              <div className="card-body">
                <div className="space-y-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-10 h-10 bg-[var(--color-primary-100)] rounded-full">
                        <span className="text-[var(--color-primary-600)] text-sm font-medium">v2.1</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-md font-medium text-[var(--color-text)]">Version 2.1.0</h4>
                      <p className="text-sm text-[var(--color-text-muted)]">Released on January 15, 2024</p>
                      <ul className="mt-2 text-sm text-[var(--color-text-muted)] list-disc list-inside space-y-1">
                        <li>Added bulk operations for lead management</li>
                        <li>Improved rate limiting with burst support</li>
                        <li>New webhook endpoints for real-time notifications</li>
                        <li>Enhanced error messages and status codes</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-10 h-10 bg-[var(--color-bg-subtle)] rounded-full">
                        <span className="text-[var(--color-text-muted)] text-sm font-medium">v2.0</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-md font-medium text-[var(--color-text)]">Version 2.0.0</h4>
                      <p className="text-sm text-[var(--color-text-muted)]">Released on December 1, 2023</p>
                      <ul className="mt-2 text-sm text-[var(--color-text-muted)] list-disc list-inside space-y-1">
                        <li>Complete API redesign with RESTful endpoints</li>
                        <li>Added authentication with API keys</li>
                        <li>New job management endpoints</li>
                        <li>Comprehensive metrics and monitoring APIs</li>
                        <li>Breaking changes from v1.x - see migration guide</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-10 h-10 bg-[var(--color-bg-subtle)] rounded-full">
                        <span className="text-[var(--color-text-muted)] text-sm font-medium">v1.5</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-md font-medium text-[var(--color-text)]">Version 1.5.2</h4>
                      <p className="text-sm text-[var(--color-text-muted)]">Released on October 20, 2023</p>
                      <ul className="mt-2 text-sm text-[var(--color-text-muted)] list-disc list-inside space-y-1">
                        <li>Fixed pagination issues in lead endpoints</li>
                        <li>Improved QA workflow status updates</li>
                        <li>Performance optimizations for large datasets</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
