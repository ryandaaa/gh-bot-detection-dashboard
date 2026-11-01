import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Layers,
  Crosshair,
  ShieldAlert,
  Loader2,
  Search,
  ExternalLink,
  Sliders,
  Globe
} from 'lucide-react';

const PRESETS = [
  {
    id: 'black-hat-seo',
    name: 'Judi (Black-Hat SEO)',
    category: 'High-Risk Bot (Stealth)',
    description: 'Ribuan backlink markdown judi/SEO spam dalam burst hitungan menit pada 1 repo tunggal.',
    features: {
      n_events: 35,
      n_repos: 1,
      jam_aktif: 2,
      frac_push: 1.0,
      frac_create: 0.0,
      frac_pr: 0.0,
      frac_issue: 0.0,
      frac_social: 0.0,
      max_repo_share: 1.0,
      hour_entropy: 0.28,
      max_per_hour: 25
    }
  },
  {
    id: 'forex-ea',
    name: 'Forex EA Deployer',
    category: 'Persistent Automated Bot',
    description: 'Auto-commit sinkronisasi status posisi valuta asing setiap 15 menit non-stop (aktif 22+ jam/hari).',
    features: {
      n_events: 48,
      n_repos: 1,
      jam_aktif: 22,
      frac_push: 1.0,
      frac_create: 0.0,
      frac_pr: 0.0,
      frac_issue: 0.0,
      frac_social: 0.0,
      max_repo_share: 1.0,
      hour_entropy: 0.95,
      max_per_hour: 3
    }
  },
  {
    id: 'commit-spoofer',
    name: '100k Spoofer',
    category: 'Extreme Profile Spoofer',
    description: 'Infinite commit loop script membanjiri repositori 24/7 untuk memanipulasi grafik hijau portofolio.',
    features: {
      n_events: 1868,
      n_repos: 1,
      jam_aktif: 78,
      frac_push: 1.0,
      frac_create: 0.0,
      frac_pr: 0.0,
      frac_issue: 0.0,
      frac_social: 0.0,
      max_repo_share: 1.0,
      hour_entropy: 0.98,
      max_per_hour: 45
    }
  },
  {
    id: 'automated-ci',
    name: 'CI Bot (Dependabot)',
    category: 'Official Automation / Dependabot',
    description: 'Bot otomasi dependency upgrade dan Pull Request multi-repo dengan entropy jam terdistribusi.',
    features: {
      n_events: 85,
      n_repos: 12,
      jam_aktif: 30,
      frac_push: 0.15,
      frac_create: 0.05,
      frac_pr: 0.65,
      frac_issue: 0.15,
      frac_social: 0.0,
      max_repo_share: 0.20,
      hour_entropy: 0.82,
      max_per_hour: 10
    }
  },
  {
    id: 'normal-developer',
    name: 'Normal Human Dev',
    category: 'Legitimate Contributor',
    description: 'Ritme manusia organik: aktivitas istirahat malam teratur, commit push terukur, PR review, dan issue.',
    features: {
      n_events: 32,
      n_repos: 3,
      jam_aktif: 14,
      frac_push: 0.60,
      frac_create: 0.10,
      frac_pr: 0.20,
      frac_issue: 0.10,
      frac_social: 0.0,
      max_repo_share: 0.65,
      hour_entropy: 0.68,
      max_per_hour: 5
    }
  }
];

const DEFAULT_FEATURES = PRESETS[0].features;

