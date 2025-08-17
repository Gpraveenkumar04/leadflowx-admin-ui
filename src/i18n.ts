const DICT: Record<string, string> = {
  // Scrapers
  'scrapers.loading': 'Loading workers...',
  'scrapers.load_failed': 'Failed to load workers.',
  'scrapers.start_failed': 'Failed to start scraper.',
  'scrapers.stop_failed': 'Failed to stop scraper.',
  'scrapers.action.start': 'Start',
  'scrapers.action.stop': 'Stop',
  'scrapers.action.start_generic': 'Start scraper',
  'scrapers.action.stop_generic': 'Stop scraper',
  'scrapers.google_maps.title': 'Google Maps Lead Scraper',
  'scrapers.status.running': 'Running',
  'scrapers.status.starting': 'Starting',
  'scrapers.status.stopping': 'Stopping',
  'scrapers.status.stopped': 'Stopped',
  'scrapers.total_leads': 'Total Leads',
  'scrapers.qualified_leads': 'Qualified Leads',
  'scrapers.last_update': 'Last Update',
  'scrapers.never': 'Never',
  'scrapers.controls': 'Scraper Controls',
  'scrapers.max_qualified': 'Max Qualified',
  'scrapers.action.export': 'Export',
  'scrapers.recent_qualified': 'Recent Qualified Leads',
  'scrapers.no_leads': 'No leads data available',
  'scrapers.running_for': 'Running for:',
  // Scrapers table headers
  'scrapers.table.name': 'Name',
  'scrapers.table.status': 'Status',
  'scrapers.table.last_run': 'Last Run',
  'scrapers.table.leads': 'Leads',
  'scrapers.table.avg_runtime': 'Avg Runtime',
  'scrapers.table.actions': 'Actions',
  'scrapers.table.business_name': 'Business Name',
  'scrapers.table.location': 'Location',
  'scrapers.table.rating': 'Rating',
  'scrapers.table.reviews': 'Reviews',
  'scrapers.table.score': 'Score',
  'scrapers.table.scraped_at': 'Scraped At',
  'scrapers.worker_name_sr': '{{name}} scraper',
  'scrapers.toast.started': 'Scraper started',
  'scrapers.toast.start_failed': 'Failed to start scraper',
    // Confirmation Dialog
    'confirm.confirm': 'Confirm',
    'confirm.cancel': 'Cancel',
  'scrapers.toast.stopped': 'Scraper stopped',
  'scrapers.toast.stop_failed': 'Failed to stop scraper',
  'scrapers.confirm.stop': 'Are you sure you want to stop the scraper?',
  'scrapers.confirm.title': 'Confirm',

  // Scrapers index and labels
  'scrapers.index.title': 'Lead Generation Scrapers',
  'scrapers.index.subtitle': 'Configure and manage lead generation scrapers',
  'scrapers.label.new': 'NEW',
  'scrapers.index.add_new_title': 'Add New Scraper',
  'scrapers.index.add_new_desc': 'Configure a new lead generation source',
  // Add worker modal
  'scrapers.add_modal.title': 'Add Scraper Worker',
  'scrapers.add_modal.desc': 'Provide a name for the new scraper worker. The system will register and show it in the workers list.',
  'scrapers.add_modal.name_label': 'Worker Name',
  'scrapers.add_modal.name_placeholder': 'e.g. google-maps',
  'scrapers.add_modal.confirm': 'Add Worker',
  'scrapers.add_modal.invalid_name': 'Invalid name. Use letters, numbers, dashes or underscores only.',

  // Google Maps page additional tokens
  'scrapers.google_maps.subtitle': 'Configure and monitor Google Maps lead generation',
  'scrapers.configuration.title': 'Configuration',
  'scrapers.configuration.desc': 'Advanced configuration is available via the scraper worker tooling. Use the controls above to run and manage scraper runs.',

  // QA page
  'qa.title': 'QA Queue',
  'qa.subtitle': 'Review and approve leads from the pipeline',
  'qa.controls.sample_size': 'Sample Size',
  'qa.controls.search_label': 'Search',
  'qa.controls.search_placeholder': 'Search leads...',
  'qa.controls.refresh': 'Refresh Queue',
  'qa.notes.placeholder': 'Add your QA review notes here...',
  'qa.reject_modal.title': 'Reject lead',
  'qa.reject_modal.desc': 'Provide a reason for rejecting the selected lead(s). This will be recorded with the action.',
  'qa.reject_modal.reason_label': 'Reason',
  'qa.reject_modal.reason_placeholder': 'Enter rejection reason...',
  'qa.reject_modal.confirm': 'Reject',
  'qa.actions.approve_selected': 'Approve Selected ({{n}})',
  'qa.actions.reject_selected': 'Reject Selected',
  'qa.empty.title': 'No leads in queue',
  'qa.empty.description': 'All leads have been reviewed or no leads match your current sample size.',
  'qa.confirm.bulk_approve': 'Are you sure you want to approve {{n}} leads?',

  // Generic pagination
  'pagination.prev': 'Previous',
  'pagination.next': 'Next',

  // Config page
  'config.title': 'Configuration',
  'config.subtitle': 'Manage system settings and configurations',
  'config.load_failed': 'Failed to load configuration',
  'config.placeholder.captcha_sample': '6Lc...',
  'config.placeholder.proxy_list_example': 'http://proxy1.example.com:8080\nhttp://user:pass@proxy2.example.com:8080\nsocks5://proxy3.example.com:1080',

  // Jobs
  'jobs.loading': 'Loading jobs...',
  'jobs.no_jobs': 'No jobs found',
  'jobs.not_found': 'Job not found',
  'jobs.create': 'Create New Job',
  'jobs.manage_header': 'Manage and monitor your scraping workflows',
  'jobs.status.running': 'Running',
  'jobs.status.paused': 'Paused',
  'jobs.status.failed': 'Failed',
  'jobs.status.completed': 'Completed',
  'jobs.status.unknown': 'Unknown',
  'jobs.view_logs': 'View Logs',
  'jobs.action.start': 'Start',
  'jobs.action.pause': 'Pause',
  'jobs.action.stop': 'Stop',
  'jobs.load_failed': 'Failed to load job',
  'jobs.start_failed': 'Failed to start job',
  'jobs.pause_failed': 'Failed to pause job',
  'jobs.stop_failed': 'Failed to stop job',

  'jobs.title': 'Scraping Jobs',
  'jobs.field.source': 'Source',
  'jobs.field.schedule': 'Schedule',
  'jobs.field.concurrency': 'Concurrency',
  'jobs.last_updated': 'Last updated',
  'jobs.tooltip.pause': 'Pause job',
  'jobs.tooltip.stop': 'Stop job',
  'jobs.tooltip.start': 'Start job',
  'jobs.tooltip.view_logs': 'View logs',
  'jobs.tooltip.edit': 'Edit job',
  'jobs.tooltip.clone': 'Clone job',
  'jobs.tooltip.delete': 'Delete job',
  'jobs.empty.description': 'Get started by creating a new scraping job.',
  'jobs.confirm.delete': 'Are you sure you want to delete this job? This action cannot be undone.',
  'jobs.prompt.clone_name': 'Enter name for cloned job:',

  'jobs.clone_modal.title': 'Clone Job',
  'jobs.clone_modal.desc': 'Provide a name for the cloned job. You can edit details after cloning.',
  'jobs.clone_modal.name_label': 'Cloned Job Name',
  'jobs.clone_modal.confirm': 'Clone',

  // Job toasts & confirmations
  'jobs.toast.started': 'Job started',
  'jobs.toast.start_failed': 'Failed to start job',
  'jobs.toast.paused': 'Job paused',
  'jobs.toast.pause_failed': 'Failed to pause job',
  'jobs.toast.stopped': 'Job stopped',
  'jobs.toast.stop_failed': 'Failed to stop job',
  'jobs.confirm.stop': 'Are you sure you want to stop this job?',

  // Workflow
  'workflow.pending': 'Pending',
  'workflow.in_progress': 'In Progress',
  'workflow.completed': 'Completed',
  'workflow.on_hold': 'On Hold',
  'workflow.rejected': 'Rejected'
  // Layout / Navigation
  , 'nav.dashboard': 'Dashboard'
  , 'nav.leads': 'Leads'
  , 'nav.leads.all': 'All Leads'
  , 'nav.leads.approved': 'Approved Leads'
  , 'nav.leads.rejected': 'Rejected Leads'
  , 'nav.leads.needs_review': 'Needs Review'
  , 'nav.jobs': 'Jobs'
  , 'nav.scraper_workers': 'Scraper Workers'
  , 'nav.qa_queue': 'QA Queue'
  , 'nav.metrics': 'Metrics'
  , 'nav.settings': 'Settings'
  , 'nav.settings.general': 'General Config'
  , 'nav.settings.api': 'API Settings'
  , 'nav.settings.users': 'User Management'
  , 'nav.dev_portal': 'Dev Portal'

  // Dashboard
  , 'dashboard.title': 'Dashboard'
  , 'dashboard.subtitle': 'Real-time overview of your lead generation pipeline'
  , 'dashboard.metrics.total_raw': 'Total Raw Leads'
  , 'dashboard.metrics.qa_queue': 'QA Queue'
  , 'dashboard.metrics.avg_scrape_time': 'Avg Scrape Time'
  , 'dashboard.metrics.avg_audit_time': 'Avg Audit Time'
  , 'dashboard.charts.leads_by_source.title': 'Leads by Source'
  , 'dashboard.charts.leads_by_source.desc': 'Distribution of leads across different sources'
  , 'dashboard.charts.status_funnel.title': 'Status Funnel'
  , 'dashboard.charts.status_funnel.desc': 'Lead progression through the pipeline'
  , 'dashboard.activity.title': 'Real-time Activity'
  , 'dashboard.activity.desc': 'Live feed of system activities'

  // Metrics / Monitoring
  , 'metrics.title': 'Metrics & Monitoring'
  , 'metrics.subtitle': 'System performance, alerts, and logs'
  , 'metrics.auto_refresh': 'Auto-refresh'
  , 'metrics.on': 'On'
  , 'metrics.off': 'Off'
  , 'metrics.refresh_now': 'Refresh Now'
  , 'metrics.panels.scrapes_by_source': 'Scrapes per Second by Source'
  , 'metrics.panels.kafka_lag': 'Kafka Consumer Lag'
  , 'metrics.panels.http_errors': 'HTTP Error Counts'
  , 'metrics.panels.system_health': 'System Health'
  , 'metrics.panels.recent_logs': 'Recent Logs'
  , 'metrics.time_ranges.1h': 'Last Hour'
  , 'metrics.time_ranges.6h': 'Last 6 Hours'
  , 'metrics.time_ranges.24h': 'Last 24 Hours'
  , 'metrics.time_ranges.7d': 'Last 7 Days'
  , 'metrics.alerts.active_title': 'Active Alerts'
  , 'metrics.alerts.acknowledge': 'Acknowledge'
  , 'metrics.no_logs': 'No logs available'
  , 'metrics.logs.showing': 'Showing last {{n}} log entries'
  , 'metrics.logs.view_all': 'View all logs →'
  , 'metrics.quick.total_requests': 'Total Requests'
  , 'metrics.quick.uptime': 'Uptime'
  , 'metrics.quick.avg_response': 'Avg Response Time'
  , 'metrics.quick.active_workers': 'Active Workers'
  , 'metrics.quick.queue_depth': 'Queue Depth'

  // Developer Portal
  , 'dev.title': 'Developer Portal'
  , 'dev.subtitle': 'APIs, SDKs, and documentation for LeadFlowX integration'
  , 'dev.tab.overview': 'Overview'
  , 'dev.tab.api': 'API Reference'
  , 'dev.tab.sdk': 'SDKs & Examples'
  , 'dev.tab.changelog': 'Changelog'
  , 'dev.copy.example': 'Copy example'
  , 'dev.copy.code': 'Copy code'
  , 'dev.download': 'Download'

  // File names / download labels
  , 'download.leads_filename': 'leads.csv'
  , 'download.google_maps_filename': 'google-maps-leads-{{date}}.csv'

  // User assignment / search
  , 'user.assign': 'Assign'
  , 'user.assign.remove': 'Remove assignment'
  , 'user.search.placeholder': 'Search users...'
  , 'user.search.no_results': 'No users found'

  // Comments
  , 'comments.empty': 'No comments yet.'
  , 'comments.placeholder': 'Add a comment... Use @ to mention team members'
  , 'comments.instructions': 'Use the at symbol to mention team members'
  , 'comments.mention': 'Mention'
  , 'comments.send': 'Send'
  , 'comments.loading': 'Loading comments'
  , 'comments.delete': 'Delete comment'
  , 'comments.delete_by': 'Delete comment by {{user}}'
  , 'comments.add_label': 'Add a comment'

  // User menu
  , 'user.profile': 'Your Profile'
  , 'user.notifications': 'Notifications'
  , 'user.settings': 'Settings'
  , 'user.sign_out': 'Sign out'

  // Lead detail
  , 'lead.placeholder.company': 'Company Name'
  , 'lead.placeholder.website': 'https://example.com'
  , 'lead.unknown_source': 'Unknown'
  , 'lead.action.back': 'Back'
  , 'lead.sections.details': 'Details'
  , 'lead.sections.raw_debug': 'Lead Object (Debug)'
  , 'lead.field.contact_name': 'Contact Name'
  , 'lead.field.email': 'Email'
  , 'lead.field.phone': 'Phone'
  , 'lead.field.website': 'Website'
  , 'lead.field.assigned_to': 'Assigned To'
  , 'lead.field.workflow_status': 'Workflow Status'
  , 'lead.labels.tags': 'Tags'
  , 'lead.labels.qa_status': 'QA Status'
  , 'lead.qa.approved': 'Approved'
  , 'lead.qa.rejected': 'Rejected'
  , 'lead.qa.needs_review': 'Needs Review'
  , 'lead.qa.pending': 'Pending'
  , 'lead.labels.audit_score': 'Audit Score'
  , 'lead.labels.lead_score': 'Lead Score'
  , 'lead.labels.recent_activity': 'Recent Activity'
  , 'lead.action.view_all': 'View all'
  , 'lead.action.manage_tags': 'Manage tags'
  , 'lead.action.edit': 'Edit'
  , 'lead.action.actions': 'Actions'
  , 'lead.action.call': 'Click to call'
  , 'lead.action.open_website': 'Open website'
  , 'lead.action.copy_id': 'Copy correlation ID'

  // Lead table
  , 'lead.tags.all_added': 'All tags added'
  , 'leads.loading_more': 'Loading more leads…'
  , 'lead.table.company': 'Company'
  , 'lead.table.name': 'Name'
  , 'lead.table.email': 'Email'
  , 'lead.table.phone': 'Phone'
  , 'lead.table.website': 'Website'
  , 'lead.table.source': 'Source'
  , 'lead.table.scraped_at': 'Scraped At'
  , 'lead.table.audit_score': 'Audit Score'
  , 'lead.table.qa_status': 'QA Status'
  , 'lead.table.lead_score': 'Lead Score'

  // Leads page specific
  , 'leads.manage_subtitle': 'Manage and review your lead database'
  , 'lead.actions.approve_selected': 'Approve Selected ({{n}})'
  , 'lead.actions.reject_selected': 'Reject Selected'
  , 'lead.action.export_csv': 'Export CSV'
  , 'leads.filters.title': 'Filters'
  , 'leads.views.select_saved': 'Select saved view'
  , 'leads.views.delete_title': 'Delete this view'
  , 'leads.views.save_current': 'Save Current View'
  , 'leads.filters.search_label': 'Search'
  , 'leads.filters.search_placeholder': 'Search leads...'
  , 'leads.filters.source_label': 'Source'
  , 'leads.filters.all_sources': 'All Sources'
  , 'leads.filters.qa_label': 'QA Status'
  , 'leads.filters.all_statuses': 'All Statuses'
  , 'leads.filters.date_label': 'Date Range'
  , 'leads.filters.tags_label': 'Tags'
  , 'leads.filters.all_tags': 'All Tags'
  , 'leads.pagination.showing': 'Showing'
  , 'leads.pagination.to': 'to'
  , 'leads.pagination.of': 'of'
  , 'leads.pagination.results': 'results'
  , 'leads.scroll_to_load': 'Scroll to load more (page {{page}} / {{totalPages}})'
  
    // Additional leads tokens
    , 'leads.sync_pending_tags': 'Sync Pending Tags ({{n}})'
  
    // Save view modal
    , 'leads.views.modal.title': 'Save Current View'
    , 'leads.views.modal.desc': 'Save your current filters and sorting options for quick access later.'
    , 'leads.views.modal.name_label': 'View Name'
    , 'leads.views.modal.name_placeholder': 'Enter a name for this view'
    , 'leads.views.modal.save': 'Save View'

  // Saved views toasts
  , 'leads.views.toast.saved': 'View saved'
  , 'leads.views.toast.save_failed': 'Failed to save view'
  , 'leads.views.toast.deleted': 'View deleted'
  , 'leads.views.toast.delete_failed': 'Failed to delete view'

    // Tag modal
    , 'leads.tags.modal.title': 'Add Tags'
    , 'leads.tags.modal.desc': 'Select tags to add to this lead'
    , 'leads.tags.create.title': 'Create New Tag'
    , 'leads.tags.create.placeholder': 'Tag name'
    , 'leads.tags.create.hint': 'Creating will auto-assign to this lead.'

    // Generic actions
    , 'actions.create': 'Create'
    , 'actions.close': 'Close'
    , 'actions.cancel': 'Cancel'
    , 'actions.save': 'Save'
  , 'actions.saving': 'Saving...'
  , 'actions.creating': 'Creating...'

  // Scraper toasts
  , 'scrapers.toast.created': 'Worker created'
  , 'scrapers.toast.create_failed': 'Failed to create worker'

  // Config page additional tokens
  , 'config.audit_weights.title': 'Audit Weights'
  , 'config.audit_weights.desc': 'Configure the relative importance of different audit factors'
  , 'config.captcha.title': 'CAPTCHA Keys'
  , 'config.captcha.desc': 'Configure CAPTCHA service credentials for bot protection'
  , 'config.proxy.title': 'Proxy List'
  , 'config.proxy.desc': 'Configure proxy servers for scraping operations (one per line)'

    // Shell / Sidebar
    , 'shell.search.short': 'Search'
    , 'shell.search.long': 'Search...'
    , 'shell.view.compact': 'Compact'
    , 'shell.view.comfort': 'Comfort'
    , 'shell.theme': 'Theme'

  // Audit messages
  , 'audit.updated_field': 'Updated {{field}}'
  , 'audit.updated_multiple': 'Updated {{count}} fields'
  , 'audit.generic_action': '{{action}} action'
  , 'audit.title': 'Audit Trail'
  , 'audit.just_now': 'just now'
  , 'audit.minutes_ago': '{{n}}m ago'
  , 'audit.hours_ago': '{{n}}h ago'
  , 'audit.days_ago': '{{n}}d ago'
  , 'audit.created': 'created this {{entity}}'
  , 'audit.deleted': 'deleted this {{entity}}'
  , 'audit.approved': 'approved this {{entity}}'
  , 'audit.rejected': 'rejected this {{entity}}{{reason}}'
  , 'audit.added_tag': 'added tag "{{tag}}"'
  , 'audit.removed_tag': 'removed tag "{{tag}}"'
  , 'audit.modified_tags': 'modified tags'
  , 'audit.viewed': 'viewed this {{entity}}'
  , 'audit.exported': 'exported this {{entity}}'
  , 'audit.performed_action': 'performed action on this {{entity}}'
  , 'audit.changed': 'changed'
  , 'audit.none': 'No audit events found.'
};

export function t(key: string, vars?: Record<string, any>): string {
  // Minimal i18n stub: in future wire to real i18n library
  let out = DICT[key] ?? key;
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      out = out.replace(new RegExp(`\{\{${k}\}\}`, 'g'), String(v));
    });
  }
  return out;
}
