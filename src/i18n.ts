const DICT: Record<string, string> = {
  // Scrapers
  'scrapers.loading': 'Loading workers...',
  'scrapers.load_failed': 'Failed to load workers.',
  'scrapers.start_failed': 'Failed to start scraper.',
  'scrapers.stop_failed': 'Failed to stop scraper.',
  'scrapers.action.start': 'Start {{name}}',
  'scrapers.action.stop': 'Stop {{name}}',
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
  'scrapers.running_for': 'Running for:'
  ,
  'scrapers.toast.started': 'Scraper started',
  'scrapers.toast.start_failed': 'Failed to start scraper',
  'scrapers.toast.stopped': 'Scraper stopped',
  'scrapers.toast.stop_failed': 'Failed to stop scraper',
  'scrapers.confirm.stop': 'Are you sure you want to stop the scraper?',

  // Jobs
  'jobs.loading': 'Loading jobs...',
  'jobs.no_jobs': 'No jobs found',
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
  , 'lead.labels.audit_score': 'Audit Score'
  , 'lead.labels.lead_score': 'Lead Score'
  , 'lead.labels.recent_activity': 'Recent Activity'
  , 'lead.action.view_all': 'View all'
  , 'lead.action.manage_tags': 'Manage tags'
  , 'lead.action.edit': 'Edit'

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
