import React, { useState, useEffect } from 'react';
import {
  Layers,
  ChevronDown,
  Check,
  TrendingUp,
  AlertTriangle,
  Activity,
  GitPullRequest,
  GitCommit,
  GitFork,
  Clock,
  Sparkles
} from 'lucide-react';

const FALLBACK_CLUSTERS = {
  '0': {
    cluster_id: 0,
    title: 'Cluster 0',
    badge: 'Heavy Pushers (Burst)',
    color: '#2563eb',
    accounts: '954',
    accountsPct: '(6.3%)',
    anomalyRate: '12.7%',
    score: 'μ 0.482',
    events: '48',
    repos: '1',
    characteristics: [
      'Aktivitas: median 48 event (103.8 rerata) pada 1 repositori tunggal',
      'Dominasi aksi: push 94.5%, PR 0.5%, issue 0.1%, sosial 0.0%',
      'Pola kerja: entropi jam 0.29, fraksi jam aktif 7.3% (burst spike)',
      'Deteksi anomali: 12.7% ditandai anomali (skor rata-rata μ 0.482)'
    ],
    fitur_mean: {
      frac_push: 0.9446,
      frac_pr: 0.0046,
      frac_issue: 0.0012,
      frac_create: 0.0495,
      frac_social: 0.0001,
      max_repo_share: 0.7645,
      hour_entropy: 0.2895,
      active_frac: 0.0728
    }
  },
  '1': {
    cluster_id: 1,
    title: 'Cluster 1',
    badge: 'Heavy Pushers (Normal)',
    color: '#64748b',
    accounts: '6,008',
    accountsPct: '(39.5%)',
    anomalyRate: '0.0%',
    score: 'μ 0.375',
    events: '29',
    repos: '1',
    characteristics: [
      'Aktivitas: median 29 event (34.1 rerata) pada 1 repositori',
      'Dominasi aksi: push 94.4%, PR 1.2%, issue 0.6%, sosial 0.0%',
      'Pola kerja: entropi jam 0.75, fraksi jam aktif 25.7% (organik)',
      'Deteksi anomali: 0.0% ditandai anomali (skor rata-rata μ 0.375 baseline)'
    ],
    fitur_mean: {
      frac_push: 0.9441,
      frac_pr: 0.0116,
      frac_issue: 0.0057,
      frac_create: 0.0386,
      frac_social: 0.0,
      max_repo_share: 0.938,
      hour_entropy: 0.7471,
      active_frac: 0.2574
    }
  },
  '2': {
    cluster_id: 2,
    title: 'Cluster 2',
    badge: 'Heavy Pushers (Multi-repo)',
    color: '#0f172a',
    accounts: '2,739',
    accountsPct: '(18.0%)',
    anomalyRate: '3.5%',
    score: 'μ 0.446',
    events: '31',
    repos: '8',
    characteristics: [
      'Aktivitas: median 31 event (43.6 rerata) terdistribusi pada 8 repositori',
      'Dominasi aksi: push 74.1%, PR 5.5%, issue 2.5%, create 17.9%',
      'Pola kerja: entropi jam 0.73, fraksi jam aktif 26.8%',
      'Deteksi anomali: 3.5% ditandai anomali (skor rata-rata μ 0.446)'
    ],
    fitur_mean: {
      frac_push: 0.7408,
      frac_pr: 0.0549,
      frac_issue: 0.025,
      frac_create: 0.1792,
      frac_social: 0.0001,
      max_repo_share: 0.3589,
      hour_entropy: 0.7327,
      active_frac: 0.2681
    }
  },
  '3': {
    cluster_id: 3,
    title: 'Cluster 3',
    badge: 'Automated CI / Bots',
    color: '#dc2626',
    accounts: '534',
    accountsPct: '(3.5%)',
    anomalyRate: '42.9%',
    score: 'μ 0.548',
    events: '32',
    repos: '2',
    characteristics: [
      'Aktivitas: median 32 event (95.1 rerata) pada 2 repositori',
      'Dominasi aksi: push 26.5%, PR 22.1%, issue 40.5% (otomasi tooling)',
      'Pola kerja: entropi jam 0.78, fraksi jam aktif 33.3%',
      'Deteksi anomali: 42.9% ditandai anomali tinggi (skor rata-rata μ 0.548)'
    ],
    fitur_mean: {
      frac_push: 0.2648,
      frac_pr: 0.2211,
      frac_issue: 0.4051,
      frac_create: 0.1089,
      frac_social: 0.0001,
      max_repo_share: 0.7057,
      hour_entropy: 0.7763,
      active_frac: 0.3329
    }
  },
  '4': {
    cluster_id: 4,
    title: 'Cluster 4',
    badge: 'Automated CI / Social Bot',
    color: '#d97706',
    accounts: '58',
    accountsPct: '(0.4%)',
    anomalyRate: '46.6%',
    score: 'μ 0.548',
    events: '28',
    repos: '6',
    characteristics: [
      'Aktivitas: median 28 event (45.5 rerata) pada 6 repositori',
      'Dominasi aksi: push 66.2%, PR 4.8%, issue 4.7%, sosial 5.4% (Fork/Star bot)',
      'Pola kerja: entropi jam 0.69, fraksi jam aktif 23.1%',
      'Deteksi anomali: 46.6% anomali tinggi (skor rata-rata μ 0.548)'
    ],
    fitur_mean: {
      frac_push: 0.6624,
      frac_pr: 0.0475,
      frac_issue: 0.0465,
      frac_create: 0.1894,
      frac_social: 0.0542,
      max_repo_share: 0.4645,
      hour_entropy: 0.6863,
      active_frac: 0.2307
    }
  },
  '5': {
    cluster_id: 5,
    title: 'Cluster 5',
    badge: 'Heavy Pushers (Create & Branch)',
    color: '#7c3aed',
    accounts: '2,984',
    accountsPct: '(19.6%)',
    anomalyRate: '4.1%',
    score: 'μ 0.436',
    events: '29',
    repos: '2',
    characteristics: [
      'Aktivitas: median 29 event (35.8 rerata) pada 2 repositori',
      'Dominasi aksi: push 53.7%, PR 11.2%, issue 4.8%, create 30.3%',
      'Pola kerja: entropi jam 0.76, fraksi jam aktif 27.2%',
      'Deteksi anomali: 4.1% ditandai anomali (skor rata-rata μ 0.436)'
    ],
    fitur_mean: {
      frac_push: 0.5366,
      frac_pr: 0.1122,
      frac_issue: 0.048,
      frac_create: 0.3031,
      frac_social: 0.0001,
      max_repo_share: 0.8757,
      hour_entropy: 0.7605,
      active_frac: 0.2715
    }
  },
  '6': {
    cluster_id: 6,
    title: 'Cluster 6',
    badge: 'High Volume 24/7 Pushers',
    color: '#059669',
    accounts: '1,936',
    accountsPct: '(12.7%)',
    anomalyRate: '8.5%',
    score: 'μ 0.454',
    events: '134',
    repos: '1',
    characteristics: [
      'Aktivitas: median 134 event (646.2 rerata) pada 1 repositori personal',
      'Dominasi aksi: push 93.5%, PR 1.3%, issue 0.9%, sosial 0.0%',
      'Pola kerja: entropi jam 0.93, fraksi jam aktif 69.9% (hampir non-stop)',
      'Deteksi anomali: 8.5% anomali (skor rata-rata μ 0.454)'
    ],
    fitur_mean: {
      frac_push: 0.935,
      frac_pr: 0.0135,
      frac_issue: 0.0088,
      frac_create: 0.0426,
      frac_social: 0.0,
      max_repo_share: 0.9005,
      hour_entropy: 0.9295,
      active_frac: 0.6987
    }
  }
};

