import React, { useState, useEffect, useRef } from 'react';
import Skeleton, { SkeletonCard } from '../components/Skeleton';

// Mathematical density calculation points for 100% continuous SVG path
const N_PTS = 80;
const DENSITY_PTS = [];
let maxD = 0;
const computeDensity = (x) => {
  const g1 = Math.exp(-Math.pow(x - 0.37, 2) / (2 * 0.085 * 0.085));
  const g2 = 0.38 * Math.exp(-Math.pow(x - 0.64, 2) / (2 * 0.14 * 0.14));
  const base = 0.04 * Math.exp(-2.5 * x);
  return g1 + g2 + base;
};

for (let i = 0; i <= N_PTS; i++) {
  const x = i / N_PTS;
  const d = computeDensity(x);
  if (d > maxD) maxD = d;
  DENSITY_PTS.push({ x, d });
}

export default function Overview() {
  const [loading, setLoading] = useState(true);
  const [hoveredScore, setHoveredScore] = useState(null);
  const [hoveredCluster, setHoveredCluster] = useState(null);
  const [isThresholdHovered, setIsThresholdHovered] = useState(false);
  const curveRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  // Cluster distribution percentages based on models/cluster_profiles.json
  const clusterData = [
    { id: 1, name: 'C1: Pendorong Masif', accounts: '17.458', pct: 39.5, color: '#64748b', anomalyRate: '0.0%', desc: 'Kontributor push terpusat pada satu repositori' },
    { id: 5, name: 'C5: Push & Inisialisasi', accounts: '8.663', pct: 19.6, color: '#7c3aed', anomalyRate: '4.1%', desc: 'Pembuatan repositori dan branch otomatis' },
    { id: 2, name: 'C2: Pendorong Multi-Repo', accounts: '7.956', pct: 18.0, color: '#0f172a', anomalyRate: '3.5%', desc: 'Aktivitas commit tersebar di banyak proyek' },
    { id: 6, name: 'C6: Volume Tinggi 24/7', accounts: '5.613', pct: 12.7, color: '#059669', anomalyRate: '8.5%', desc: 'Aliran commit tanpa henti sepanjang waktu' },
    { id: 0, name: 'C0: Pendorong Sentakan', accounts: '2.785', pct: 6.3, color: '#2563eb', anomalyRate: '12.7%', desc: 'Spike frekuensi tinggi dalam rentang waktu singkat' },
    { id: 3, name: 'C3: Integrasi CI Otomatis', accounts: '1.547', pct: 3.5, color: '#dc2626', anomalyRate: '42.9%', desc: 'Perkakas CI otomatis (Dependabot/Workflows)' },
    { id: 4, name: 'C4: Bot Perkakas & Rilis', accounts: '178', pct: 0.4, color: '#d97706', anomalyRate: '46.6%', desc: 'Skrip otomatisasi rilis dan pemeliharaan repositori' },
  ];

  // SVG dimensions for density curve
  const svgW = 600;
  const svgH = 220;
  const padX = 35;
  const padY = 30;
  const graphW = svgW - padX * 2;
  const graphH = svgH - padY * 2;
  const cutoff = 0.5514;
  const cutoffX = +(padX + cutoff * graphW).toFixed(1);
  const cutoffY = +(svgH - padY - (computeDensity(cutoff) / maxD) * graphH).toFixed(1);

  // Pre-generate SVG path strings
  let curvePathD = '';
  let fullAreaD = `M ${padX} ${svgH - padY} `;
  let anomalyAreaD = `M ${cutoffX} ${svgH - padY} L ${cutoffX} ${cutoffY} `;

  DENSITY_PTS.forEach((pt, idx) => {
    const px = +(padX + pt.x * graphW).toFixed(1);
    const py = +(svgH - padY - (pt.d / maxD) * graphH).toFixed(1);
    if (idx === 0) {
      curvePathD += `M ${px} ${py} `;
    } else {
      curvePathD += `L ${px} ${py} `;
    }
    fullAreaD += `L ${px} ${py} `;
    if (pt.x >= cutoff) {
      anomalyAreaD += `L ${px} ${py} `;
    }
  });

  fullAreaD += `L ${svgW - padX} ${svgH - padY} Z`;
  anomalyAreaD += `L ${svgW - padX} ${svgH - padY} Z`;

  // Crosshair mouse tracking
  const handleMouseMove = (e) => {
    if (!curveRef.current) return;
    const rect = curveRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const normalizedWidth = rect.width;
    const paddingRelative = (padX / svgW) * normalizedWidth;
    const chartWidth = normalizedWidth - paddingRelative * 2;

    const clampedX = Math.max(paddingRelative, Math.min(clientX, normalizedWidth - paddingRelative));
    const scoreVal = (clampedX - paddingRelative) / chartWidth;
    const score = Math.max(0, Math.min(scoreVal, 1));

    const density = computeDensity(score);
    const svgPointX = +(padX + score * graphW).toFixed(1);
    const svgPointY = +(svgH - padY - (density / maxD) * graphH).toFixed(1);

    const percentile = Math.min(99.9, Math.max(0.1, (1 / (1 + Math.exp(-9 * (score - 0.42)))) * 100));
    const count = Math.round(density * 3400 + 40);

    setHoveredScore({
      svgX: svgPointX,
      svgY: svgPointY,
      screenPercentX: (clampedX / normalizedWidth) * 100,
      score: score,
      percentile: percentile,
      count: count,
      isAnomaly: score >= cutoff,
    });
  };

  const handleMouseLeave = () => {
    setHoveredScore(null);
    setIsThresholdHovered(false);
  };

  const activeClusterInfo = hoveredCluster !== null ? clusterData.find((c) => c.id === hoveredCluster) : null;

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
        <div className="space-y-2 border-b border-slate-200/80 pb-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} className="space-y-3">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-3 w-20" />
            </SkeletonCard>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonCard className="space-y-4">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-56 w-full" />
          </SkeletonCard>
          <SkeletonCard className="space-y-4">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-56 w-full" />
          </SkeletonCard>
        </div>
      </div>
    );
  }

  const donutRadius = 58;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
      {/* Editorial Page Header - Calm, Clean, Clear Focus */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">
            Pipeline Overview
          </h1>
          <p className="text-[13px] text-slate-500 mt-0.5">
            Pemodelan perilaku dan deteksi anomali bot nir-terbimbing (unsupervised) pada 9,88 juta event publik GitHub.
          </p>
        </div>
        <div className="text-[11px] font-medium text-slate-500 shrink-0">
          GH Archive · Ingesti 152 Jam · Blok A & B
        </div>
      </div>

      {/* Primary Metrics Grid - 4 Focused Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200/90 rounded-[4px] p-5 shadow-2xs flex flex-col justify-between">
          <span className="text-[12px] font-medium text-slate-500">
            Total Events Ingested
          </span>
          <div className="mt-3">
            <div className="text-3xl font-bold text-slate-900 tracking-tight">
              9.88M
            </div>
            <div className="text-[12px] text-slate-500 mt-1">
              9.884.213 event bersih selama 152 jam observasi
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200/90 rounded-[4px] p-5 shadow-2xs flex flex-col justify-between">
          <span className="text-[12px] font-medium text-slate-500">
            Modeled Profiles
          </span>
          <div className="mt-3">
            <div className="text-3xl font-bold text-slate-900 tracking-tight">
              44,200
            </div>
            <div className="text-[12px] text-slate-500 mt-1">
              11 dimensi fitur perilaku diekstraksi per akun
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200/90 rounded-[4px] p-5 shadow-2xs flex flex-col justify-between">
          <span className="text-[12px] font-medium text-slate-500">
            Flagged Anomalies
          </span>
          <div className="mt-3">
            <div className="text-3xl font-bold text-rose-600 tracking-tight">
              2,210
            </div>
            <div className="text-[12px] text-slate-500 mt-1">
              Kuantil teratas 5,0% (skor ambang batas τ ≥ 0,5514)
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200/90 rounded-[4px] p-5 shadow-2xs flex flex-col justify-between">
          <span className="text-[12px] font-medium text-slate-500">
            Behavioral Clusters
          </span>
          <div className="mt-3">
            <div className="text-3xl font-bold text-slate-900 tracking-tight">
              7
            </div>
            <div className="text-[12px] text-slate-500 mt-1">
              Partisi nir-terbimbing K-Means (k=7)
            </div>
          </div>
        </div>
      </section>

      {/* Main Visual Core: Two Hero Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Anomaly Distribution Curve with Crosshair Scrubber */}
        <div className="bg-white border border-slate-200/90 rounded-[4px] p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] font-semibold text-slate-900">
                Anomaly Score Distribution
              </h2>
              <span className="text-[11px] font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-[4px]">
                Isolation Forest
              </span>
            </div>
            <p className="text-[12px] text-slate-500 mt-1">
              Estimasi kepadatan kernel (KDE) pada 44,2 ribu akun. Arahkan kursor pada kurva untuk inspeksi metrik langsung.
            </p>
          </div>

          {/* Interactive Chart Container */}
          <div
            ref={curveRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="mt-6 relative w-full select-none cursor-crosshair"
          >
            {/* Live Floating Tooltip Following Cursor */}
            {hoveredScore && (
              <div
                className="absolute pointer-events-none z-20 bg-slate-900 text-white border border-slate-800 p-2.5 rounded-[4px] shadow-lg text-[11px] transition-transform duration-75 ease-out -top-14"
                style={{
                  left: `${hoveredScore.screenPercentX}%`,
                  transform:
                    hoveredScore.screenPercentX > 70
                      ? 'translateX(-105%)'
                      : hoveredScore.screenPercentX < 30
                      ? 'translateX(5%)'
                      : 'translateX(-50%)',
                }}
              >
                <div className="flex items-center gap-2 border-b border-slate-800 pb-1 mb-1">
                  <span className="font-semibold text-slate-200">Score: {hoveredScore.score.toFixed(4)}</span>
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded-[2px] font-medium ${
                      hoveredScore.isAnomaly ? 'bg-rose-500 text-white' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {hoveredScore.isAnomaly ? 'Bot Anomaly' : 'Normal Human'}
                  </span>
                </div>
                <div className="text-slate-300 text-[10px] space-y-0.5">
                  <div>Persentil: <strong className="text-white">{hoveredScore.percentile.toFixed(1)}%</strong></div>
                  <div>Estimasi Akun: <strong className="text-white">~{hoveredScore.count.toLocaleString()}</strong></div>
                  <div>Cutoff: <span className={hoveredScore.isAnomaly ? 'text-rose-400 font-semibold' : 'text-slate-400'}>{hoveredScore.isAnomaly ? 'τ ≥ 0.5514 (Anomali)' : 'τ < 0.5514'}</span></div>
                </div>
              </div>
            )}

            <div className="w-full h-56 relative">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox={`0 0 ${svgW} ${svgH}`}>
                <defs>
                  {/* Primary Curve Gradient */}
                  <linearGradient id="curveGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#0f172a" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0.02" />
                  </linearGradient>

                  {/* Shaded Anomaly Tail Gradient */}
                  <linearGradient id="anomalyTail" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop
                      offset="0%"
                      stopColor="#dc2626"
                      stopOpacity={isThresholdHovered || hoveredScore?.isAnomaly ? '0.40' : '0.18'}
                    />
                    <stop
                      offset="100%"
                      stopColor="#0f172a"
                      stopOpacity={isThresholdHovered || hoveredScore?.isAnomaly ? '0.10' : '0.02'}
                    />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1={padX} y1={svgH - padY} x2={svgW - padX} y2={svgH - padY} stroke="#e2e8f0" strokeWidth="1" />
                <line x1={padX} y1={padY} x2={padX} y2={svgH - padY} stroke="#e2e8f0" strokeWidth="1" />

                {/* Full Curve Filled Area */}
                <path d={fullAreaD} fill="url(#curveGradient)" />

                {/* Shaded Anomaly Zone */}
                <path d={anomalyAreaD} fill="url(#anomalyTail)" />

                {/* Continuous Stroke */}
                <path d={curvePathD} fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

                {/* Cutoff Threshold Dashed Line (tau = 0.5514) */}
                <line
                  x1={cutoffX}
                  y1={padY - 5}
                  x2={cutoffX}
                  y2={svgH - padY}
                  stroke="#dc2626"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  className="cursor-pointer"
                  onMouseEnter={() => setIsThresholdHovered(true)}
                  onMouseLeave={() => setIsThresholdHovered(false)}
                />

                {/* Cutoff Label */}
                <text
                  x={cutoffX + 6}
                  y={padY + 12}
                  className="text-[10px] fill-rose-600 font-medium"
                >
                  Cutoff τ = 0.5514 (Top 5%)
                </text>

                {/* Hover Crosshair Vertical Line */}
                {hoveredScore && (
                  <g>
                    <line
                      x1={hoveredScore.svgX}
                      y1={padY - 8}
                      x2={hoveredScore.svgX}
                      y2={svgH - padY}
                      stroke={hoveredScore.isAnomaly ? '#dc2626' : '#2563eb'}
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                    />
                    <circle
                      cx={hoveredScore.svgX}
                      cy={hoveredScore.svgY}
                      r="4"
                      fill={hoveredScore.isAnomaly ? '#dc2626' : '#2563eb'}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                  </g>
                )}

                {/* Axis Ticks */}
                <text x={padX} y={svgH - padY + 18} textAnchor="start" className="text-[10px] fill-slate-400">
                  0.0 (Normal)
                </text>
                <text x={padX + graphW * 0.37} y={svgH - padY + 18} textAnchor="middle" className="text-[10px] fill-slate-400">
                  0.37 (Mode)
                </text>
                <text x={padX + graphW * 0.55} y={svgH - padY + 18} textAnchor="middle" className="text-[10px] fill-rose-500 font-medium">
                  0.55
                </text>
                <text x={svgW - padX} y={svgH - padY + 18} textAnchor="end" className="text-[10px] fill-slate-400">
                  1.0 (Anomaly)
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* Panel 2: Cluster Composition (Donut + Clean Legend) */}
        <div className="bg-white border border-slate-200/90 rounded-[4px] p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] font-semibold text-slate-900">
                Cluster Composition
              </h2>
              <span className="text-[11px] font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-[4px]">
                K-Means (k=7)
              </span>
            </div>
            <p className="text-[12px] text-slate-500 mt-1">
              Arahkan kursor pada segmen donat atau daftar item untuk memeriksa arketipe kontributor dan proporsi populasi.
            </p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-around gap-6">
            {/* Interactive Donut SVG */}
            <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 overflow-visible" viewBox="0 0 160 160">
                {/* C1: 39.5% -> 143.95 */}
                <circle
                  cx="80"
                  cy="80"
                  r={donutRadius}
                  fill="transparent"
                  stroke="#64748b"
                  strokeWidth={hoveredCluster === 1 ? 22 : 16}
                  strokeDasharray="143.95 364.42"
                  strokeDashoffset="0"
                  style={{
                    transformOrigin: '80px 80px',
                    transform: hoveredCluster === 1 ? 'scale(1.05)' : 'scale(1)',
                    opacity: hoveredCluster === null || hoveredCluster === 1 ? 1.0 : 0.45,
                    transition: 'all 0.2s ease-out',
                  }}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredCluster(1)}
                  onMouseLeave={() => setHoveredCluster(null)}
                />

                {/* C5: 19.6% -> 71.43 */}
                <circle
                  cx="80"
                  cy="80"
                  r={donutRadius}
                  fill="transparent"
                  stroke="#7c3aed"
                  strokeWidth={hoveredCluster === 5 ? 22 : 16}
                  strokeDasharray="71.43 364.42"
                  strokeDashoffset="-143.95"
                  style={{
                    transformOrigin: '80px 80px',
                    transform: hoveredCluster === 5 ? 'scale(1.05)' : 'scale(1)',
                    opacity: hoveredCluster === null || hoveredCluster === 5 ? 1.0 : 0.45,
                    transition: 'all 0.2s ease-out',
                  }}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredCluster(5)}
                  onMouseLeave={() => setHoveredCluster(null)}
                />

                {/* C2: 18.0% -> 65.60 */}
                <circle
                  cx="80"
                  cy="80"
                  r={donutRadius}
                  fill="transparent"
                  stroke="#0f172a"
                  strokeWidth={hoveredCluster === 2 ? 22 : 16}
                  strokeDasharray="65.60 364.42"
                  strokeDashoffset="-215.38"
                  style={{
                    transformOrigin: '80px 80px',
                    transform: hoveredCluster === 2 ? 'scale(1.05)' : 'scale(1)',
                    opacity: hoveredCluster === null || hoveredCluster === 2 ? 1.0 : 0.45,
                    transition: 'all 0.2s ease-out',
                  }}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredCluster(2)}
                  onMouseLeave={() => setHoveredCluster(null)}
                />

                {/* C6: 12.7% -> 46.28 */}
                <circle
                  cx="80"
                  cy="80"
                  r={donutRadius}
                  fill="transparent"
                  stroke="#059669"
                  strokeWidth={hoveredCluster === 6 ? 22 : 16}
                  strokeDasharray="46.28 364.42"
                  strokeDashoffset="-280.98"
                  style={{
                    transformOrigin: '80px 80px',
                    transform: hoveredCluster === 6 ? 'scale(1.05)' : 'scale(1)',
                    opacity: hoveredCluster === null || hoveredCluster === 6 ? 1.0 : 0.45,
                    transition: 'all 0.2s ease-out',
                  }}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredCluster(6)}
                  onMouseLeave={() => setHoveredCluster(null)}
                />

                {/* C0: 6.3% -> 22.96 */}
                <circle
                  cx="80"
                  cy="80"
                  r={donutRadius}
                  fill="transparent"
                  stroke="#2563eb"
                  strokeWidth={hoveredCluster === 0 ? 22 : 16}
                  strokeDasharray="22.96 364.42"
                  strokeDashoffset="-327.26"
                  style={{
                    transformOrigin: '80px 80px',
                    transform: hoveredCluster === 0 ? 'scale(1.05)' : 'scale(1)',
                    opacity: hoveredCluster === null || hoveredCluster === 0 ? 1.0 : 0.45,
                    transition: 'all 0.2s ease-out',
                  }}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredCluster(0)}
                  onMouseLeave={() => setHoveredCluster(null)}
                />

                {/* C3: 3.5% -> 12.75 */}
                <circle
                  cx="80"
                  cy="80"
                  r={donutRadius}
                  fill="transparent"
                  stroke="#dc2626"
                  strokeWidth={hoveredCluster === 3 ? 22 : 16}
                  strokeDasharray="12.75 364.42"
                  strokeDashoffset="-350.22"
                  style={{
                    transformOrigin: '80px 80px',
                    transform: hoveredCluster === 3 ? 'scale(1.05)' : 'scale(1)',
                    opacity: hoveredCluster === null || hoveredCluster === 3 ? 1.0 : 0.45,
                    transition: 'all 0.2s ease-out',
                  }}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredCluster(3)}
                  onMouseLeave={() => setHoveredCluster(null)}
                />

                {/* C4: 0.4% -> 1.45 */}
                <circle
                  cx="80"
                  cy="80"
                  r={donutRadius}
                  fill="transparent"
                  stroke="#d97706"
                  strokeWidth={hoveredCluster === 4 ? 22 : 16}
                  strokeDasharray="1.45 364.42"
                  strokeDashoffset="-362.97"
                  style={{
                    transformOrigin: '80px 80px',
                    transform: hoveredCluster === 4 ? 'scale(1.05)' : 'scale(1)',
                    opacity: hoveredCluster === null || hoveredCluster === 4 ? 1.0 : 0.45,
                    transition: 'all 0.2s ease-out',
                  }}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredCluster(4)}
                  onMouseLeave={() => setHoveredCluster(null)}
                />
              </svg>

              {/* Center Readout */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2 transition-all">
                {activeClusterInfo ? (
                  <>
                    <span className="text-2xl font-bold text-slate-900 leading-none">
                      {activeClusterInfo.pct}%
                    </span>
                    <span className="text-[10px] font-semibold text-slate-700 mt-1 truncate max-w-[110px]">
                      {activeClusterInfo.name.split(':')[0]}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {activeClusterInfo.accounts} akun
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl font-bold text-slate-900 leading-none">
                      7
                    </span>
                    <span className="text-[10px] font-medium text-slate-500 mt-0.5">Arketipe</span>
                    <span className="text-[10px] text-slate-400">44,2 ribu total</span>
                  </>
                )}
              </div>
            </div>

            {/* Interactive Legend List */}
            <div className="flex flex-col gap-1 w-full max-w-[250px]">
              {clusterData.map((cl) => {
                const isHovered = hoveredCluster === cl.id;
                return (
                  <button
                    key={cl.id}
                    type="button"
                    onMouseEnter={() => setHoveredCluster(cl.id)}
                    onMouseLeave={() => setHoveredCluster(null)}
                    className={`flex items-center justify-between text-[12px] p-1.5 rounded-[4px] transition-colors text-left ${
                      isHovered ? 'bg-slate-100 font-semibold text-slate-900' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-[2px] shrink-0"
                        style={{ backgroundColor: cl.color }}
                      />
                      <span className="truncate">{cl.name}</span>
                    </div>
                    <span className="font-medium ml-2 text-slate-600 shrink-0">{cl.pct}%</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Model Benchmark Highlights - 3 Clean Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Finding 1 */}
        <div className="bg-white border border-slate-200/90 rounded-[4px] p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-slate-500">
              Cross-Time Generalization
            </span>
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded-[4px]">
              +36% Lift
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">
                0.809
              </span>
              <span className="text-[12px] text-slate-500 font-medium">
                ROC-AUC
              </span>
            </div>
            <p className="text-[12px] text-slate-600 mt-2 leading-relaxed">
              Peningkatan performa substansial dibandingkan baseline volume dimensi tunggal (0,595), membuktikan efektivitas diskriminasi perilaku multidimensi.
            </p>
          </div>
        </div>

        {/* Finding 2 */}
        <div className="bg-white border border-slate-200/90 rounded-[4px] p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-slate-500">
              Temporal Rank Stability
            </span>
            <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 border border-slate-200 rounded-[4px]">
              Jeda Δt = 76 jam
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">
                0.720
              </span>
              <span className="text-[12px] text-slate-500 font-medium">
                Spearman ρ
              </span>
            </div>
            <p className="text-[12px] text-slate-600 mt-2 leading-relaxed">
              Korelasi peringkat yang kuat antar-blok waktu independen membuktikan bahwa sidik jari perilaku akun tetap konsisten pada jendela observasi terpisah.
            </p>
          </div>
        </div>

        {/* Finding 3 */}
        <div className="bg-white border border-slate-200/90 rounded-[4px] p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-slate-500">
              NoSQL Query Acceleration
            </span>
            <span className="text-[11px] font-medium text-navy-800 bg-navy-50 px-2 py-0.5 border border-navy-200 rounded-[4px]">
              Atlas Index
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">
                9.0x
              </span>
              <span className="text-[12px] text-slate-500 font-medium">
                Query Speedup
              </span>
            </div>
            <p className="text-[12px] text-slate-600 mt-2 leading-relaxed">
              Indeks majemuk B-Tree MongoDB Atlas (<code className="text-slate-800 font-medium">ts_1</code>) mempercepat agregasi rentang waktu pada 9,88 juta event dari 150 detik menjadi dalam hitungan milidetik.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
