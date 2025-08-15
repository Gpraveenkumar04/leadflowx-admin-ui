import React, { useState, useEffect } from 'react';
import { 
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
  XMarkIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import Layout from '../src/components/Layout';
import ConfigSection from '../components/ui/ConfigSection';
import { configAPI } from '../src/services/api';
import { AppConfig } from '../src/types';

// ...existing code

export default function ConfigPage() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);
  const [changes, setChanges] = useState<Partial<AppConfig>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const configData = await configAPI.getConfig();
      setConfig(configData);
    } catch (error) {
      console.error('Failed to fetch configuration:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (path: string, value: any) => {
    const keys = path.split('.');
    const updatedChanges = { ...changes };

    let current: Record<string, any> = updatedChanges;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]] as Record<string, any>;
    }
    current[keys[keys.length - 1]] = value;

    setChanges(updatedChanges);
    setHasUnsavedChanges(true);
  };

  const getCurrentValue = (path: string) => {
    const keys = path.split('.');
    let current: any = { ...config, ...changes };

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return undefined;
      }
    }

    // Only return primitives, not objects
    if (
      typeof current === 'string' ||
      typeof current === 'number' ||
      typeof current === 'boolean' ||
      current === undefined
    ) {
      return current;
    }
    return undefined;
  };

  const handleSave = async () => {
    if (!hasUnsavedChanges) return;
    
    try {
      setSaving(true);
      const updatedConfig = await configAPI.updateConfig(changes);
      setConfig(updatedConfig);
      setChanges({});
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to save configuration:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setChanges({});
    setHasUnsavedChanges(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-[var(--color-bg-subtle)] rounded w-1/3"></div>
          <div className="h-64 bg-[var(--color-bg-subtle)] rounded"></div>
          <div className="h-48 bg-[var(--color-bg-subtle)] rounded"></div>
        </div>
      </Layout>
    );
  }

  if (!config) {
    return (
      <Layout>
        <div className="text-center py-12 card">
          <div className="card-body">
            <p className="text-[var(--color-text-muted)]">Failed to load configuration</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-[var(--color-text)] sm:text-3xl sm:truncate">
              Configuration
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Manage system settings and configurations
            </p>
          </div>
          <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
            {hasUnsavedChanges && (
              <>
                <button onClick={handleReset} className="btn btn-secondary">
                  <XMarkIcon className="h-4 w-4 mr-2" />
                  Reset
                </button>
                <button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="btn btn-primary"
                >
                  {saving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <CheckIcon className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>

        {/* Unsaved Changes Banner */}
        {hasUnsavedChanges && (
          <div className="bg-[var(--color-warning-100)] border border-[var(--color-warning-300)] rounded-md p-4">
            <div className="flex">
              <InformationCircleIcon className="h-5 w-5 text-[var(--color-warning-500)]" />
              <div className="ml-3">
                <p className="text-sm text-[var(--color-warning-800)]">
                  You have unsaved changes. Don&apos;t forget to save your configuration.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Audit Weights Configuration */}
        <ConfigSection
          title="Audit Weights"
          description="Configure the relative importance of different audit factors"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-muted)]">
                Performance Weight
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={getCurrentValue('auditWeights.performance') || 0}
                  onChange={(e) => handleConfigChange('auditWeights.performance', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-[var(--color-text)] min-w-12">
                  {getCurrentValue('auditWeights.performance') || 0}%
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-muted)]">
                SEO Weight
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={getCurrentValue('auditWeights.seo') || 0}
                  onChange={(e) => handleConfigChange('auditWeights.seo', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-[var(--color-text)] min-w-12">
                  {getCurrentValue('auditWeights.seo') || 0}%
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-muted)]">
                SSL Weight
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={getCurrentValue('auditWeights.ssl') || 0}
                  onChange={(e) => handleConfigChange('auditWeights.ssl', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-[var(--color-text)] min-w-12">
                  {getCurrentValue('auditWeights.ssl') || 0}%
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-muted)]">
                Mobile Weight
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={getCurrentValue('auditWeights.mobile') || 0}
                  onChange={(e) => handleConfigChange('auditWeights.mobile', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-[var(--color-text)] min-w-12">
                  {getCurrentValue('auditWeights.mobile') || 0}%
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-[var(--color-primary-100)] rounded-md">
            <p className="text-sm text-[var(--color-primary-800)]">
              Total weight: {
                (getCurrentValue('auditWeights.performance') || 0) +
                (getCurrentValue('auditWeights.seo') || 0) +
                (getCurrentValue('auditWeights.ssl') || 0) +
                (getCurrentValue('auditWeights.mobile') || 0)
              }% (should equal 100%)
            </p>
          </div>
        </ConfigSection>

        {/* CAPTCHA Configuration */}
        <ConfigSection
          title="CAPTCHA Keys"
          description="Configure CAPTCHA service credentials for bot protection"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-muted)]">
                Site Key
              </label>
              <div className="mt-1 relative">
                <input
                  type={showSecrets ? 'text' : 'password'}
                  value={getCurrentValue('captchaKeys.siteKey') || ''}
                  onChange={(e) => handleConfigChange('captchaKeys.siteKey', e.target.value)}
                  className="input pr-10"
                  placeholder="6Lc..."
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-text-subtle)] hover:text-[var(--color-text)]"
                  onClick={() => setShowSecrets(!showSecrets)}
                >
                  {showSecrets ? (
                    <EyeSlashIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-muted)]">
                Secret Key
              </label>
              <div className="mt-1 relative">
                <input
                  type={showSecrets ? 'text' : 'password'}
                  value={getCurrentValue('captchaKeys.secretKey') || ''}
                  onChange={(e) => handleConfigChange('captchaKeys.secretKey', e.target.value)}
                  className="input pr-10"
                  placeholder="6Lc..."
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-text-subtle)] hover:text-[var(--color-text)]"
                  onClick={() => setShowSecrets(!showSecrets)}
                >
                  {showSecrets ? (
                    <EyeSlashIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </ConfigSection>

        {/* Proxy Configuration */}
        <ConfigSection
          title="Proxy List"
          description="Configure proxy servers for scraping operations (one per line)"
        >
          <div>
            <textarea
              rows={8}
              value={(getCurrentValue('proxyList') || []).join('\n')}
              onChange={(e) => handleConfigChange('proxyList', e.target.value.split('\n').filter(line => line.trim()))}
              className="input font-mono text-sm"
              placeholder="http://proxy1.example.com:8080&#10;http://user:pass@proxy2.example.com:8080&#10;socks5://proxy3.example.com:1080"
            />
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Supported formats: HTTP, HTTPS, SOCKS4, SOCKS5. Include credentials if required.
            </p>
          </div>
        </ConfigSection>

        {/* Rate Limits Configuration */}
        <ConfigSection
          title="Rate Limits"
          description="Configure request rate limiting to prevent blocking"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-muted)]">
                Requests per Minute
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                value={getCurrentValue('rateLimits.requestsPerMinute') || 60}
                onChange={(e) => handleConfigChange('rateLimits.requestsPerMinute', parseInt(e.target.value) || 60)}
                className="input mt-1"
              />
              <p className="mt-1 text-xs text-[var(--color-text-subtle)]">
                Maximum requests per minute per worker
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-muted)]">
                Burst Limit
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={getCurrentValue('rateLimits.burstLimit') || 10}
                onChange={(e) => handleConfigChange('rateLimits.burstLimit', parseInt(e.target.value) || 10)}
                className="input mt-1"
              />
              <p className="mt-1 text-xs text-[var(--color-text-subtle)]">
                Maximum burst requests before rate limiting kicks in
              </p>
            </div>
          </div>
        </ConfigSection>

        {/* GDPR Configuration */}
        <ConfigSection
          title="GDPR & Privacy"
          description="Configure data privacy and compliance settings"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-[var(--color-text)]">Opt-in Required</h4>
                <p className="text-sm text-[var(--color-text-muted)]">Require explicit consent before processing personal data</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={getCurrentValue('gdprFlags.optInRequired') || false}
                  onChange={(e) => handleConfigChange('gdprFlags.optInRequired', e.target.checked)}
                  className="input-toggle"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-muted)]">
                Data Retention (Days)
              </label>
              <input
                type="number"
                min="1"
                max="3650"
                value={getCurrentValue('gdprFlags.dataRetentionDays') || 365}
                onChange={(e) => handleConfigChange('gdprFlags.dataRetentionDays', parseInt(e.target.value) || 365)}
                className="input mt-1"
              />
              <p className="mt-1 text-xs text-[var(--color-text-subtle)]">
                Automatically delete leads after this many days (1-3650)
              </p>
            </div>
          </div>
        </ConfigSection>

        {/* System Status */}
        <ConfigSection
          title="System Status"
          description="Real-time system health and configuration status"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center justify-between p-3 bg-[var(--color-success-100)] rounded-lg">
              <div>
                <p className="text-sm font-medium text-[var(--color-success-800)]">Database</p>
                <p className="text-xs text-[var(--color-success-600)]">Connected</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-[var(--color-success-500)]"></div>
            </div>

            <div className="flex items-center justify-between p-3 bg-[var(--color-success-100)] rounded-lg">
              <div>
                <p className="text-sm font-medium text-[var(--color-success-800)]">Kafka</p>
                <p className="text-xs text-[var(--color-success-600)]">Healthy</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-[var(--color-success-500)]"></div>
            </div>

            <div className="flex items-center justify-between p-3 bg-[var(--color-warning-100)] rounded-lg">
              <div>
                <p className="text-sm font-medium text-[var(--color-warning-800)]">Prometheus</p>
                <p className="text-xs text-[var(--color-warning-600)]">Warning</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-[var(--color-warning-500)]"></div>
            </div>

            <div className="flex items-center justify-between p-3 bg-[var(--color-primary-100)] rounded-lg">
              <div>
                <p className="text-sm font-medium text-[var(--color-primary-800)]">Active Workers</p>
                <p className="text-xs text-[var(--color-primary-600)]">12/15</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-[var(--color-primary-500)]"></div>
            </div>

            <div className="flex items-center justify-between p-3 bg-[var(--color-bg-subtle)] rounded-lg">
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">Queue Depth</p>
                <p className="text-xs text-[var(--color-text-muted)]">1,245 items</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-[var(--color-text-subtle)]"></div>
            </div>

            <div className="flex items-center justify-between p-3 bg-[var(--color-bg-subtle)] rounded-lg">
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">Last Deploy</p>
                <p className="text-xs text-[var(--color-text-muted)]">2 hours ago</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-[var(--color-text-subtle)]"></div>
            </div>
          </div>
        </ConfigSection>
      </div>
    </Layout>
  );
}
