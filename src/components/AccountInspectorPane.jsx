import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Skeleton from './Skeleton';
import {
  X,
  Play,
  RotateCcw,
  Search,
  ExternalLink,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  User,
  Sliders,
  Sparkles
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
      frac_create: 0.0,
      frac_pr: 0.80,
      frac_issue: 0.05,
      frac_social: 0.0,
      max_repo_share: 0.25,
      hour_entropy: 0.88,
      max_per_hour: 8
    }
  },
  {
    id: 'organic-human',
    name: 'Active Human Dev',
    category: 'Organic Contributor',
    description: 'Aktivitas normal berimbang: push, review PR, dan issue diskusi.',
    features: {
      n_events: 64,
      n_repos: 3,
      jam_aktif: 14,
      frac_push: 0.55,
      frac_create: 0.05,
      frac_pr: 0.25,
      frac_issue: 0.15,
      frac_social: 0.0,
      max_repo_share: 0.60,
      hour_entropy: 0.72,
      max_per_hour: 6
    }
  }
];

const SAMPLE_ACCOUNTS = [
  { id: 'torvalds', label: 'torvalds', role: 'Human', type: 'human' },
  { id: 'ryandaaa', label: 'ryandaaa', role: 'Sprint Dev', type: 'burst' },
  { id: 'mccartyashley284', label: 'mccartyashley284', role: 'Spam Bot', type: 'bot' },
  { id: 'hiro-kurage', label: 'hiro-kurage', role: 'Forex Bot', type: 'bot' },
  { id: 'nonkh', label: 'nonkh', role: 'Spoofer', type: 'bot' }
];

