const DICT: Record<string, string> = {
  // Scrapers
  'scrapers.loading': 'Loading workers...',
  'scrapers.load_failed': 'Failed to load workers.',
  'scrapers.start_failed': 'Failed to start scraper.',
  'scrapers.stop_failed': 'Failed to stop scraper.',
  'scrapers.action.start': 'Start {{name}}',
  'scrapers.action.stop': 'Stop {{name}}',

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
