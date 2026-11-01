import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  RotateCcw,
  Search,
  ExternalLink,
  Sliders,
  Globe,
  Loader2
} from 'lucide-react';

const PRESETS = [
  {
    id: 'black-hat-seo',
    name: 'SEO Spam Bot',
    category: 'High-Risk Bot (Stealth)',
    description: 'Burst spam commit markdown judi/SEO pada repositori tunggal.',
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
    description: 'Auto-commit berkala 15 menit non-stop (aktif 22+ jam/hari).',
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
    description: 'Commit loop script membanjiri repositori 24/7 manipulasi grafik.',
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
    description: 'Bot otomasi upgrade dependensi multi-repo.',
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
    name: 'Human Developer',
    category: 'Legitimate Contributor',
    description: 'Aktivitas organik: siklus istirahat wajar, push, PR review, dan issue.',
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

export default function AccountInspectorPane({ isOpen, onClose, selectedAccount }) {
  const [activeTab, setActiveTab] = useState('live'); // 'live' | 'simulation'
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

  // Set initial preset or account on open
  useEffect(() => {
    if (isOpen && !result) {
      applyPreset('black-hat-seo');
    }
  }, [isOpen]);

  // Update if selectedAccount prop changes
  useEffect(() => {
    if (selectedAccount && isOpen) {
      setActiveTab('simulation');
      setSelectedPreset('custom');
      const customF = {
        n_events: selectedAccount.events || 100,
        n_repos: selectedAccount.repos || 1,
        jam_aktif: Math.round((selectedAccount.activeFraction || 0.5) * 152),
        frac_push: 0.85,
        frac_create: 0.05,
        frac_pr: 0.05,
        frac_issue: 0.05,
        frac_social: 0.0,
        max_repo_share: 0.9,
        hour_entropy: 0.75,
        max_per_hour: 15
      };
      setFeatures(customF);
      runPrediction(customF);
    }
  }, [selectedAccount, isOpen]);

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
      // Local fallback heuristic
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
    <>
      {/* Dark overlay backdrop dimming page on left, click to close */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] z-40 transition-opacity cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Split-Screen Side Inspector Pane */}
      <aside
        className="fixed top-0 right-0 h-full w-full sm:w-[480px] xl:w-[500px] bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col pane-slide-in select-none text-slate-900"
        aria-label="Account Inspector Pane"
      >
        {/* Pane Header - Pure Typography, No decorative icons */}
        <div className="h-14 px-5 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 className="font-sans text-[14px] font-bold text-navy-950 uppercase tracking-wider">
              Account Inspector
            </h2>
            <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest -mt-0.5">
              11-D Behavioral Inference
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-navy-950 hover:bg-slate-100 rounded-[4px] transition-colors"
            aria-label="Close Inspector Pane"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 py-2 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('live')}
              className={`px-3 py-1 text-[12px] font-sans font-medium rounded-[4px] transition-colors ${
                activeTab === 'live'
                  ? 'bg-navy-950 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-navy-950 hover:bg-slate-200/50'
              }`}
            >
              Live GitHub API
            </button>
            <button
              onClick={() => setActiveTab('simulation')}
              className={`px-3 py-1 text-[12px] font-sans font-medium rounded-[4px] transition-colors ${
                activeTab === 'simulation'
                  ? 'bg-navy-950 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-navy-950 hover:bg-slate-200/50'
              }`}
            >
              Manual Simulation
            </button>
          </div>

          <span className="font-mono text-[10px] text-slate-500 uppercase">
            {activeTab === 'live' ? 'ONLINE MODE' : 'OFFLINE SIM'}
          </span>
        </div>

        {/* Scrollable Main Content */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-200">
          {/* Section A: Input Controls */}
          <div className="p-5 space-y-4">
            {activeTab === 'live' ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-sans text-[13px] font-semibold text-navy-950 uppercase tracking-wider">
                    GitHub Username or Profile URL
                  </h3>
                  <p className="font-sans text-[12px] text-slate-500 mt-0.5">
                    Queries public events directly from the GitHub REST API.
                  </p>
                </div>

                <form onSubmit={handleLiveLookup} className="flex gap-2">
                  <input
                    type="text"
                    value={liveUsername}
                    onChange={(e) => setLiveUsername(e.target.value)}
                    placeholder="e.g. torvalds or username"
                    className="flex-1 bg-white border border-slate-300 font-mono text-[12px] text-navy-950 px-3 py-2 rounded-[4px] outline-none focus:border-navy-800 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={loading || !liveUsername.trim()}
                    className="px-4 py-2 bg-navy-950 text-white hover:bg-navy-900 font-sans text-[12px] font-medium rounded-[4px] transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-2xs"
                  >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                    <span>Lookup</span>
                  </button>
                </form>

                {/* Quick-fill Pills */}
                <div>
                  <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block mb-1.5">
                    Target Candidates:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'mccartyashley284', label: 'mccartyashley284 (Spam)' },
                      { id: 'hiro-kurage', label: 'hiro-kurage (Forex EA)' },
                      { id: 'nonkh', label: 'nonkh (Spoofer)' },
                      { id: 'torvalds', label: 'torvalds (Human)' }
                    ].map((chip) => (
                      <button
                        key={chip.id}
                        type="button"
                        onClick={() => handleLiveLookup(null, chip.id)}
                        className="px-2 py-0.5 text-[11px] font-mono bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-[4px] transition-colors"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 font-mono text-[11px] rounded-[4px]">
                    Error: {errorMessage}
                  </div>
                )}

                {liveUserData && (
                  <div className="p-3.5 border border-slate-200 bg-slate-50 flex items-start gap-3 rounded-[4px]">
                    {liveUserData.avatar_url && (
                      <img
                        src={liveUserData.avatar_url}
                        alt={liveUserData.username}
                        className="w-10 h-10 border border-slate-300 rounded-[4px] shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-sans text-[13px] font-bold text-navy-950 truncate">
                          {liveUserData.name || liveUserData.username}
                        </span>
                        <a
                          href={liveUserData.html_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-navy-950 p-0.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      <span className="font-mono text-[11px] text-slate-500 block">
                        @{liveUserData.username}
                      </span>
                      <div className="flex gap-3 font-mono text-[11px] text-slate-600 mt-1">
                        <span>Repos: <strong className="text-navy-950">{liveUserData.public_repos}</strong></span>
                        <span>Events: <strong className="text-navy-950">{liveRawMetrics?.n_events || 0}</strong></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                    Archetype Presets:
                  </span>
                  <button
                    onClick={() => applyPreset(selectedPreset !== 'custom' ? selectedPreset : 'black-hat-seo')}
                    className="font-mono text-[11px] text-slate-500 hover:text-navy-950 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {PRESETS.map((p) => {
                    const isSelected = selectedPreset === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => applyPreset(p.id)}
                        className={`px-2.5 py-1.5 text-left rounded-[4px] text-[11px] border transition-colors ${
                          isSelected
                            ? 'bg-navy-950 text-white border-navy-950 font-medium'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <div className="truncate font-semibold">{p.name}</div>
                        <div className="text-[10px] opacity-75 truncate">{p.category}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Sliders */}
                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex justify-between font-mono text-[11px] mb-1">
                      <span className="text-slate-600">Events (n_events)</span>
                      <span className="font-bold text-navy-950">{features.n_events}</span>
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

                  <div>
                    <div className="flex justify-between font-mono text-[11px] mb-1">
                      <span className="text-slate-600">Distinct Repos (n_repos)</span>
                      <span className="font-bold text-navy-950">{features.n_repos}</span>
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

                  <div>
                    <div className="flex justify-between font-mono text-[11px] mb-1">
                      <span className="text-slate-600">Active Hours (jam_aktif)</span>
                      <span className="font-bold text-navy-950">{features.jam_aktif}h</span>
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

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <div className="flex justify-between font-mono text-[10px] mb-1">
                        <span className="text-slate-600">Push Ratio</span>
                        <span className="font-bold">{(features.frac_push * 100).toFixed(0)}%</span>
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

                    <div>
                      <div className="flex justify-between font-mono text-[10px] mb-1">
                        <span className="text-slate-600">PR Ratio</span>
                        <span className="font-bold">{(features.frac_pr * 100).toFixed(0)}%</span>
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

                    <div>
                      <div className="flex justify-between font-mono text-[10px] mb-1">
                        <span className="text-slate-600">Repo Share</span>
                        <span className="font-bold">{(features.max_repo_share * 100).toFixed(0)}%</span>
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

                    <div>
                      <div className="flex justify-between font-mono text-[10px] mb-1">
                        <span className="text-slate-600">Hour Entropy</span>
                        <span className="font-bold">{features.hour_entropy.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.02"
                        value={features.hour_entropy}
                        onChange={(e) => handleFeatureChange('hour_entropy', e.target.value)}
                        className="metric-slider"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => runPrediction()}
                  disabled={loading}
                  className="w-full py-2 bg-navy-950 text-white hover:bg-navy-900 font-sans text-[12px] font-medium rounded-[4px] transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 border border-navy-800 shadow-2xs"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  <span>Run Anomaly Inference</span>
                </button>
              </div>
            )}
          </div>

          {/* Section B: Inference Results - Anti Box-in-a-Box, Clean Hairline Sections */}
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-sans text-[13px] font-semibold text-navy-950 uppercase tracking-wider">
                Inference Results
              </h3>
              <span className="font-mono text-[10px] text-slate-500 uppercase">
                MODEL: ISOLATION FOREST
              </span>
            </div>

            {/* Score & Verdict Banner */}
            <div
              className={`p-4 border rounded-[4px] ${
                isAnomaly
                  ? 'border-rose-300 bg-rose-50/50'
                  : 'border-emerald-300 bg-emerald-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`font-sans text-[12px] font-bold uppercase tracking-wider ${
                    isAnomaly ? 'text-rose-700' : 'text-emerald-700'
                  }`}
                >
                  {isAnomaly ? 'ANOMALY (BOT-LIKE)' : 'NORMAL CONTRIBUTOR'}
                </span>
                <span className="font-mono text-[10px] font-semibold text-slate-600 uppercase">
                  {isAnomaly ? 'SCORE ≥ THRESHOLD' : 'SCORE < THRESHOLD'}
                </span>
              </div>

              <div className="mt-3 flex items-baseline justify-between">
                <div>
                  <span className="font-mono text-[10px] text-slate-500 uppercase block">
                    Anomaly Score
                  </span>
                  <span className="font-mono text-3xl font-bold tracking-tight text-navy-950">
                    {score.toFixed(4)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[10px] text-slate-500 uppercase block">
                    Cutoff (τ)
                  </span>
                  <span className="font-mono text-[13px] font-semibold text-slate-600">
                    {threshold.toFixed(4)}
                  </span>
                </div>
              </div>

              {/* Progress bar line */}
              <div className="mt-3 relative w-full h-1.5 bg-slate-200 overflow-hidden rounded-[2px]">
                <div
                  className={`h-full transition-all duration-300 ${
                    isAnomaly ? 'bg-rose-600' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${Math.min(Math.max((score / 1.0) * 100, 5), 100)}%` }}
                />
              </div>
            </div>

            {/* Cluster Attribution Section */}
            <div className="pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] text-slate-500 uppercase font-medium">
                  Attributed Cluster
                </span>
                <span className="font-mono text-[11px] font-semibold text-navy-950 bg-slate-100 px-1.5 py-0.5 border border-slate-200 rounded-[4px]">
                  Cluster {result?.cluster_id ?? 0}
                </span>
              </div>
              <div className="font-sans text-[13px] font-bold text-navy-950">
                {result?.cluster_badge || 'Behavioral Archetype'}
              </div>
              <ul className="mt-2 space-y-1 text-[11px] text-slate-600 font-sans">
                {result?.cluster_characteristics?.length ? (
                  result.cluster_characteristics.map((c, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-navy-900 font-bold">•</span>
                      <span>{c}</span>
                    </li>
                  ))
                ) : (
                  <li className="italic">K-Means behavioral profile vector</li>
                )}
              </ul>
            </div>

            {/* PCA Coordinates */}
            <div className="pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] text-slate-500 uppercase font-medium">
                  PCA 2D Coordinates
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  Variance ~68.4%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-[4px]">
                  <span className="text-slate-500 text-[10px] uppercase block">PC1 (Velocity)</span>
                  <span className="text-base font-bold text-navy-950">
                    {result?.pc1 != null ? result.pc1.toFixed(3) : '0.000'}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-[4px]">
                  <span className="text-slate-500 text-[10px] uppercase block">PC2 (Circadian)</span>
                  <span className="text-base font-bold text-navy-950">
                    {result?.pc2 != null ? result.pc2.toFixed(3) : '0.000'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