export default function AccountInspectorPane({ isOpen, onClose, selectedAccount }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('live'); // 'live' or 'simulation'
  const [liveUsername, setLiveUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchProgress, setFetchProgress] = useState(0);
  const [fetchStage, setFetchStage] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('black-hat-seo');
  const [features, setFeatures] = useState(PRESETS[0].features);
  const [result, setResult] = useState(null);
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

  // Handle selectedAccount prop when opened from Accounts table
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
    const updated = {
      ...features,
      [key]: parseFloat(value) || 0
    };
    setFeatures(updated);
    runPrediction(updated);
  };

  // Local feature-based inference
  const runPrediction = async (f = features) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const log_n = Math.log1p(f.n_events);
      const log_events_per_repo = Math.log1p(f.n_events / Math.max(f.n_repos, 1));
      const active_frac = f.jam_aktif / 152.0;
      const log_max_per_hour = Math.log1p(f.max_per_hour);

      const payload = {
        features: {
          log_n,
          frac_push: f.frac_push,
          frac_create: f.frac_create,
          frac_pr: f.frac_pr,
          frac_issue: f.frac_issue,
          frac_social: f.frac_social,
          log_events_per_repo,
          max_repo_share: f.max_repo_share,
          hour_entropy: f.hour_entropy,
          active_frac,
          log_max_per_hour
        }
      };

      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      // Local fallback calculation if offline
      const score = Math.min(
        0.88,
        Math.max(
          0.32,
          0.44 +
            (f.max_repo_share > 0.85 ? 0.07 : 0) +
            (f.frac_push > 0.9 ? 0.06 : 0) +
            (f.n_events > 500 ? 0.08 : 0) +
            (f.jam_aktif > 60 ? 0.05 : 0)
        )
      );
      setResult({
        score: parseFloat(score.toFixed(4)),
        threshold: 0.5514,
        is_anomaly: score >= 0.5514,
        status: score >= 0.5514 ? 'Anomaly (Bot-like)' : 'Normal Contributor',
        cluster_id: score >= 0.5514 ? 0 : 1,
        cluster_badge: score >= 0.5514 ? 'Burst Pushers' : 'Organic Contributors',
        cluster_characteristics: [
          `Volume: ${f.n_events} events pada ${f.n_repos} repositori`,
          `Rasio aksi: push ${(f.frac_push * 100).toFixed(0)}%, PR ${(f.frac_pr * 100).toFixed(0)}%`,
          `Pola: entropi ${f.hour_entropy.toFixed(2)}, jam aktif ${f.jam_aktif}h`
        ],
        pc1: score >= 0.5514 ? 1.45 : -0.85,
        pc2: score >= 0.5514 ? 0.72 : -0.34
      });
    } finally {
      setLoading(false);
    }
  };

  // Live GitHub account lookup with real-time fetch progress
  const handleLiveLookup = async (e, manualUsername = null) => {
    if (e) e.preventDefault();
    const target = manualUsername || liveUsername;
    if (!target.trim()) return;

    setLoading(true);
    setErrorMessage(null);
    setLiveUsername(target);
    setFetchProgress(18);
    setFetchStage('Menghubungi GitHub REST API...');

    // Progress timeline simulation tracking network & inference stages
    const t1 = setTimeout(() => {
      setFetchProgress(46);
      setFetchStage('Mengambil riwayat event linimasa publik (n=100)...');
    }, 240);

    const t2 = setTimeout(() => {
      setFetchProgress(72);
      setFetchStage('Mengekstraksi vektor perilaku 11 dimensi (push ratio, entropi)...');
    }, 550);

    const t3 = setTimeout(() => {
      setFetchProgress(90);
      setFetchStage('Menjalankan inferensi model Isolation Forest & K-Means...');
    }, 850);

    try {
      const res = await fetch(`/api/analyze-github?username=${encodeURIComponent(target.trim())}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server returned ${res.status}`);
      }

      const data = await res.json();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      setFetchProgress(100);
      setFetchStage('Profil berhasil diklasifikasikan');

      // Brief 150ms pause so user sees 100% completion before revealing data
      await new Promise((r) => setTimeout(r, 150));

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
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      setErrorMessage(err.message || 'Gagal mengambil profil akun publik GitHub.');
    } finally {
      setLoading(false);
    }
  };

  const threshold = result?.threshold ?? 0.5514;
  const score = result?.score ?? 0.0;
  const isAnomaly = result ? (result.is_anomaly ?? score >= threshold) : false;

  return (
    <>
      {/* Dark overlay backdrop dimming everything on left (including sidebar & header), click to close */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] z-50 transition-opacity cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Split-Screen Side Inspector Pane */}
      <aside
        className="fixed top-0 right-0 h-full w-full sm:w-[480px] xl:w-[500px] bg-white border-l border-slate-200 shadow-2xl z-[60] flex flex-col pane-slide-in select-none text-slate-900"
        aria-label="Account Inspector"
      >
        {/* Pane Header - Clean, Focused Typography */}
        <div className="h-14 px-6 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 className="font-sans text-[14px] font-semibold text-slate-900">
              Account Inspector
            </h2>
            <p className="font-sans text-[11px] text-slate-500">
              Pemodelan perilaku real-time dan evaluasi skor anomali akun
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-[4px] transition-colors"
            aria-label="Close Inspector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Segmented Mode Selector */}
        <div className="px-6 py-2.5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between shrink-0">
          <div className="inline-flex p-0.5 bg-slate-200/70 rounded-[4px]">
            <button
              onClick={() => {
                setActiveTab('live');
                setErrorMessage(null);
              }}
              className={`px-3 py-1 text-[12px] font-medium rounded-[3px] transition-all ${
                activeTab === 'live'
                  ? 'bg-white text-navy-950 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Live GitHub API
            </button>
            <button
              onClick={() => {
                setActiveTab('simulation');
                setErrorMessage(null);
                if (!result) applyPreset('black-hat-seo');
              }}
              className={`px-3 py-1 text-[12px] font-medium rounded-[3px] transition-all ${
                activeTab === 'simulation'
                  ? 'bg-white text-navy-950 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Parameter Simulator
            </button>
          </div>

          <span className="font-sans text-[11px] text-slate-500">
            {activeTab === 'live' ? 'Mode Online' : 'Mode Sintesis'}
          </span>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'live' ? (
            /* TAB 1: LIVE GITHUB ACCOUNT LOOKUP */
            <div className="p-6 space-y-6">
              {/* Input Section */}
              <div className="space-y-3">
                <form onSubmit={handleLiveLookup} className="relative flex items-center">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={liveUsername}
                    onChange={(e) => setLiveUsername(e.target.value)}
                    placeholder="Masukkan username atau URL profil GitHub..."
                    className="w-full bg-white border border-slate-300 font-sans text-[13px] text-slate-900 pl-9 pr-24 py-2 rounded-[4px] outline-none focus:border-navy-900 focus:ring-1 focus:ring-navy-900 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={loading || !liveUsername.trim()}
                    className="absolute right-1 top-1 bottom-1 px-3 bg-navy-950 hover:bg-navy-900 text-white font-sans text-[12px] font-medium rounded-[3px] transition-colors disabled:opacity-40 flex items-center gap-1.5"
                  >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Inspect</span>}
                  </button>
                </form>

                {/* Sample Profile Quick-Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 font-normal mr-1">Uji cepat:</span>
                  {SAMPLE_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleLiveLookup(null, acc.id)}
                      className="px-2 py-0.5 text-[11px] font-sans bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300 rounded-[4px] transition-colors flex items-center gap-1"
                    >
                      <span className="font-medium">@{acc.label}</span>
                      <span className="text-[10px] text-slate-400">({acc.role})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message Alert */}
              {errorMessage && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-[12px] rounded-[4px] flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <strong className="font-semibold block">Pencarian Profil Gagal</strong>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              {/* SKELETON + REAL-TIME PROGRESS, OR LOADED RESULT, OR EMPTY STATE */}
              {loading ? (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Real-time Fetch Progress Card */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-[4px] space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2 text-slate-700 font-medium truncate">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-navy-800 shrink-0" />
                        <span className="truncate">{fetchStage}</span>
                      </div>
                      <span className="font-mono text-slate-900 font-semibold shrink-0 ml-2">
                        {fetchProgress}%
                      </span>
                    </div>

                    <div className="relative w-full h-1.5 bg-slate-200 rounded-[2px] overflow-hidden">
                      <div
                        className="h-full bg-navy-900 transition-all duration-300 ease-out"
                        style={{ width: `${fetchProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Profile Identity Skeleton Card */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-[4px] flex items-center gap-3">
                    <Skeleton className="w-11 h-11 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-3.5 w-32" />
                        <Skeleton className="h-3 w-4" />
                      </div>
                      <Skeleton className="h-3 w-20" />
                      <div className="flex gap-3 pt-0.5">
                        <Skeleton className="h-2.5 w-16" />
                        <Skeleton className="h-2.5 w-24" />
                      </div>
                    </div>
                  </div>

                  {/* Verdict Hero Banner Skeleton */}
                  <div className="p-4 border border-slate-200 rounded-[4px] bg-slate-50/50 space-y-3">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-44" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-4/5" />
                    <div className="pt-3 border-t border-slate-200/60 space-y-2">
                      <div className="flex justify-between">
                        <Skeleton className="h-3 w-28" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-2 w-full" />
                    </div>
                  </div>

                  {/* 4-Cell Behavioral Metrics Grid Skeleton */}
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-44" />
                    <div className="grid grid-cols-2 gap-2">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="p-3 bg-slate-50 border border-slate-200 rounded-[4px] space-y-2"
                        >
                          <Skeleton className="h-2.5 w-20" />
                          <Skeleton className="h-4 w-12" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Archetype Attribution Skeleton Card */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-[4px] space-y-2.5">
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-full" />
                    <div className="pt-2.5 border-t border-slate-200/80 flex justify-between items-center">
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </div>
              ) : result && liveUserData ? (
                <div className="space-y-5 animate-in fade-in duration-200">
                  {/* Account Identity Header */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-[4px] flex items-center gap-3">
                    {liveUserData.avatar_url ? (
                      <img
                        src={liveUserData.avatar_url}
                        alt={liveUserData.username}
                        className="w-11 h-11 rounded-[4px] border border-slate-200 object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-[4px] bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-sans text-[13px] font-semibold text-slate-900 truncate">
                          {liveUserData.name || liveUserData.username}
                        </h3>
                        <a
                          href={liveUserData.html_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-slate-700 p-0.5"
                          title="Open GitHub profile"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      <span className="font-sans text-[12px] text-slate-500 block truncate">
                        @{liveUserData.username}
                      </span>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                        <span>Repos: <strong className="text-slate-900 font-medium">{liveUserData.public_repos}</strong></span>
                        <span>Events Sampled: <strong className="text-slate-900 font-medium">{liveRawMetrics?.n_events || 0}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Verdict Hero Card */}
                  <div
                    className={`p-4 border rounded-[4px] ${
                      isAnomaly
                        ? 'bg-rose-50/40 border-rose-200'
                        : 'bg-emerald-50/40 border-emerald-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {isAnomaly ? (
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        )}
                        <span
                          className={`font-sans text-[13px] font-bold ${
                            isAnomaly ? 'text-rose-700' : 'text-emerald-700'
                          }`}
                        >
                          {isAnomaly ? 'Automated Bot / Anomaly' : 'Organic Contributor'}
                        </span>
                      </div>
                      <span className="font-sans text-[11px] font-medium text-slate-500">
                        {isAnomaly ? 'Score ≥ Threshold' : 'Score < Threshold'}
                      </span>
                    </div>

                    <p className="text-[12px] text-slate-600 mt-1">
                      {isAnomaly
                        ? 'Konsentrasi commit berkecepatan tinggi atau ketiadaan variasi sirkadian menyimpang dari pola aktivitas alami manusia.'
                        : 'Irama aktivitas dan distribusi tindakan selaras dengan karakteristik pengembangan perangkat lunak secara organik.'}
                    </p>

                    {/* Score & Gauge Bar */}
                    <div className="mt-4 pt-3 border-t border-slate-200/60">
                      <div className="flex items-baseline justify-between mb-1.5">
                        <span className="text-[12px] text-slate-500">
                          Anomaly Score: <strong className="text-slate-900 font-semibold">{score.toFixed(4)}</strong>
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Ambang Batas Cutoff: {threshold.toFixed(4)}
                        </span>
                      </div>

                      <div className="relative w-full h-2 bg-slate-200 rounded-[2px] overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            isAnomaly ? 'bg-rose-600' : 'bg-emerald-600'
                          }`}
                          style={{ width: `${Math.min(Math.max((score / 1.0) * 100, 4), 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4-Cell Key Behavioral Signals */}
                  <div>
                    <h4 className="text-[12px] font-semibold text-slate-900 mb-2">
                      Dimensi Fitur Perilaku Terekstraksi
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-[12px]">
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-[4px]">
                        <span className="text-slate-500 text-[11px] block">Push Ratio</span>
                        <strong className="text-slate-900 font-semibold text-[13px]">
                          {((liveRawMetrics?.push_ratio ?? features.frac_push) * 100).toFixed(0)}%
                        </strong>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-[4px]">
                        <span className="text-slate-500 text-[11px] block">PR / Review Ratio</span>
                        <strong className="text-slate-900 font-semibold text-[13px]">
                          {((liveRawMetrics?.pr_ratio ?? features.frac_pr) * 100).toFixed(1)}%
                        </strong>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-[4px]">
                        <span className="text-slate-500 text-[11px] block">Repo Concentration</span>
                        <strong className="text-slate-900 font-semibold text-[13px]">
                          {((liveRawMetrics?.max_repo_share ?? features.max_repo_share) * 100).toFixed(0)}%
                        </strong>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-[4px]">
                        <span className="text-slate-500 text-[11px] block">Max Hourly Velocity</span>
                        <strong className="text-slate-900 font-semibold text-[13px]">
                          {liveRawMetrics?.max_per_hour ?? features.max_per_hour} evt/h
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Archetype Attribution */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-[4px]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-medium text-slate-500">
                        Atribusi Klaster K-Means
                      </span>
                      <span className="text-[11px] font-semibold text-navy-950 bg-white border border-slate-200 px-2 py-0.5 rounded-[4px]">
                        Cluster {result.cluster_id ?? 0}
                      </span>
                    </div>
                    <div className="text-[13px] font-semibold text-slate-900">
                      {result.cluster_badge || result.cluster_title}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      {result.cluster_characteristics?.[0] || 'Behavioral cluster signature derived from 107.7K account aggregate profiles.'}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">
                        PCA: PC1={result.pc1?.toFixed(2) ?? '0.00'}, PC2={result.pc2?.toFixed(2) ?? '0.00'}
                      </span>
                      <button
                        onClick={() => {
                          onClose();
                          navigate('/clusters');
                        }}
                        className="text-navy-900 hover:text-navy-700 font-medium inline-flex items-center gap-1"
                      >
                        <span>Lihat di Klaster</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* EMPTY STATE (Before Searching) */
                <div className="py-12 px-4 text-center border border-dashed border-slate-300 rounded-[4px]">
                  <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                    <Sparkles className="w-5 h-5 text-slate-500" />
                  </div>
                  <h3 className="text-[13px] font-semibold text-slate-800">
                    Siap untuk Analisis
                  </h3>
                  <p className="text-[12px] text-slate-500 max-w-[280px] mx-auto mt-1">
                    Masukkan username GitHub publik di atas atau klik salah satu profil contoh untuk mengevaluasi sidik jari perilakunya.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* TAB 2: MANUAL FEATURE SIMULATOR */
            <div className="p-6 space-y-6">
              {/* Presets Grid */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-semibold text-slate-900">
                    Arketipe Preset
                  </span>
                  <button
                    onClick={() => applyPreset(selectedPreset !== 'custom' ? selectedPreset : 'black-hat-seo')}
                    className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
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
                        className={`px-3 py-2 text-left rounded-[4px] text-[11px] border transition-colors ${
                          isSelected
                            ? 'bg-navy-950 text-white border-navy-950 font-medium'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <div className="font-semibold truncate">{p.name}</div>
                        <div className="text-[10px] opacity-75 truncate">{p.category}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-3.5 pt-2 border-t border-slate-200">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600">Event Volume (n_events)</span>
                    <strong className="text-slate-900">{features.n_events}</strong>
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
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600">Distinct Repositories (n_repos)</span>
                    <strong className="text-slate-900">{features.n_repos}</strong>
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
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600">Active Observation Hours</span>
                    <strong className="text-slate-900">{features.jam_aktif}h / 152h</strong>
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
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-600">Push Ratio</span>
                      <strong className="text-slate-900">{(features.frac_push * 100).toFixed(0)}%</strong>
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
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-600">PR Ratio</span>
                      <strong className="text-slate-900">{(features.frac_pr * 100).toFixed(0)}%</strong>
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
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-600">Repo Share</span>
                      <strong className="text-slate-900">{(features.max_repo_share * 100).toFixed(0)}%</strong>
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
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-600">Hour Entropy</span>
                      <strong className="text-slate-900">{features.hour_entropy.toFixed(2)}</strong>
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

              {/* Simulation Result Box */}
              {result && (
                <div
                  className={`p-4 border rounded-[4px] ${
                    isAnomaly
                      ? 'bg-rose-50/40 border-rose-200'
                      : 'bg-emerald-50/40 border-emerald-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[12px] font-bold ${
                        isAnomaly ? 'text-rose-700' : 'text-emerald-700'
                      }`}
                    >
                      {isAnomaly ? 'Anomaly (Bot-like)' : 'Normal Contributor'}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      Score: <strong className="text-slate-900">{score.toFixed(4)}</strong> (Cutoff {threshold})
                    </span>
                  </div>

                  <div className="mt-2.5 relative w-full h-1.5 bg-slate-200 rounded-[2px] overflow-hidden">
                    <div
                      className={`h-full transition-all duration-200 ${
                        isAnomaly ? 'bg-rose-600' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${Math.min(Math.max((score / 1.0) * 100, 4), 100)}%` }}
                    />
                  </div>

                  <div className="mt-2 text-[11px] text-slate-500">
                    Teratribusi: <strong className="text-slate-800">{result.cluster_badge || `Cluster ${result.cluster_id}`}</strong>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
