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

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-100 text-blue-800';
      case 'POST': return 'bg-green-100 text-green-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'PATCH': return 'bg-orange-100 text-orange-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Developer Portal
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              APIs, SDKs, and documentation for LeadFlowX integration
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
              <CheckBadgeIcon className="h-4 w-4" />
              <span className="text-sm font-medium">API Status: Healthy</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
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
                  'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm',
                  selectedTab === tab.key
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
                  <h3 className="text-lg font-medium text-gray-900">Getting Started</h3>
                </div>
                <div className="card-body">
                  <div className="prose prose-sm max-w-none">
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
                    <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                      Authorization: Bearer your-api-key-here
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-medium text-gray-900">Rate Limits</h3>
                </div>
                <div className="card-body">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">1000</div>
                      <div className="text-sm text-blue-600">Requests/hour</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">50</div>
                      <div className="text-sm text-green-600">Concurrent</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">10MB</div>
                      <div className="text-sm text-purple-600">Max payload</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-medium text-gray-900">Quick Links</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-3">
                    <a href="#" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <span className="text-sm">OpenAPI Specification</span>
                      <ArrowTopRightOnSquareIcon className="h-4 w-4 text-gray-400" />
                    </a>
                    <a href="#" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <span className="text-sm">Postman Collection</span>
                      <ArrowTopRightOnSquareIcon className="h-4 w-4 text-gray-400" />
                    </a>
                    <a href="#" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <span className="text-sm">GitHub Repository</span>
                      <ArrowTopRightOnSquareIcon className="h-4 w-4 text-gray-400" />
                    </a>
                    <a href="#" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <span className="text-sm">Status Page</span>
                      <ArrowTopRightOnSquareIcon className="h-4 w-4 text-gray-400" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-medium text-gray-900">SDKs</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Python SDK</span>
                      <button className="btn btn-sm btn-primary">
                        <CloudArrowDownIcon className="h-4 w-4 mr-1" />
                        Download
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Go SDK</span>
                      <button className="btn btn-sm btn-primary">
                        <CloudArrowDownIcon className="h-4 w-4 mr-1" />
                        Download
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Node.js SDK</span>
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
                <h3 className="text-lg font-medium text-gray-900">API Endpoints</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Complete reference for all available API endpoints
                </p>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  {API_ENDPOINTS.map((endpoint, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className={clsx(
                            'inline-flex items-center px-2 py-1 rounded text-xs font-medium',
                            getMethodColor(endpoint.method)
                          )}>
                            {endpoint.method}
                          </span>
                          <code className="text-sm font-mono text-gray-900">
                            {endpoint.endpoint}
                          </code>
                        </div>
                        <button
                          onClick={() => copyToClipboard(endpoint.example || endpoint.endpoint, endpoint.endpoint)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Copy example"
                        >
                          {copiedEndpoint === endpoint.endpoint ? (
                            <CheckBadgeIcon className="h-4 w-4 text-green-500" />
                          ) : (
                            <ClipboardDocumentIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{endpoint.description}</p>
                      {endpoint.parameters && (
                        <div className="mb-3">
                          <span className="text-xs font-medium text-gray-500">Parameters: </span>
                          <span className="text-xs text-gray-600">
                            {endpoint.parameters.join(', ')}
                          </span>
                        </div>
                      )}
                      {endpoint.example && (
                        <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs overflow-x-auto">
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
                    <h3 className="text-lg font-medium text-gray-900">SDK Examples</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Code examples for popular programming languages
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {Object.keys(SDK_EXAMPLES).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setSelectedSDK(lang as any)}
                        className={clsx(
                          'px-3 py-1 text-sm font-medium rounded',
                          selectedSDK === lang
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 z-10"
                    title="Copy code"
                  >
                    <ClipboardDocumentIcon className="h-5 w-5" />
                  </button>
                  <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
                    <pre>{SDK_EXAMPLES[selectedSDK]}</pre>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="card">
                <div className="card-header">
                  <h4 className="text-md font-medium text-gray-900">Installation</h4>
                </div>
                <div className="card-body">
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Python:</strong>
                      <div className="bg-gray-100 p-2 rounded font-mono text-xs mt-1">
                        pip install leadflowx
                      </div>
                    </div>
                    <div>
                      <strong>Go:</strong>
                      <div className="bg-gray-100 p-2 rounded font-mono text-xs mt-1">
                        go get github.com/leadflowx/go-sdk
                      </div>
                    </div>
                    <div>
                      <strong>Node.js:</strong>
                      <div className="bg-gray-100 p-2 rounded font-mono text-xs mt-1">
                        npm install @leadflowx/sdk
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h4 className="text-md font-medium text-gray-900">Documentation</h4>
                </div>
                <div className="card-body">
                  <div className="space-y-2">
                    <a href="#" className="block text-sm text-primary-600 hover:text-primary-800">
                      Python SDK Docs →
                    </a>
                    <a href="#" className="block text-sm text-primary-600 hover:text-primary-800">
                      Go SDK Docs →
                    </a>
                    <a href="#" className="block text-sm text-primary-600 hover:text-primary-800">
                      Node.js SDK Docs →
                    </a>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h4 className="text-md font-medium text-gray-900">Support</h4>
                </div>
                <div className="card-body">
                  <div className="space-y-2">
                    <a href="#" className="block text-sm text-primary-600 hover:text-primary-800">
                      GitHub Issues →
                    </a>
                    <a href="#" className="block text-sm text-primary-600 hover:text-primary-800">
                      Discord Community →
                    </a>
                    <a href="#" className="block text-sm text-primary-600 hover:text-primary-800">
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
                <h3 className="text-lg font-medium text-gray-900">Release Notes</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Latest updates and changes to the LeadFlowX API
                </p>
              </div>
              <div className="card-body">
                <div className="space-y-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-full">
                        <span className="text-primary-600 text-sm font-medium">v2.1</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-md font-medium text-gray-900">Version 2.1.0</h4>
                      <p className="text-sm text-gray-500">Released on January 15, 2024</p>
                      <ul className="mt-2 text-sm text-gray-600 list-disc list-inside space-y-1">
                        <li>Added bulk operations for lead management</li>
                        <li>Improved rate limiting with burst support</li>
                        <li>New webhook endpoints for real-time notifications</li>
                        <li>Enhanced error messages and status codes</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                        <span className="text-gray-600 text-sm font-medium">v2.0</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-md font-medium text-gray-900">Version 2.0.0</h4>
                      <p className="text-sm text-gray-500">Released on December 1, 2023</p>
                      <ul className="mt-2 text-sm text-gray-600 list-disc list-inside space-y-1">
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
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                        <span className="text-gray-600 text-sm font-medium">v1.5</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-md font-medium text-gray-900">Version 1.5.2</h4>
                      <p className="text-sm text-gray-500">Released on October 20, 2023</p>
                      <ul className="mt-2 text-sm text-gray-600 list-disc list-inside space-y-1">
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
