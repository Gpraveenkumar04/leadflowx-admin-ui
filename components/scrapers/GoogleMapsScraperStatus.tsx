import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { scrapersAPI } from '../../src/services/api';
import { t } from '../../src/i18n';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import ConfirmDialog from '../ui/ConfirmDialog';

type Lead = {
  id: string;
  name: string;
  location?: string;
  rating?: number | null;
  reviews?: number | null;
  score?: number | null;
  scrapedAt?: string | null;
};

const locations = [
  'New York, NY',
  'Los Angeles, CA',
  'Chicago, IL',
  'Houston, TX',
  'Phoenix, AZ',
  'Philadelphia, PA',
  'San Antonio, TX',
  'San Diego, CA',
  'Dallas, TX',
  'Austin, TX',
];

const categories = [
  'restaurants',
  'plumbers',
  'electricians',
  'auto repair',
  'dentists',
  'hair salons',
  'lawyers',
  'accountants',
  'gyms',
  'retail stores',
];

const GoogleMapsScraperStatus: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLeads: 0,
    qualifiedLeads: 0,
    lastUpdate: null as string | null,
    isRunning: false,
    runningTime: null as string | null,
  });
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [maxQualifiedLeads, setMaxQualifiedLeads] = useState<number>(10);
  const [statusText, setStatusText] = useState<'loading' | 'running' | 'stopped' | 'starting' | 'stopping'>('loading');

  useEffect(() => {
    fetchStatus();
    fetchLeads();

    const interval = setInterval(() => {
      fetchStatus();
      if (statusText === 'running') fetchLeads();
    }, 30000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await scrapersAPI.getGoogleMapsStatus();
      setStats({
        totalLeads: res.totalLeads,
        qualifiedLeads: res.qualifiedLeads,
        lastUpdate: res.lastUpdate,
        isRunning: res.isRunning,
        runningTime: res.runningTime,
      });
      setStatusText(res.isRunning ? 'running' : 'stopped');
    } catch (e) {
      console.error('Error fetching status', e);
      setStatusText('stopped');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async () => {
    try {
      const data = await scrapersAPI.getGoogleMapsLeads({ limit: 50 });
      setLeads(data || []);
    } catch (e) {
      console.error('Error fetching leads', e);
    }
  };

  const { user } = useAuth();

  const startScraper = async () => {
    try {
      setStatusText('starting');
      await scrapersAPI.startGoogleMaps({
        location: selectedLocation || undefined,
        businessType: selectedCategory || undefined,
        userId: user?.id,
        maxQualifiedLeads: maxQualifiedLeads || 10,
      });
      setStatusText('running');
  await fetchStatus();
      setTimeout(() => fetchLeads(), 5000);
  toast.success(t('scrapers.toast.started') || 'Scraper started');
    } catch (e) {
      console.error('Error starting scraper', e);
      setStatusText('stopped');
  toast.error(t('scrapers.toast.start_failed') || 'Failed to start scraper');
    }
  };

  const stopScraper = async () => {
    // open confirm dialog instead of window.confirm
    setShowConfirm(true);
  };

  const [showConfirm, setShowConfirm] = React.useState(false);

  const handleConfirmStop = async () => {
    setShowConfirm(false);
    try {
      setStatusText('stopping');
      await scrapersAPI.stopGoogleMaps();
      setStatusText('stopped');
      await fetchStatus();
      toast.success(t('scrapers.toast.stopped') || 'Scraper stopped');
    } catch (e) {
      console.error('Error stopping scraper', e);
      toast.error(t('scrapers.toast.stop_failed') || 'Failed to stop scraper');
    }
  };

  const handleCancelStop = () => setShowConfirm(false);

  const exportLeads = async () => {
    try {
      const blob = await scrapersAPI.exportGoogleMaps();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement('a');
      a.href = url;
  const filename = t('download.google_maps_filename', { date: new Date().toISOString().split('T')[0] });
  a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      console.error('Error exporting leads', e);
    }
  };

  const renderBadge = () => {
    switch (statusText) {
      case 'running':
        return <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-green-600 rounded">{t('scrapers.status.running') || 'Running'}</span>;
      case 'starting':
        return <span className="inline-block px-2 py-1 text-xs font-semibold text-yellow-600 bg-yellow-100 rounded">{t('scrapers.status.starting') || 'Starting'}</span>;
      case 'stopping':
        return <span className="inline-block px-2 py-1 text-xs font-semibold text-orange-600 bg-orange-100 rounded">{t('scrapers.status.stopping') || 'Stopping'}</span>;
      case 'stopped':
        return <span className="inline-block px-2 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded">{t('scrapers.status.stopped') || 'Stopped'}</span>;
      case 'loading':
      default:
        return <span className="inline-block px-2 py-1 text-xs font-semibold text-slate-600 bg-slate-100 rounded">{t('scrapers.loading') || 'Loading'}</span>;
    }
  };

  return (
    <div className="card p-5" role="region" aria-labelledby="gm-scraper-heading">
      <div className="flex items-center justify-between mb-4">
          <h3 id="gm-scraper-heading" className="text-lg font-semibold flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="var(--color-accent-500)" />
            <circle cx="12" cy="9" r="2.5" fill="white" />
          </svg>
          {t('scrapers.google_maps.title') || 'Google Maps Scraper'}
        </h3>
        {renderBadge()}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40" aria-busy="true">
          <div className="loader" aria-hidden />
        </div>
      ) : (
        <>
          <div className="flex gap-3 mb-6">
            <div className="flex-1 p-3 bg-[var(--color-bg-subtle)] radius-md">
              <div className="text-xs text-[var(--color-text-muted)]">{t('scrapers.total_leads') || 'Total Leads'}</div>
              <div className="text-2xl font-bold transition-colors duration-200 text-[var(--color-text)]">{stats.totalLeads}</div>
            </div>
            <div className="flex-1 p-3 bg-[var(--color-bg-subtle)] radius-md">
              <div className="text-xs text-[var(--color-text-muted)]">{t('scrapers.qualified_leads') || 'Qualified Leads'}</div>
              <div className="text-2xl font-bold transition-colors duration-200 text-[var(--color-text)]">{stats.qualifiedLeads}</div>
            </div>
            <div className="flex-1 p-3 bg-[var(--color-bg-subtle)] radius-md">
              <div className="text-xs text-[var(--color-text-muted)]">{t('scrapers.last_update') || 'Last Update'}</div>
              <div className="text-base">{stats.lastUpdate ? new Date(stats.lastUpdate).toLocaleString() : t('scrapers.never') || 'Never'}</div>
            </div>
          </div>

          <div className="mb-6">
            <div className="text-sm font-medium mb-2">{t('scrapers.controls') || 'Scraper Controls'}</div>
            <div className="flex flex-wrap gap-2 items-center">
              <select aria-label={t('scrapers.select_location') || 'Select location'} className="select" value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                <option value="">{t('scrapers.select_location_placeholder') || 'Select location'}</option>
                {locations.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>

              <select aria-label={t('scrapers.select_business_type') || 'Select business type'} className="select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="">{t('scrapers.select_business_type_placeholder') || 'Select business type'}</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <div className="flex items-start">
                <div className="text-xs text-[var(--color-text-muted)] mr-2">{t('scrapers.max_qualified') || 'Max Qualified'}</div>
                <input type="number" min={1} max={10000} value={maxQualifiedLeads} onChange={(e) => setMaxQualifiedLeads(parseInt(e.target.value || '10', 10))} className="border rounded px-2 py-1 text-sm w-28" />
              </div>

                <div className="flex gap-2">
      <button aria-label={t('scrapers.action.start_generic')} className="btn-success btn-sm" onClick={startScraper} disabled={statusText === 'running' || statusText === 'starting'}>{t('scrapers.action.start') || 'Start'}</button>
        <button aria-label={t('scrapers.action.stop_generic')} className="btn-danger btn-sm" onClick={stopScraper} disabled={statusText === 'stopped' || statusText === 'stopping'}>{t('scrapers.action.stop') || 'Stop'}</button>
      <button aria-label={t('scrapers.action.export') || 'Export leads'} className="btn-primary btn-sm" onClick={exportLeads}>{t('scrapers.action.export') || 'Export'}</button>
                </div>
            </div>
          </div>

                <ConfirmDialog
                  open={showConfirm}
                  title={t('scrapers.confirm.title') || 'Confirm'}
                  message={t('scrapers.confirm.stop') || 'Are you sure you want to stop the scraper?'}
                  onConfirm={handleConfirmStop}
                  onCancel={handleCancelStop}
                />

          {leads.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="text-sm font-medium mb-2">{t('scrapers.recent_qualified') || 'Recent Qualified Leads'}</div>
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="p-2">{t('scrapers.table.business_name') || 'Business Name'}</th>
                    <th className="p-2">{t('scrapers.table.location') || 'Location'}</th>
                    <th className="p-2">{t('scrapers.table.rating') || 'Rating'}</th>
                    <th className="p-2">{t('scrapers.table.reviews') || 'Reviews'}</th>
                    <th className="p-2">{t('scrapers.table.score') || 'Score'}</th>
                    <th className="p-2">{t('scrapers.table.scraped_at') || 'Scraped At'}</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={`${lead.id}-${lead.scrapedAt}`} className="border-t">
                      <td className="p-2 align-top">{lead.name}</td>
                      <td className="p-2 align-top">{lead.location}</td>
                      <td className="p-2 align-top">{lead.rating ?? '-'}</td>
                      <td className="p-2 align-top">{lead.reviews ?? '-'}</td>
                      <td className="p-2 align-top">{lead.score ?? '-'}</td>
                      <td className="p-2 align-top">{lead.scrapedAt ? new Date(lead.scrapedAt).toLocaleString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 text-center text-muted">{t('scrapers.no_leads') || 'No leads data available'}</div>
          )}

          {stats.isRunning && stats.runningTime && (
            <div className="flex justify-end mt-4 text-sm text-muted">{t('scrapers.running_for') || 'Running for:'} {stats.runningTime}</div>
          )}
        </>
      )}
    </div>
  );
};

export default GoogleMapsScraperStatus;