export default function Clusters() {
  const [clusters, setClusters] = useState(FALLBACK_CLUSTERS);
  const [activeClusterId, setActiveClusterId] = useState('2');
  const [selectedBlock, setSelectedBlock] = useState('A');

  useEffect(() => {
    // Attempt fetch from /api/clusters
    fetch('/api/clusters')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Not ok');
      })
      .then((data) => {
        if (data && typeof data === 'object') {
          // Merge with fallback to keep colors and formatting
          const merged = { ...FALLBACK_CLUSTERS };
          Object.keys(data).forEach((k) => {
            if (merged[k]) {
              merged[k] = { ...merged[k], ...data[k] };
            }
          });
          setClusters(merged);
        }
      })
      .catch((err) => {
        console.log('Using robust embedded cluster profiles:', err);
      });
  }, []);

  const activeCluster = clusters[activeClusterId] || clusters['2'];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-8 md:px-8 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-semibold">
            Cluster Explorer
          </h1>
          <p className="font-body-md text-body-md text-secondary mt-1">
            Explore 7 behavioral clusters derived from K-Means feature space with detailed archetypes and PCA coordinates.
          </p>
        </div>

        {/* Control Selectors */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Block Selector */}
          <div className="inline-flex items-center bg-surface-container-lowest border border-border-subtle rounded-lg px-3 py-1.5 shadow-2xs">
            <span className="text-secondary text-xs mr-2">Block:</span>
            <button
              onClick={() => setSelectedBlock('A')}
              className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
                selectedBlock === 'A' ? 'bg-primary text-on-primary' : 'text-secondary hover:text-on-surface'
              }`}
            >
              Block A
            </button>
            <button
              onClick={() => setSelectedBlock('B')}
              className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ml-1 ${
                selectedBlock === 'B' ? 'bg-primary text-on-primary' : 'text-secondary hover:text-on-surface'
              }`}
            >
              Block B
            </button>
          </div>
        </div>
      </div>

      {/* Main Analytics Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: PCA Projection & Cluster Cards (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* PCA Projection Scatter Plot Card */}
          <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-border-subtle">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-4">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight font-semibold">
                  PCA Projection (PC1 vs PC2)
                </h2>
                <p className="font-body-sm text-body-sm text-secondary">
                  2D behavioral representation of accounts via Principal Component Analysis
                </p>
              </div>
              <div className="flex items-center gap-2 text-secondary font-code-sm text-code-sm">
                <span>Variance explained:</span>
                <span className="text-on-surface font-semibold">68.4%</span>
              </div>
            </div>

            {/* SVG Scatter Plot Container */}
            <div className="relative w-full aspect-[16/10] bg-surface-muted/60 rounded-lg p-2 overflow-hidden flex items-center justify-center border border-border-subtle">
              <svg className="w-full h-full select-none" fill="none" viewBox="0 0 640 400">
                <defs>
                  <pattern id="grid-pattern-pca" width="60" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="0.75" strokeDasharray="2 3" />
                  </pattern>
                </defs>

                {/* Plot Grid & Zero Reference Lines */}
                <rect x="50" y="20" width="540" height="340" fill="url(#grid-pattern-pca)" />
                <line x1="50" y1="190" x2="590" y2="190" stroke="#d1d5db" strokeWidth="1.25" />
                <line x1="320" y1="20" x2="320" y2="360" stroke="#d1d5db" strokeWidth="1.25" />

                {/* Y-Axis Ticks & Labels */}
                <g className="text-secondary font-label-sm text-[10px] fill-current" textAnchor="end">
                  <text x="42" y="26">+4</text>
                  <text x="42" y="110">+2</text>
                  <text x="42" y="194">0</text>
                  <text x="42" y="278">-2</text>
                  <text x="42" y="362">-4</text>
                </g>
                <text
                  x="20"
                  y="190"
                  transform="rotate(-90 20 190)"
                  textAnchor="middle"
                  className="font-label-md text-xs font-semibold fill-secondary"
                >
                  PC2
                </text>

                {/* X-Axis Ticks & Labels */}
                <g className="text-secondary font-label-sm text-[10px] fill-current" textAnchor="middle">
                  <text x="50" y="380">-4</text>
                  <text x="185" y="380">-2</text>
                  <text x="320" y="380">0</text>
                  <text x="455" y="380">+2</text>
                  <text x="590" y="380">+4</text>
                </g>
                <text x="320" y="396" textAnchor="middle" className="font-label-md text-xs font-semibold fill-secondary">
                  PC1
                </text>

                {/* Point Clouds (Representing Clusters with dynamic opacity) */}
                {/* Cluster 0 (Burst Pushers - Blue) */}
                <g opacity={activeClusterId === '0' ? 1.0 : 0.4} className="transition-opacity">
                  <circle cx="310" cy="270" r={activeClusterId === '0' ? 4 : 2.5} fill="#2563eb" />
                  <circle cx="325" cy="262" r={activeClusterId === '0' ? 4 : 2.5} fill="#2563eb" />
                  <circle cx="340" cy="275" r={activeClusterId === '0' ? 4 : 2.5} fill="#2563eb" />
                  <circle cx="305" cy="285" r={activeClusterId === '0' ? 4 : 2.5} fill="#2563eb" />
                </g>

                {/* Cluster 1 (Normal Heavy Pushers - Slate) */}
                <g opacity={activeClusterId === '1' ? 1.0 : 0.4} className="transition-opacity">
                  <circle cx="190" cy="210" r={activeClusterId === '1' ? 4 : 2.5} fill="#64748b" />
                  <circle cx="175" cy="195" r={activeClusterId === '1' ? 4 : 2.5} fill="#64748b" />
                  <circle cx="205" cy="225" r={activeClusterId === '1' ? 4 : 2.5} fill="#64748b" />
                  <circle cx="182" cy="230" r={activeClusterId === '1' ? 4 : 2.5} fill="#64748b" />
                </g>

                {/* Cluster 2 (Multi-repo - Dark Slate) */}
                <g opacity={activeClusterId === '2' ? 1.0 : 0.4} className="transition-opacity">
                  <circle cx="440" cy="140" r={activeClusterId === '2' ? 4 : 2.5} fill="#0f172a" />
                  <circle cx="460" cy="155" r={activeClusterId === '2' ? 4 : 2.5} fill="#0f172a" />
                  <circle cx="425" cy="130" r={activeClusterId === '2' ? 4 : 2.5} fill="#0f172a" />
                  <circle cx="450" cy="170" r={activeClusterId === '2' ? 4 : 2.5} fill="#0f172a" />
                </g>

                {/* Cluster 3 (Automated CI - Red Anomaly) */}
                <g opacity={activeClusterId === '3' ? 1.0 : 0.4} className="transition-opacity">
                  <circle cx="120" cy="80" r={activeClusterId === '3' ? 5 : 3.5} fill="#dc2626" />
                  <circle cx="140" cy="95" r={activeClusterId === '3' ? 5 : 3.5} fill="#dc2626" />
                  <circle cx="110" cy="110" r={activeClusterId === '3' ? 5 : 3.5} fill="#dc2626" />
                </g>

                {/* Cluster 4 (Social CI - Amber) */}
                <g opacity={activeClusterId === '4' ? 1.0 : 0.4} className="transition-opacity">
                  <circle cx="150" cy="150" r={activeClusterId === '4' ? 4 : 2.5} fill="#d97706" />
                  <circle cx="165" cy="165" r={activeClusterId === '4' ? 4 : 2.5} fill="#d97706" />
                </g>

                {/* Cluster 5 (Push & Create - Purple) */}
                <g opacity={activeClusterId === '5' ? 1.0 : 0.4} className="transition-opacity">
                  <circle cx="360" cy="110" r={activeClusterId === '5' ? 4 : 2.5} fill="#7c3aed" />
                  <circle cx="380" cy="125" r={activeClusterId === '5' ? 4 : 2.5} fill="#7c3aed" />
                </g>

                {/* Cluster 6 (24/7 Continuous - Emerald) */}
                <g opacity={activeClusterId === '6' ? 1.0 : 0.4} className="transition-opacity">
                  <circle cx="480" cy="240" r={activeClusterId === '6' ? 4 : 2.5} fill="#059669" />
                  <circle cx="505" cy="260" r={activeClusterId === '6' ? 4 : 2.5} fill="#059669" />
                  <circle cx="465" cy="250" r={activeClusterId === '6' ? 4 : 2.5} fill="#059669" />
                </g>
              </svg>
            </div>
          </section>

          {/* 7 Cluster Selection Cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Select Cluster (7 Archetypes)
              </h2>
              <span className="text-xs text-secondary font-code-sm">
                Click a card to inspect behavioral profile
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.keys(clusters).map((key) => {
                const cl = clusters[key];
                const isSelected = activeClusterId === String(cl.cluster_id);
                return (
                  <button
                    key={cl.cluster_id}
                    onClick={() => setActiveClusterId(String(cl.cluster_id))}
                    type="button"
                    className={`p-4 rounded-xl text-left border transition-all relative ${
                      isSelected
                        ? 'bg-surface-container-lowest border-primary shadow-md ring-2 ring-primary/20'
                        : 'bg-surface-container-lowest/80 hover:bg-surface-hover border-border-subtle hover:border-border-strong shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: cl.color }}
                        />
                        <span className="font-headline-sm text-sm font-semibold text-on-surface">
                          {cl.title}
                        </span>
                      </div>
                      <span className="font-code-sm text-code-sm font-semibold px-2 py-0.5 rounded bg-surface-container text-on-surface">
                        {cl.accounts} acc {cl.accountsPct}
                      </span>
                    </div>

                    <div className="text-xs text-secondary mb-2 truncate font-medium">
                      {cl.badge}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-border-subtle/60">
                      <span className="text-secondary">
                        Anomaly: <span className="font-semibold text-rose-600">{cl.anomalyRate}</span>
                      </span>
                      <span className="font-code-sm text-secondary font-medium">
                        {cl.score}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Cluster Inspector (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-border-subtle sticky top-24 flex flex-col gap-5">
          {/* Header of selected cluster */}
          <div className="flex items-start justify-between pb-4 border-b border-border-subtle">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: activeCluster.color }}
                />
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
                  {activeCluster.title}
                </h3>
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-container text-on-surface">
                {activeCluster.badge}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-secondary block font-code-sm uppercase">Total Accounts</span>
              <span className="font-metric-display text-2xl font-bold text-on-surface">
                {activeCluster.accounts}
              </span>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-surface-muted/60 p-3 rounded-xl border border-border-subtle text-center">
              <span className="text-[11px] text-secondary font-code-sm uppercase block">
                Anomaly Rate
              </span>
              <span className="font-code-md text-base font-bold text-rose-600">
                {activeCluster.anomalyRate}
              </span>
            </div>
            <div className="bg-surface-muted/60 p-3 rounded-xl border border-border-subtle text-center">
              <span className="text-[11px] text-secondary font-code-sm uppercase block">
                Mean Score
              </span>
              <span className="font-code-md text-base font-bold text-on-surface">
                {activeCluster.score}
              </span>
            </div>
            <div className="bg-surface-muted/60 p-3 rounded-xl border border-border-subtle text-center">
              <span className="text-[11px] text-secondary font-code-sm uppercase block">
                Median Events
              </span>
              <span className="font-code-md text-base font-bold text-on-surface">
                {activeCluster.events}
              </span>
            </div>
          </div>

          {/* Behavioral Characteristics */}
          <div>
            <h4 className="font-label-md text-label-md text-secondary uppercase font-semibold tracking-wider mb-2">
              Behavioral Characteristics
            </h4>
            <ul className="space-y-2 bg-surface-bright p-3.5 rounded-xl border border-border-subtle">
              {activeCluster.characteristics.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-on-surface leading-relaxed">
                  <span className="text-accent-cluster-1 font-bold mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Comparative Feature Progress Bars */}
          {activeCluster.fitur_mean && (
            <div>
              <h4 className="font-label-md text-label-md text-secondary uppercase font-semibold tracking-wider mb-3">
                Feature Proportion Vectors (Mean)
              </h4>
              <div className="space-y-2.5">
                {/* Push */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-secondary font-medium">Push Event:</span>
                    <span className="font-code-sm font-semibold">
                      {(activeCluster.fitur_mean.frac_push * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${activeCluster.fitur_mean.frac_push * 100}%` }}
                    />
                  </div>
                </div>

                {/* PR */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-secondary font-medium">Pull Request Event:</span>
                    <span className="font-code-sm font-semibold">
                      {(activeCluster.fitur_mean.frac_pr * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent-cluster-1 rounded-full transition-all duration-300"
                      style={{ width: `${activeCluster.fitur_mean.frac_pr * 100}%` }}
                    />
                  </div>
                </div>

                {/* Issue */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-secondary font-medium">Issue Event:</span>
                    <span className="font-code-sm font-semibold">
                      {(activeCluster.fitur_mean.frac_issue * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent-cluster-2 rounded-full transition-all duration-300"
                      style={{ width: `${activeCluster.fitur_mean.frac_issue * 100}%` }}
                    />
                  </div>
                </div>

                {/* Repo Concentration */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-secondary font-medium">Max Repo Concentration:</span>
                    <span className="font-code-sm font-semibold">
                      {(activeCluster.fitur_mean.max_repo_share * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent-cluster-4 rounded-full transition-all duration-300"
                      style={{ width: `${activeCluster.fitur_mean.max_repo_share * 100}%` }}
                    />
                  </div>
                </div>

                {/* Hour Entropy */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-secondary font-medium">Normalized 24h Entropy:</span>
                    <span className="font-code-sm font-semibold">
                      {activeCluster.fitur_mean.hour_entropy.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                      style={{ width: `${activeCluster.fitur_mean.hour_entropy * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