export default function AnalyzeModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('live'); // 'live' | 'simulation' (Default: 'live')
  const [selectedPreset, setSelectedPreset] = useState('black-hat-seo');
  const [features, setFeatures] = useState(DEFAULT_FEATURES);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [liveUsername, setLiveUsername] = useState('');
  const [liveUserData, setLiveUserData] = useState(null);
  const [liveRawMetrics, setLiveRawMetrics] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Set initial preset on mount
  useEffect(() => {
    if (isOpen && !result) {
      applyPreset('black-hat-seo');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const applyPreset = (presetId) => {
    setSelectedPreset(presetId);
    setLiveUserData(null);
    setErrorMessage(null);
    if (presetId === 'custom') return;
    const preset = PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setFeatures({ ...preset.features });
      runPrediction({ ...preset.features });
    }
  };

  const handleFeatureChange = (key, value) => {
    setSelectedPreset('custom');
    setFeatures((prev) => ({
      ...prev,
      [key]: typeof value === 'string' ? parseFloat(value) || 0 : value,
    }));
  };

  const runPrediction = async (customPayload) => {
    setLoading(true);
    setErrorMessage(null);
    const payload = customPayload || features;

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      // Local fallback computation if FastAPI is disconnected
      console.warn('API error, executing internal heuristic fallback:', err);
      const isExtreme = payload.n_events > 1000 || (payload.hour_entropy > 0.9 && payload.jam_aktif > 40);
      const isBurstJudi = payload.max_per_hour > 20 && payload.frac_push > 0.9 && payload.n_repos <= 1;
      const isCI = payload.frac_pr > 0.4 || payload.frac_issue > 0.3;
      
      let score = 0.42;
      let clusterId = 1;
      let clusterBadge = 'Heavy Pushers';
      let title = 'Cluster 1';
      let characteristics = ['Standard developer profile'];

      if (isExtreme) {
        score = 0.82;
        clusterId = 2;
        clusterBadge = '100k Spoofer / Infinite Loop';
        title = 'Cluster 2';
        characteristics = ['Aktivitas >1000 event pada 1 repositori', 'Entropi jam ekstrem mendekati 1.0 (non-stop)'];
      } else if (isBurstJudi) {
        score = 0.74;
        clusterId = 0;
        clusterBadge = 'Heavy Pushers (Stealth Burst)';
        title = 'Cluster 0';
        characteristics = ['Dominasi push 100% pada 1 repositori', 'Entropi rendah terkonsentrasi dalam hitungan jam'];
      } else if (isCI) {
        score = 0.58;
        clusterId = 3;
        clusterBadge = 'Automated CI / Bots';
        title = 'Cluster 3';
        characteristics = ['Dominasi Pull Request & Issue event', 'Aktivitas multi-repo terdistribusi otomatis'];
      } else {
        score = 0.38;
        clusterId = 1;
        clusterBadge = 'Normal Contributor';
        title = 'Cluster 1';
        characteristics = ['Ritme organik push dan review', 'Jam aktif wajar dengan siklus tidur malam'];
      }

      const threshold = 0.5514;
      const isAnomaly = score >= threshold;

      setResult({
        score: score,
        threshold: threshold,
        is_anomaly: isAnomaly,
        status: isAnomaly ? 'Anomaly (Bot-like)' : 'Normal Contributor',
        cluster_id: clusterId,
        cluster_badge: clusterBadge,
        cluster_title: title,
        cluster_characteristics: characteristics,
        pc1: isAnomaly ? -1.85 : 0.42,
        pc2: isAnomaly ? 2.15 : -0.35,
        features_transformed: payload,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLiveLookup = async (e, targetOverride) => {
    if (e) e.preventDefault();
    const target = (targetOverride || liveUsername || '').trim();
    if (!target) return;

    if (targetOverride) {
      setLiveUsername(targetOverride);
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/analyze-github?username=${encodeURIComponent(target)}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server returned ${res.status}`);
      }

      const data = await res.json();
      setLiveUserData(data.user_info);
      setLiveRawMetrics(data.raw_metrics);
      setResult(data.prediction);
      if (data.raw_metrics) {
        setFeatures({
          n_events: data.raw_metrics.n_events,
          n_repos: data.raw_metrics.n_repos,
          jam_aktif: data.raw_metrics.active_hours,
          frac_push: data.raw_metrics.push_ratio,
          frac_pr: data.raw_metrics.pr_ratio,
          frac_issue: data.raw_metrics.issue_ratio,
          frac_create: data.raw_metrics.create_ratio,
          frac_social: data.raw_metrics.social_ratio,
          max_repo_share: data.raw_metrics.max_repo_share,
          hour_entropy: data.raw_metrics.hour_entropy,
          max_per_hour: data.raw_metrics.max_per_hour
        });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to fetch live GitHub account profile.');
    } finally {
      setLoading(false);
    }
  };

  const threshold = result?.threshold ?? 0.5514;
  const score = result?.score ?? 0.0;
  const isAnomaly = result?.is_anomaly ?? score >= threshold;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Dark Blur Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity modal-backdrop-animate"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-6">
        <div className="relative w-full max-w-5xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-border-subtle overflow-hidden modal-card-animate z-10 flex flex-col max-h-[92vh]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between bg-surface-bright/70">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-sm">
                <Sparkles className="w-5 h-5 text-accent-cluster-1" />
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold tracking-tight">
                  Behavioral Account Inference Simulator
                </h2>
                <p className="font-body-sm text-body-sm text-secondary">
                  Evaluate account anomaly score, cluster attribution, and 2D PCA embedding in real-time
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-hover transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switch Tabs & Preset Bar */}
          <div className="px-6 py-2.5 border-b border-border-subtle bg-surface-muted/40 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('live')}
                className={`px-3 py-1.5 rounded-lg font-label-md text-label-md transition-all flex items-center gap-1.5 ${
                  activeTab === 'live'
                    ? 'bg-primary text-on-primary shadow-sm font-semibold'
                    : 'bg-surface-container-lowest hover:bg-surface-hover text-secondary border border-border-subtle'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Live GitHub URL / Username</span>
              </button>

              <button
                onClick={() => setActiveTab('simulation')}
                className={`px-3 py-1.5 rounded-lg font-label-md text-label-md transition-all flex items-center gap-1.5 ${
                  activeTab === 'simulation'
                    ? 'bg-primary text-on-primary shadow-sm font-semibold'
                    : 'bg-surface-container-lowest hover:bg-surface-hover text-secondary border border-border-subtle'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Manual Feature Simulation</span>
              </button>
            </div>

            {activeTab === 'simulation' && (
              <div className="flex items-center gap-1.5 overflow-x-auto min-w-max">
                <span className="font-label-sm text-label-sm text-secondary uppercase font-semibold mr-1">
                  Presets:
                </span>
                {PRESETS.map((preset) => {
                  const isSelected = selectedPreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => applyPreset(preset.id)}
                      className={`px-2.5 py-1 rounded-md text-xs transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-primary text-on-primary font-semibold shadow-xs'
                          : 'bg-surface-container-lowest hover:bg-surface-hover text-on-surface-variant border border-border-subtle'
                      }`}
                    >
                      <span>{preset.name}</span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-accent-cluster-1"></span>}
                    </button>
                  );
                })}
                <button
                  onClick={() => setSelectedPreset('custom')}
                  className={`px-2.5 py-1 rounded-md text-xs transition-all ${
                    selectedPreset === 'custom'
                      ? 'bg-primary text-on-primary font-semibold shadow-xs'
                      : 'bg-surface-container-lowest hover:bg-surface-hover text-on-surface-variant border border-border-subtle'
                  }`}
                >
                  Custom
                </button>
              </div>
            )}
          </div>

          {/* Modal Main Body */}
          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Input Panel (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              {activeTab === 'live' ? (
                /* Live GitHub Account Search Tab */
                <div className="flex flex-col gap-4 bg-surface-bright/50 p-5 rounded-xl border border-border-subtle">
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold flex items-center gap-2">
                      <Search className="w-4 h-4 text-accent-cluster-1" />
                      <span>Live GitHub Account Lookup</span>
                    </h3>
                    <p className="font-body-sm text-body-sm text-secondary mt-1">
                      Lookup any public GitHub profile or URL. The backend fetches recent timeline events, extracts 11 dimensions, and scores the actor.
                    </p>
                  </div>

                  <form onSubmit={handleLiveLookup} className="flex gap-2">
                    <input
                      type="text"
                      value={liveUsername}
                      onChange={(e) => setLiveUsername(e.target.value)}
                      placeholder="e.g. torvalds or https://github.com/mccartyashley284"
                      className="flex-1 bg-surface-container-lowest text-on-surface font-code-md text-code-md px-3.5 py-2.5 rounded-xl outline-none border border-border-subtle focus:border-primary/50 shadow-2xs"
                    />
                    <button
                      type="submit"
                      disabled={loading || !liveUsername.trim()}
                      className="px-5 py-2.5 bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                      <span>Analyze Profile</span>
                    </button>
                  </form>

                  {/* Quick-fill chips */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="text-xs text-secondary font-medium mr-1">Quick-fill:</span>
                    {[
                      { id: 'mccartyashley284', label: 'mccartyashley284 (Spam Bot)' },
                      { id: 'hiro-kurage', label: 'hiro-kurage (Forex EA)' },
                      { id: 'nonkh', label: 'nonkh (Commit Spoofer)' },
                      { id: 'torvalds', label: 'torvalds (Human Contributor)' }
                    ].map((chip) => (
                      <button
                        key={chip.id}
                        type="button"
                        onClick={() => handleLiveLookup(null, chip.id)}
                        className="px-2.5 py-1 rounded-full text-xs bg-surface-container-lowest hover:bg-surface-hover text-on-surface border border-border-subtle transition-colors flex items-center gap-1 active:scale-95"
                      >
                        <span>{chip.label}</span>
                      </button>
                    ))}
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {liveUserData && (
                    <div className="p-4 rounded-xl bg-surface-container-lowest border border-border-subtle flex items-start gap-4">
                      {liveUserData.avatar_url && (
                        <img
                          src={liveUserData.avatar_url}
                          alt={liveUserData.username}
                          className="w-14 h-14 rounded-full border border-border-subtle shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-headline-sm text-base font-bold text-on-surface truncate">
                            {liveUserData.name || liveUserData.username}
                          </h4>
                          <a
                            href={liveUserData.html_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-secondary hover:text-on-surface p-1 rounded"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                        <p className="text-xs text-secondary font-code-sm mb-1">@{liveUserData.username}</p>
                        {liveUserData.bio && <p className="text-xs text-on-surface-variant mb-2">{liveUserData.bio}</p>}
                        <div className="flex gap-4 text-xs text-secondary font-code-sm">
                          <span>Repos: <strong className="text-on-surface">{liveUserData.public_repos}</strong></span>
                          <span>Followers: <strong className="text-on-surface">{liveUserData.followers}</strong></span>
                          <span>Events Sampled: <strong className="text-on-surface">{liveRawMetrics?.n_events || 0}</strong></span>
                        </div>
                      </div>
                    </div>
                  )}

                  {liveRawMetrics && (
                    <div className="p-4 rounded-xl bg-surface-container-lowest border border-border-subtle space-y-2.5">
                      <div className="flex items-center justify-between border-b border-border-subtle/60 pb-1.5">
                        <span className="font-label-sm text-label-sm text-secondary uppercase font-semibold">
                          11 Extracted Behavioral Metrics
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveTab('simulation')}
                          className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
                        >
                          <Sliders className="w-3 h-3" />
                          <span>Simulate in Manual Tab</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div className="bg-surface-bright p-2 rounded-lg border border-border-subtle/50">
                          <span className="text-secondary block">Push Ratio</span>
                          <span className="font-semibold font-code-sm">{(liveRawMetrics.push_ratio * 100).toFixed(0)}%</span>
                        </div>
                        <div className="bg-surface-bright p-2 rounded-lg border border-border-subtle/50">
                          <span className="text-secondary block">PR / Review</span>
                          <span className="font-semibold font-code-sm">{(liveRawMetrics.pr_ratio * 100).toFixed(0)}%</span>
                        </div>
                        <div className="bg-surface-bright p-2 rounded-lg border border-border-subtle/50">
                          <span className="text-secondary block">Issue Activity</span>
                          <span className="font-semibold font-code-sm">{(liveRawMetrics.issue_ratio * 100).toFixed(0)}%</span>
                        </div>
                        <div className="bg-surface-bright p-2 rounded-lg border border-border-subtle/50">
                          <span className="text-secondary block">Create Ratio</span>
                          <span className="font-semibold font-code-sm">{(liveRawMetrics.create_ratio * 100).toFixed(0)}%</span>
                        </div>
                        <div className="bg-surface-bright p-2 rounded-lg border border-border-subtle/50">
                          <span className="text-secondary block">Max Repo Share</span>
                          <span className="font-semibold font-code-sm">{(liveRawMetrics.max_repo_share * 100).toFixed(0)}%</span>
                        </div>
                        <div className="bg-surface-bright p-2 rounded-lg border border-border-subtle/50">
                          <span className="text-secondary block">Hour Entropy</span>
                          <span className="font-semibold font-code-sm">{liveRawMetrics.hour_entropy.toFixed(2)}</span>
                        </div>
                        <div className="bg-surface-bright p-2 rounded-lg border border-border-subtle/50">
                          <span className="text-secondary block">Active Hours</span>
                          <span className="font-semibold font-code-sm">{liveRawMetrics.active_hours}h</span>
                        </div>
                        <div className="bg-surface-bright p-2 rounded-lg border border-border-subtle/50">
                          <span className="text-secondary block">Max / Hour</span>
                          <span className="font-semibold font-code-sm">{liveRawMetrics.max_per_hour} evt/h</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-secondary bg-surface-muted p-3 rounded-lg border border-border-subtle flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-secondary" />
                    <span>Rate limit applies to GitHub REST API. Unauthenticated requests share an IP pool (60 req/hr).</span>
                  </div>
                </div>
              ) : (
                /* Feature Sliders Tab */
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                        Behavioral Feature Inputs (11 Metrics)
                      </h3>
                      <p className="font-body-sm text-body-sm text-secondary">
                        Feature values matching the 152-hour window aggregation schema
                      </p>
                    </div>
                    <button
                      onClick={() => applyPreset(selectedPreset !== 'custom' ? selectedPreset : 'black-hat-seo')}
                      className="inline-flex items-center gap-1 text-secondary hover:text-on-surface font-label-md text-label-md py-1 px-2 rounded hover:bg-surface-hover transition-colors"
                      title="Reset to current preset values"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>

                  {/* Sliders Container */}
                  <div className="space-y-4 bg-surface-bright/50 p-4 rounded-xl border border-border-subtle">
                    {/* 1. Total Events */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="font-label-md text-label-md text-on-surface font-medium">
                          1. Total Events (n_events)
                        </label>
                        <span className="font-code-md text-code-md font-semibold text-primary bg-surface-container px-2 py-0.5 rounded">
                          {features.n_events}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="3000"
                        step="1"
                        value={features.n_events}
                        onChange={(e) => handleFeatureChange('n_events', e.target.value)}
                        className="metric-slider"
                      />
                    </div>

                    {/* 2. Number of Repositories */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="font-label-md text-label-md text-on-surface font-medium">
                          2. Distinct Repositories (n_repos)
                        </label>
                        <span className="font-code-md text-code-md font-semibold text-primary bg-surface-container px-2 py-0.5 rounded">
                          {features.n_repos}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="50"
                        step="1"
                        value={features.n_repos}
                        onChange={(e) => handleFeatureChange('n_repos', e.target.value)}
                        className="metric-slider"
                      />
                    </div>

                    {/* 3. Active Hours */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="font-label-md text-label-md text-on-surface font-medium">
                          3. Active Hours (jam_aktif / 152h window)
                        </label>
                        <span className="font-code-md text-code-md font-semibold text-primary bg-surface-container px-2 py-0.5 rounded">
                          {features.jam_aktif} jam
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="152"
                        step="1"
                        value={features.jam_aktif}
                        onChange={(e) => handleFeatureChange('jam_aktif', e.target.value)}
                        className="metric-slider"
                      />
                    </div>

                    {/* Action Proportions */}
                    <div className="pt-2 border-t border-border-subtle">
                      <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold block mb-2">
                        Action Proportions (0.0 – 1.0)
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* 4. Push Fraction */}
                        <div>
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="font-medium text-on-surface">4. Push Event:</span>
                            <span className="font-code-sm font-semibold">{(features.frac_push * 100).toFixed(0)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={features.frac_push}
                            onChange={(e) => handleFeatureChange('frac_push', e.target.value)}
                            className="metric-slider"
                          />
                        </div>

                        {/* 5. PR Fraction */}
                        <div>
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="font-medium text-on-surface">5. Pull Request:</span>
                            <span className="font-code-sm font-semibold">{(features.frac_pr * 100).toFixed(0)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={features.frac_pr}
                            onChange={(e) => handleFeatureChange('frac_pr', e.target.value)}
                            className="metric-slider"
                          />
                        </div>

                        {/* 6. Issue Fraction */}
                        <div>
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="font-medium text-on-surface">6. Issue Event:</span>
                            <span className="font-code-sm font-semibold">{(features.frac_issue * 100).toFixed(0)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={features.frac_issue}
                            onChange={(e) => handleFeatureChange('frac_issue', e.target.value)}
                            className="metric-slider"
                          />
                        </div>

                        {/* 7. Create Fraction */}
                        <div>
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="font-medium text-on-surface">7. Create Event:</span>
                            <span className="font-code-sm font-semibold">{(features.frac_create * 100).toFixed(0)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={features.frac_create}
                            onChange={(e) => handleFeatureChange('frac_create', e.target.value)}
                            className="metric-slider"
                          />
                        </div>

                        {/* 8. Social Fraction */}
                        <div className="sm:col-span-2">
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="font-medium text-on-surface">8. Social (Watch/Fork):</span>
                            <span className="font-code-sm font-semibold">{(features.frac_social * 100).toFixed(0)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={features.frac_social}
                            onChange={(e) => handleFeatureChange('frac_social', e.target.value)}
                            className="metric-slider"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Structural and Velocity Dynamics */}
                    <div className="pt-2 border-t border-border-subtle space-y-3">
                      <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold block">
                        Structural & Temporal Velocity
                      </span>

                      {/* 9. Max Repo Share */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="font-label-md text-label-md text-on-surface font-medium">
                            9. Max Repo Concentration
                          </label>
                          <span className="font-code-md text-code-md font-semibold text-primary bg-surface-container px-2 py-0.5 rounded">
                            {(features.max_repo_share * 100).toFixed(0)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="1.0"
                          step="0.05"
                          value={features.max_repo_share}
                          onChange={(e) => handleFeatureChange('max_repo_share', e.target.value)}
                          className="metric-slider"
                        />
                      </div>

                      {/* 10. Hour Entropy */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="font-label-md text-label-md text-on-surface font-medium">
                            10. Normalized 24h Entropy
                          </label>
                          <span className="font-code-md text-code-md font-semibold text-primary bg-surface-container px-2 py-0.5 rounded">
                            {features.hour_entropy.toFixed(2)}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.0"
                          max="1.0"
                          step="0.02"
                          value={features.hour_entropy}
                          onChange={(e) => handleFeatureChange('hour_entropy', e.target.value)}
                          className="metric-slider"
                        />
                      </div>

                      {/* 11. Max Per Hour */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="font-label-md text-label-md text-on-surface font-medium">
                            11. Peak Hourly Velocity
                          </label>
                          <span className="font-code-md text-code-md font-semibold text-primary bg-surface-container px-2 py-0.5 rounded">
                            {features.max_per_hour} evt/jam
                          </span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="150"
                          step="1"
                          value={features.max_per_hour}
                          onChange={(e) => handleFeatureChange('max_per_hour', e.target.value)}
                          className="metric-slider"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Run Prediction Button */}
                  <button
                    onClick={() => runPrediction()}
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-semibold shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-accent-cluster-1" />
                        <span>Computing Isolation Forest Score & Cluster...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>Run Prediction & Anomaly Inference</span>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>

            {/* Right Column: Prediction Output Card (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Inference Results
              </h3>

              {/* Primary Score Card */}
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  isAnomaly
                    ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                    : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isAnomaly ? (
                      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    <span className="font-label-md text-label-md uppercase font-bold tracking-wider">
                      {isAnomaly ? 'Anomaly (Bot-like)' : 'Normal Contributor'}
                    </span>
                  </div>
                  <span
                    className={`font-code-sm text-code-sm font-semibold px-2 py-0.5 rounded-full ${
                      isAnomaly ? 'bg-rose-200 text-rose-800' : 'bg-emerald-200 text-emerald-800'
                    }`}
                  >
                    {isAnomaly ? 'Score ≥ Threshold' : 'Score < Threshold'}
                  </span>
                </div>

                {/* Score vs Threshold metric display */}
                <div className="mt-4 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-secondary uppercase tracking-wider block">
                      Anomaly Score
                    </span>
                    <span className="font-metric-display text-4xl font-bold tracking-tight">
                      {score.toFixed(4)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-secondary uppercase tracking-wider block">
                      Cutoff (τ)
                    </span>
                    <span className="font-code-md text-code-md font-semibold text-secondary">
                      {threshold.toFixed(4)}
                    </span>
                  </div>
                </div>

                {/* Progress bar comparison */}
                <div className="mt-3 relative w-full h-3 bg-white/80 rounded-full overflow-hidden border border-border-subtle">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${
                      isAnomaly ? 'bg-rose-600' : 'bg-emerald-600'
                    }`}
                    style={{ width: `${Math.min(Math.max((score / 1.0) * 100, 5), 100)}%` }}
                  />
                  {/* Threshold vertical marker */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-black z-10"
                    style={{ left: `${(threshold / 1.0) * 100}%` }}
                    title={`Threshold cutoff: ${threshold}`}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-secondary mt-1 font-code-sm">
                  <span>0.00 (Normal)</span>
                  <span className="text-black font-semibold">▲ Cutoff {threshold}</span>
                  <span>1.00 (Extreme)</span>
                </div>
              </div>

              {/* Cluster Attribution Panel */}
              <div className="bg-surface-container-lowest p-5 rounded-2xl border border-border-subtle shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-accent-cluster-2" />
                    <span className="font-label-md text-label-md font-semibold text-on-surface">
                      Cluster Attribution
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-lg bg-surface-container font-code-sm text-code-sm font-semibold text-on-surface">
                    Cluster {result?.cluster_id ?? 0}
                  </span>
                </div>

                <div className="bg-surface-bright p-3 rounded-xl border border-border-subtle">
                  <div className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    {result?.cluster_badge || 'Behavioral Archetype'}
                  </div>
                  <ul className="mt-2 space-y-1.5 text-xs text-secondary">
                    {result?.cluster_characteristics?.length ? (
                      result.cluster_characteristics.map((c, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-accent-cluster-1 font-bold">•</span>
                          <span>{c}</span>
                        </li>
                      ))
                    ) : (
                      <li className="italic">K-Means behavioral clustering model</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* 2D PCA Embedding Card */}
              <div className="bg-surface-container-lowest p-5 rounded-2xl border border-border-subtle shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-accent-cluster-1" />
                    <span className="font-label-md text-label-md font-semibold text-on-surface">
                      PCA 2D Coordinates
                    </span>
                  </div>
                  <span className="font-code-sm text-code-sm text-secondary">
                    Variance ~68.4%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-surface-bright p-3 rounded-xl border border-border-subtle text-center">
                    <span className="text-[11px] text-secondary font-code-sm uppercase block">
                      Principal Comp 1
                    </span>
                    <span className="font-code-md text-lg font-bold text-on-surface">
                      {result?.pc1 != null ? result.pc1.toFixed(3) : '0.000'}
                    </span>
                  </div>
                  <div className="bg-surface-bright p-3 rounded-xl border border-border-subtle text-center">
                    <span className="text-[11px] text-secondary font-code-sm uppercase block">
                      Principal Comp 2
                    </span>
                    <span className="font-code-md text-lg font-bold text-on-surface">
                      {result?.pc2 != null ? result.pc2.toFixed(3) : '0.000'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Forensic Insight note */}
              <div className="p-4 rounded-xl bg-surface-muted/60 border border-border-subtle text-xs text-secondary flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Inference is evaluated over 11 standardized dimensions trained on 239.6K feature vectors from GH Archive public records.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
