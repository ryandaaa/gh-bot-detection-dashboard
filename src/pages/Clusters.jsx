import React, { useState, useEffect } from 'react';

const FALLBACK_CLUSTERS = {
  '0': {
    cluster_id: 0,
    title: 'Cluster 0',
    badge: 'Burst Pushers (Stealth)',
    color: '#2563eb',
    accounts: '954',
    accountsPct: '6.3%',
    anomalyRate: '12.7%',
    score: '0.482',
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
    accountsPct: '39.5%',
    anomalyRate: '0.0%',
    score: '0.375',
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
    badge: 'Multi-Repo Pushers',
    color: '#0f172a',
    accounts: '2,739',
    accountsPct: '18.0%',
    anomalyRate: '3.5%',
    score: '0.446',
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
    accountsPct: '3.5%',
    anomalyRate: '42.9%',
    score: '0.548',
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
    badge: 'Tooling / Social Bots',
    color: '#d97706',
    accounts: '58',
    accountsPct: '0.4%',
    anomalyRate: '46.6%',
    score: '0.548',
    events: '28',
    repos: '6',
    characteristics: [
      'Aktivitas: median 28 event (45.5 rerata) pada 6 repositori',
      'Dominasi aksi: push 66.2%, PR 4.8%, issue 4.7%, sosial 5.4%',
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
    badge: 'Push & Create Archetype',
    color: '#7c3aed',
    accounts: '2,984',
    accountsPct: '19.6%',
    anomalyRate: '4.1%',
    score: '0.436',
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
    badge: '24/7 Continuous Pushers',
    color: '#059669',
    accounts: '1,936',
    accountsPct: '12.7%',
    anomalyRate: '8.5%',
    score: '0.454',
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
    fetch('/api/clusters')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Not ok');
      })
      .then((data) => {
        if (data && typeof data === 'object') {
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
        // Fallback embedded
      });
  }, []);

  const activeCluster = clusters[activeClusterId] || clusters['2'];

  return (
    <div className="w-full flex flex-col font-sans">
      {/* Editorial Header Bar - Full Bleed Edge-to-Edge */}
      <section className="px-6 py-5 border-b border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-navy-950 tracking-tight uppercase">
            Cluster Explorer
          </h1>
          <p className="text-[13px] text-slate-500 mt-0.5">
            Behavioral clustering archetypes derived from K-Means (k=7) over 11 standardized dimensions with 2D PCA projection.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex border border-slate-300 rounded overflow-hidden">
            <button
              onClick={() => setSelectedBlock('A')}
              className={`px-3 py-1 text-[12px] font-medium transition-colors ${
                selectedBlock === 'A' ? 'bg-navy-950 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              BLOCK A (T0-T76)
            </button>
            <button
              onClick={() => setSelectedBlock('B')}
              className={`px-3 py-1 text-[12px] font-medium transition-colors border-l border-slate-200 ${
                selectedBlock === 'B' ? 'bg-navy-950 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              BLOCK B (T76-T152)
            </button>
          </div>
        </div>
      </section>

      {/* Main Grid: Left PCA + Cluster Grid, Right Cluster Inspector */}
      <section className="w-full grid grid-cols-1 lg:grid-cols-12 border-b border-slate-200 bg-white divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* Left Column (7 cols): PCA Projection & Cluster Archetypes */}
        <div className="lg:col-span-7 flex flex-col divide-y divide-slate-200">
          {/* PCA Scatter Plot Section */}
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-4">
              <div>
                <h2 className="text-[14px] font-bold text-navy-950 uppercase tracking-wider">
                  PCA Projection (PC1 vs PC2)
                </h2>
                <p className="text-[12px] text-slate-500">
                  Principal Component Analysis reducing 11-dimensional behavioral feature space.
                </p>
              </div>
              <div className="text-[12px] text-slate-600">
                Variance explained: <strong className="text-navy-950">68.4%</strong>
              </div>
            </div>

            {/* SVG Scatter Plot */}
            <div className="relative w-full aspect-[16/9] bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center">
              <svg className="w-full h-full select-none" fill="none" viewBox="0 0 640 360">
                <defs>
                  <pattern id="grid-pattern-pca" width="60" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2 3" />
                  </pattern>
                </defs>

                <rect x="50" y="20" width="540" height="300" fill="url(#grid-pattern-pca)" />
                <line x1="50" y1="170" x2="590" y2="170" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="320" y1="20" x2="320" y2="320" stroke="#cbd5e1" strokeWidth="1" />

                {/* Y-Axis */}
                <g className="text-slate-400 text-[10px] font-mono fill-current" textAnchor="end">
                  <text x="42" y="26">+4</text>
                  <text x="42" y="98">+2</text>
                  <text x="42" y="174">0</text>
                  <text x="42" y="250">-2</text>
                  <text x="42" y="324">-4</text>
                </g>
                <text
                  x="20"
                  y="170"
                  transform="rotate(-90 20 170)"
                  textAnchor="middle"
                  className="text-[11px] font-medium fill-slate-500 uppercase tracking-wider"
                >
                  PC2
                </text>

                {/* X-Axis */}
                <g className="text-slate-400 text-[10px] font-mono fill-current" textAnchor="middle">
                  <text x="50" y="340">-4</text>
                  <text x="185" y="340">-2</text>
                  <text x="320" y="340">0</text>
                  <text x="455" y="340">+2</text>
                  <text x="590" y="340">+4</text>
                </g>
                <text x="320" y="354" textAnchor="middle" className="text-[11px] font-medium fill-slate-500 uppercase tracking-wider">
                  PC1
                </text>

                {/* Point Clouds */}
                {/* Cluster 0 (Burst) */}
                <g opacity={activeClusterId === '0' ? 1.0 : 0.35} className="transition-opacity">
                  <circle cx="310" cy="240" r={activeClusterId === '0' ? 4.5 : 3} fill="#2563eb" />
                  <circle cx="325" cy="232" r={activeClusterId === '0' ? 4.5 : 3} fill="#2563eb" />
                  <circle cx="340" cy="245" r={activeClusterId === '0' ? 4.5 : 3} fill="#2563eb" />
                  <circle cx="305" cy="255" r={activeClusterId === '0' ? 4.5 : 3} fill="#2563eb" />
                </g>

                {/* Cluster 1 (Normal Heavy) */}
                <g opacity={activeClusterId === '1' ? 1.0 : 0.35} className="transition-opacity">
                  <circle cx="190" cy="190" r={activeClusterId === '1' ? 4.5 : 3} fill="#64748b" />
                  <circle cx="175" cy="175" r={activeClusterId === '1' ? 4.5 : 3} fill="#64748b" />
                  <circle cx="205" cy="205" r={activeClusterId === '1' ? 4.5 : 3} fill="#64748b" />
                  <circle cx="182" cy="210" r={activeClusterId === '1' ? 4.5 : 3} fill="#64748b" />
                </g>

                {/* Cluster 2 (Multi-repo) */}
                <g opacity={activeClusterId === '2' ? 1.0 : 0.35} className="transition-opacity">
                  <circle cx="440" cy="120" r={activeClusterId === '2' ? 5 : 3.5} fill="#0f172a" />
                  <circle cx="460" cy="135" r={activeClusterId === '2' ? 5 : 3.5} fill="#0f172a" />
                  <circle cx="425" cy="110" r={activeClusterId === '2' ? 5 : 3.5} fill="#0f172a" />
                  <circle cx="450" cy="150" r={activeClusterId === '2' ? 5 : 3.5} fill="#0f172a" />
                </g>

                {/* Cluster 3 (Automated CI) */}
                <g opacity={activeClusterId === '3' ? 1.0 : 0.35} className="transition-opacity">
                  <circle cx="120" cy="70" r={activeClusterId === '3' ? 5 : 3.5} fill="#dc2626" />
                  <circle cx="140" cy="85" r={activeClusterId === '3' ? 5 : 3.5} fill="#dc2626" />
                  <circle cx="110" cy="100" r={activeClusterId === '3' ? 5 : 3.5} fill="#dc2626" />
                </g>

                {/* Cluster 4 (Social CI) */}
                <g opacity={activeClusterId === '4' ? 1.0 : 0.35} className="transition-opacity">
                  <circle cx="150" cy="130" r={activeClusterId === '4' ? 4.5 : 3} fill="#d97706" />
                  <circle cx="165" cy="145" r={activeClusterId === '4' ? 4.5 : 3} fill="#d97706" />
                </g>

                {/* Cluster 5 (Push & Create) */}
                <g opacity={activeClusterId === '5' ? 1.0 : 0.35} className="transition-opacity">
                  <circle cx="360" cy="95" r={activeClusterId === '5' ? 4.5 : 3} fill="#7c3aed" />
                  <circle cx="380" cy="110" r={activeClusterId === '5' ? 4.5 : 3} fill="#7c3aed" />
                </g>

                {/* Cluster 6 (Continuous 24/7) */}
                <g opacity={activeClusterId === '6' ? 1.0 : 0.35} className="transition-opacity">
                  <circle cx="480" cy="220" r={activeClusterId === '6' ? 4.5 : 3} fill="#059669" />
                  <circle cx="505" cy="240" r={activeClusterId === '6' ? 4.5 : 3} fill="#059669" />
                  <circle cx="465" cy="230" r={activeClusterId === '6' ? 4.5 : 3} fill="#059669" />
                </g>
              </svg>
            </div>
          </div>

          {/* Archetypes Selector Grid */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[14px] font-bold text-navy-950 uppercase tracking-wider">
                Behavioral Archetypes (7 Clusters)
              </h2>
              <span className="text-[11px] text-slate-500">
                Click a row to inspect full profile
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.keys(clusters).map((key) => {
                const cl = clusters[key];
                const isSelected = activeClusterId === String(cl.cluster_id);
                return (
                  <button
                    key={cl.cluster_id}
                    onClick={() => setActiveClusterId(String(cl.cluster_id))}
                    type="button"
                    className={`p-3.5 text-left border transition-colors ${
                      isSelected
                        ? 'bg-slate-100 border-navy-950 text-navy-950'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[13px] font-bold text-navy-950">
                        {cl.title}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-600">
                        {cl.accounts} ({cl.accountsPct})
                      </span>
                    </div>

                    <div className="text-[12px] text-slate-600 truncate font-medium">
                      {cl.badge}
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-2 mt-2 border-t border-slate-200">
                      <span className="text-slate-500">
                        Anomaly: <strong className="text-rose-600">{cl.anomalyRate}</strong>
                      </span>
                      <span className="text-slate-500">
                        Mean: μ {cl.score}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Cluster Inspector */}
        <div className="lg:col-span-5 p-6 flex flex-col gap-5 bg-white">
          {/* Header of selected cluster - Pure Typography */}
          <div className="pb-4 border-b border-slate-200 flex items-start justify-between">
            <div>
              <h3 className="text-[16px] font-bold text-navy-950 uppercase tracking-tight">
                {activeCluster.title}
              </h3>
              <span className="text-[12px] font-medium text-slate-600">
                {activeCluster.badge}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase block">Total Accounts</span>
              <span className="text-2xl font-bold text-navy-950">
                {activeCluster.accounts}
              </span>
            </div>
          </div>

          {/* Metrics Trio */}
          <div className="grid grid-cols-3 border border-slate-200 divide-x divide-slate-200 text-center bg-slate-50/50">
            <div className="p-3">
              <span className="text-[10px] text-slate-500 uppercase block">Anomaly Rate</span>
              <span className="text-base font-bold text-rose-600">{activeCluster.anomalyRate}</span>
            </div>
            <div className="p-3">
              <span className="text-[10px] text-slate-500 uppercase block">Mean Score</span>
              <span className="text-base font-bold text-navy-950">μ {activeCluster.score}</span>
            </div>
            <div className="p-3">
              <span className="text-[10px] text-slate-500 uppercase block">Median Evt</span>
              <span className="text-base font-bold text-navy-950">{activeCluster.events}</span>
            </div>
          </div>

          {/* Behavioral Characteristics */}
          <div>
            <h4 className="text-[12px] font-bold text-navy-950 uppercase tracking-wider mb-2">
              Behavioral Characteristics
            </h4>
            <ul className="p-3.5 border border-slate-200 bg-slate-50/40 space-y-2 text-[12px] text-slate-700 leading-relaxed">
              {activeCluster.characteristics.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-navy-900 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Feature Proportion Vectors */}
          {activeCluster.fitur_mean && (
            <div>
              <h4 className="text-[12px] font-bold text-navy-950 uppercase tracking-wider mb-3">
                Feature Proportion Vectors (Mean)
              </h4>
              <div className="space-y-3">
                {/* Push */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600 font-medium">Push Ratio:</span>
                    <span className="font-semibold text-navy-950">
                      {(activeCluster.fitur_mean.frac_push * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-navy-950"
                      style={{ width: `${activeCluster.fitur_mean.frac_push * 100}%` }}
                    />
                  </div>
                </div>

                {/* PR */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600 font-medium">Pull Request Ratio:</span>
                    <span className="font-semibold text-navy-950">
                      {(activeCluster.fitur_mean.frac_pr * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-blue-600"
                      style={{ width: `${activeCluster.fitur_mean.frac_pr * 100}%` }}
                    />
                  </div>
                </div>

                {/* Issue */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600 font-medium">Issue Ratio:</span>
                    <span className="font-semibold text-navy-950">
                      {(activeCluster.fitur_mean.frac_issue * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-purple-600"
                      style={{ width: `${activeCluster.fitur_mean.frac_issue * 100}%` }}
                    />
                  </div>
                </div>

                {/* Repo Concentration */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600 font-medium">Max Repo Concentration:</span>
                    <span className="font-semibold text-navy-950">
                      {(activeCluster.fitur_mean.max_repo_share * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-amber-600"
                      style={{ width: `${activeCluster.fitur_mean.max_repo_share * 100}%` }}
                    />
                  </div>
                </div>

                {/* Hour Entropy */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600 font-medium">Normalized 24h Entropy:</span>
                    <span className="font-semibold text-navy-950">
                      {activeCluster.fitur_mean.hour_entropy.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-emerald-600"
                      style={{ width: `${activeCluster.fitur_mean.hour_entropy * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
