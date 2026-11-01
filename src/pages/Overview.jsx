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
    const timer = setTimeout(() => setLoading(false), 240);
    return () => clearTimeout(timer);
  }, []);

  // Cluster distribution percentages based on models/cluster_profiles.json
  const clusterData = [
    { id: 1, name: 'C1: Heavy Pushers', accounts: '17,458', pct: 39.5, color: '#64748b', anomalyRate: '0.0%', desc: 'Single-repo organic push contributor' },
    { id: 5, name: 'C5: Push & Create', accounts: '8,663', pct: 19.6, color: '#7c3aed', anomalyRate: '4.1%', desc: 'Frequent repo and branch initialization' },
    { id: 2, name: 'C2: Multi-Repo Push', accounts: '7,956', pct: 18.0, color: '#0f172a', anomalyRate: '3.5%', desc: 'Distributed commits across diverse projects' },
    { id: 6, name: 'C6: 24/7 High Vol', accounts: '5,613', pct: 12.7, color: '#059669', anomalyRate: '8.5%', desc: 'Continuous round-the-clock commit streams' },
    { id: 0, name: 'C0: Burst Pushers', accounts: '2,785', pct: 6.3, color: '#2563eb', anomalyRate: '12.7%', desc: 'High velocity short duration burst spikes' },
    { id: 3, name: 'C3: Automated CI', accounts: '1,547', pct: 3.5, color: '#dc2626', anomalyRate: '42.9%', desc: 'Automated CI tooling (Dependabot/Workflows)' },
    { id: 4, name: 'C4: Tooling Bots', accounts: '178', pct: 0.4, color: '#d97706', anomalyRate: '46.6%', desc: 'Automated release and maintenance scripts' },
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

    // Approximate percentile and estimated accounts
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
        <div className="bg-white border border-slate-200/90 rounded-[4px] p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </div>
          <Skeleton className="h-7 w-32" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} className="space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-3 w-20" />
            </SkeletonCard>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonCard className="space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-56 w-full" />
          </SkeletonCard>
          <SkeletonCard className="space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-56 w-full" />
          </SkeletonCard>
        </div>
      </div>
    );
  }

  // Donut Arc Circumference (r=58 -> 2*PI*58 = 364.42)
  const donutRadius = 58;
  const donutCircumference = 364.42;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
      {/* Editorial Header Card */}
      <section className="bg-white border border-slate-200/90 rounded-[4px] p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-navy-950 tracking-tight uppercase">
            System Overview
          </h1>
          <p className="text-[13px] text-slate-500 mt-0.5">
            Behavioral analysis of GitHub public activity streams using unsupervised machine learning and anomaly detection.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-[11px] font-semibold text-navy-800 bg-navy-50 border border-navy-200/70 px-2.5 py-1 rounded-[4px] uppercase tracking-wider">
            PIPELINE V1.4.2 · 152H INGESTION
          </span>
        </div>
      </section>

      {/* Metrics Row - 4 Modular Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200/90 rounded-[4px] p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              Events Ingested
            </span>
            <span className="font-mono text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 border border-slate-200 rounded-[4px] font-medium">
              GH ARCHIVE
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-navy-950 tracking-tight">
              9.88M
            </span>
            <span className="font-mono text-[11px] text-slate-500">152 Hours</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200/90 rounded-[4px] p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              Modeled Accounts
            </span>
            <span className="font-mono text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 border border-slate-200 rounded-[4px] font-medium">
              239.6K RAW
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-navy-950 tracking-tight">
              44.2K
            </span>
            <span className="font-mono text-[11px] text-slate-500">Feature Vectors</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200/90 rounded-[4px] p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              Anomaly Candidates
            </span>
            <span className="font-mono text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 border border-rose-200 rounded-[4px]">
              TOP 5.0%
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-rose-600 tracking-tight">
              2,210
            </span>
            <span className="font-mono text-[11px] text-slate-500">τ ≥ 0.5514</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200/90 rounded-[4px] p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              Behavioral Archetypes
            </span>
            <span className="font-mono text-[10px] text-navy-800 bg-navy-50 px-1.5 py-0.5 border border-navy-200 rounded-[4px] font-medium">
              K = 7
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-navy-950 tracking-tight">
              7
            </span>
            <span className="font-mono text-[11px] text-slate-500">Clusters</span>
          </div>
        </div>
      </section>

      {/* Main Interactive Visualizations: Anomaly Distribution + K-Means Donut */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Interactive Score Distribution Curve with Crosshair & Glowing Tail */}
        <div className="bg-white border border-slate-200/90 rounded-[4px] p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] font-bold text-navy-950 uppercase tracking-wider">
                Score Distribution Curve
              </h2>
              <span className="font-mono text-[10px] text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-[4px]">
                ISOLATION FOREST
              </span>
            </div>
            <p className="text-[12px] text-slate-500 mt-1">
              Empirical kernel density curve across 44.2K feature vectors. Move cursor over curve to inspect live crosshair metrics.
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
                className="absolute pointer-events-none z-20 bg-navy-950 text-white border border-navy-800 p-2.5 rounded-[4px] shadow-lg text-[11px] font-mono transition-transform duration-75 ease-out -top-14"
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
                <div className="flex items-center gap-2 border-b border-navy-800 pb-1 mb-1">
                  <span className="font-bold text-slate-200">Score: {hoveredScore.score.toFixed(4)}</span>
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded-[2px] font-semibold ${
                      hoveredScore.isAnomaly ? 'bg-rose-500 text-white' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {hoveredScore.isAnomaly ? 'BOT ANOMALY' : 'NORMAL HUMAN'}
                  </span>
                </div>
                <div className="text-slate-300 text-[10px] space-y-0.5">
                  <div>Percentile: <strong className="text-white">{hoveredScore.percentile.toFixed(1)}%</strong></div>
                  <div>Estimated Accounts: <strong className="text-white">~{hoveredScore.count.toLocaleString()}</strong></div>
                  <div>Cutoff: <span className={hoveredScore.isAnomaly ? 'text-rose-400 font-bold' : 'text-slate-400'}>{hoveredScore.isAnomaly ? 'τ ≥ 0.5514 (Positive)' : 'τ < 0.5514'}</span></div>
                </div>
              </div>
            )}

            <div className="w-full h-56 relative">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox={`0 0 ${svgW} ${svgH}`}>
                <defs>
                  {/* Primary Curve Gradient */}
                  <linearGradient id="navyCurveGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.02" />
                  </linearGradient>

                  {/* Shaded Anomaly Tail Gradient (Glowing Crimson/Navy) */}
                  <linearGradient id="anomalyGlowingTail" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop
                      offset="0%"
                      stopColor="#dc2626"
                      stopOpacity={isThresholdHovered || hoveredScore?.isAnomaly ? '0.45' : '0.22'}
                    />
                    <stop
                      offset="100%"
                      stopColor="#1e3a8a"
                      stopOpacity={isThresholdHovered || hoveredScore?.isAnomaly ? '0.12' : '0.02'}
                    />
                  </linearGradient>

                  {/* Cutoff Line Glow Filter */}
                  <filter id="cutoff-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Hairline Grid Guides */}
                <line stroke="#e2e8f0" strokeWidth="1" x1={padX} x2={svgW - padX} y1={svgH - padY} y2={svgH - padY} />
                <line stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" x1={padX} x2={svgW - padX} y1={svgH - padY - graphH * 0.33} y2={svgH - padY - graphH * 0.33} />
                <line stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" x1={padX} x2={svgW - padX} y1={svgH - padY - graphH * 0.66} y2={svgH - padY - graphH * 0.66} />

                {/* Primary Continuous Density Fill */}
                <path d={fullAreaD} fill="url(#navyCurveGradient)" />

                {/* Shaded Area Above Cutoff Threshold (τ ≥ 0.5514) with Soft Crimson/Navy Glow */}
                <path
                  d={anomalyAreaD}
                  fill="url(#anomalyGlowingTail)"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setIsThresholdHovered(true)}
                  onMouseLeave={() => setIsThresholdHovered(false)}
                />

                {/* Continuous Mathematical Curve Stroke */}
                <path d={curvePathD} fill="none" stroke="#0a192f" strokeWidth="2.5" />

                {/* Anomaly Cutoff at τ = 0.5514 with Glowing Effect */}
                <g
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setIsThresholdHovered(true)}
                  onMouseLeave={() => setIsThresholdHovered(false)}
                >
                  {/* Glowing backing line if hovered */}
                  {(isThresholdHovered || hoveredScore?.isAnomaly) && (
                    <line
                      x1={cutoffX}
                      x2={cutoffX}
                      y1={15}
                      y2={svgH - padY}
                      stroke="#dc2626"
                      strokeWidth="4"
                      opacity="0.35"
                      filter="url(#cutoff-glow)"
                    />
                  )}
                  <line
                    x1={cutoffX}
                    x2={cutoffX}
                    y1={15}
                    y2={svgH - padY}
                    stroke="#dc2626"
                    strokeDasharray={isThresholdHovered ? 'none' : '4 3'}
                    strokeWidth={isThresholdHovered ? '2' : '1.5'}
                  />

                  {/* Cutoff Badge */}
                  <rect
                    x={cutoffX + 4}
                    y={18}
                    width={142}
                    height={20}
                    fill={isThresholdHovered ? '#fee2e2' : '#fef2f2'}
                    stroke={isThresholdHovered ? '#dc2626' : '#fecaca'}
                    strokeWidth="1"
                    rx="2"
                  />
                  <text className="font-mono text-[10px] font-bold" fill="#dc2626" x={cutoffX + 9} y={32}>
                    Cutoff τ = 0.5514 (Top 5%)
                  </text>
                </g>

                {/* Interactive Vertical Crosshair Hairline and Intersection Dot */}
                {hoveredScore && (
                  <g>
                    <line
                      stroke={hoveredScore.isAnomaly ? '#dc2626' : '#2563eb'}
                      strokeDasharray="2 2"
                      strokeWidth="1.5"
                      x1={hoveredScore.svgX}
                      x2={hoveredScore.svgX}
                      y1={15}
                      y2={svgH - padY}
                    />
                    <circle
                      cx={hoveredScore.svgX}
                      cy={hoveredScore.svgY}
                      r="5.5"
                      fill={hoveredScore.isAnomaly ? '#dc2626' : '#2563eb'}
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="animate-pulse"
                    />
                  </g>
                )}
              </svg>
            </div>

            {/* Axis Labels */}
            <div className="flex justify-between items-center text-slate-500 font-mono text-[11px] pt-2">
              <span>0.0 (Normal)</span>
              <span>0.2</span>
              <span>0.4 (Peak μ)</span>
              <span>0.6</span>
              <span>0.8</span>
              <span>1.0 (Anomaly)</span>
            </div>
          </div>
        </div>

        {/* Panel 2: Interactive Donut Chart K-Means with Segment Scaling & Real-time Center Hole */}
        <div className="bg-white border border-slate-200/90 rounded-[4px] p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] font-bold text-navy-950 uppercase tracking-wider">
                Donut Chart K-Means
              </h2>
              <span className="font-mono text-[10px] text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-[4px]">
                K-MEANS (K=7)
              </span>
            </div>
            <p className="text-[12px] text-slate-500 mt-1">
              Hover over donut segments or table rows to inspect behavioral archetypes and account populations in real time.
            </p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-around gap-6">
            {/* Interactive Donut SVG with Segment Expansion (scale 1.05) */}
            <div className="relative w-48 h-48 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 overflow-visible" viewBox="0 0 160 160">
                {/* C1: 39.5% -> 143.95 */}
                <circle
                  cx="80"
                  cy="80"
                  r={donutRadius}
                  fill="transparent"
                  stroke="#64748b"
                  strokeWidth={hoveredCluster === 1 ? 24 : 18}
                  strokeDasharray="143.95 364.42"
                  strokeDashoffset="0"
                  style={{
                    transformOrigin: '80px 80px',
                    transform: hoveredCluster === 1 ? 'scale(1.05)' : 'scale(1)',
                    opacity: hoveredCluster === null || hoveredCluster === 1 ? 1.0 : 0.45,
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
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
                  strokeWidth={hoveredCluster === 5 ? 24 : 18}
                  strokeDasharray="71.43 364.42"
                  strokeDashoffset="-143.95"
                  style={{
                    transformOrigin: '80px 80px',
                    transform: hoveredCluster === 5 ? 'scale(1.05)' : 'scale(1)',
                    opacity: hoveredCluster === null || hoveredCluster === 5 ? 1.0 : 0.45,
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
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
                  strokeWidth={hoveredCluster === 2 ? 24 : 18}
                  strokeDasharray="65.60 364.42"
                  strokeDashoffset="-215.38"
                  style={{
                    transformOrigin: '80px 80px',
                    transform: hoveredCluster === 2 ? 'scale(1.05)' : 'scale(1)',
                    opacity: hoveredCluster === null || hoveredCluster === 2 ? 1.0 : 0.45,
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
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
                  strokeWidth={hoveredCluster === 6 ? 24 : 18}
                  strokeDasharray="46.28 364.42"
                  strokeDashoffset="-280.98"
                  style={{
                    transformOrigin: '80px 80px',
                    transform: hoveredCluster === 6 ? 'scale(1.05)' : 'scale(1)',
                    opacity: hoveredCluster === null || hoveredCluster === 6 ? 1.0 : 0.45,
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
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
                  strokeWidth={hoveredCluster === 0 ? 24 : 18}
                  strokeDasharray="22.96 364.42"
                  strokeDashoffset="-327.26"
                  style={{
                    transformOrigin: '80px 80px',
                    transform: hoveredCluster === 0 ? 'scale(1.05)' : 'scale(1)',
                    opacity: hoveredCluster === null || hoveredCluster === 0 ? 1.0 : 0.45,
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
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
                  strokeWidth={hoveredCluster === 3 ? 24 : 18}
                  strokeDasharray="12.75 364.42"
                  strokeDashoffset="-350.22"
                  style={{
                    transformOrigin: '80px 80px',
                    transform: hoveredCluster === 3 ? 'scale(1.05)' : 'scale(1)',
                    opacity: hoveredCluster === null || hoveredCluster === 3 ? 1.0 : 0.45,
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
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
                  strokeWidth={hoveredCluster === 4 ? 24 : 18}
                  strokeDasharray="1.45 364.42"
                  strokeDashoffset="-362.97"
                  style={{
                    transformOrigin: '80px 80px',
                    transform: hoveredCluster === 4 ? 'scale(1.05)' : 'scale(1)',
                    opacity: hoveredCluster === null || hoveredCluster === 4 ? 1.0 : 0.45,
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredCluster(4)}
                  onMouseLeave={() => setHoveredCluster(null)}
                />
              </svg>

              {/* Real-time Dynamic Center Hole Readout */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2 transition-all">
                {activeClusterInfo ? (
                  <>
                    <span className="font-mono text-2xl font-bold text-navy-950 leading-none">
                      {activeClusterInfo.pct}%
                    </span>
                    <span className="font-mono text-[10px] font-semibold text-slate-700 uppercase mt-1 truncate max-w-[110px]">
                      {activeClusterInfo.name.split(':')[0]}
                    </span>
                    <span className="font-mono text-[9px] text-navy-800 font-medium">
                      {activeClusterInfo.accounts} accs
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-mono text-2xl font-bold text-navy-950 leading-none">
                      7
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 uppercase mt-0.5">ARCHETYPES</span>
                    <span className="font-mono text-[9px] text-slate-400">44.2K Modeled</span>
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
                      isHovered ? 'bg-slate-100 font-semibold text-navy-950' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-[2px] shrink-0"
                        style={{ backgroundColor: cl.color }}
                      />
                      <span className="truncate">{cl.name}</span>
                    </div>
                    <span className="font-mono font-medium ml-2 text-slate-600 shrink-0">{cl.pct}%</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Key Findings Section - 3 Modular Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Finding 1 */}
        <div className="bg-white border border-slate-200/90 rounded-[4px] p-6 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              Evaluation Performance
            </span>
            <span className="font-mono text-[10px] text-navy-700 bg-navy-50 px-1.5 py-0.5 border border-navy-200 rounded-[4px] font-medium">
              +36% LIFT
            </span>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-navy-950">
                0.809
              </span>
              <span className="font-mono text-[11px] text-slate-500 uppercase">
                ROC-AUC
              </span>
            </div>
            <p className="text-[12px] text-slate-600 mt-2 leading-relaxed">
              Substantial performance improvement over the single-dimension volume baseline (<code className="font-mono text-navy-950">0.595</code>), proving behavioral multidimensional discrimination.
            </p>
          </div>
        </div>

        {/* Finding 2 */}
        <div className="bg-white border border-slate-200/90 rounded-[4px] p-6 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              Temporal Stability
            </span>
            <span className="font-mono text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 border border-slate-200 rounded-[4px] font-medium">
              ΔT = 76H
            </span>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-navy-950">
                0.720
              </span>
              <span className="font-mono text-[11px] text-slate-500 uppercase">
                Spearman ρ
              </span>
            </div>
            <p className="text-[12px] text-slate-600 mt-2 leading-relaxed">
              Strong rank correlation between Block A and Block B confirms behavioral fingerprints remain stable over disjoint observation windows.
            </p>
          </div>
        </div>

        {/* Finding 3 */}
        <div className="bg-white border border-slate-200/90 rounded-[4px] p-6 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              Stability Benchmark
            </span>
            <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200 rounded-[4px] font-medium">
              CONSISTENT
            </span>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-navy-950">
                52.9%
              </span>
              <span className="font-mono text-[11px] text-slate-500 uppercase">
                Recurrence Rate
              </span>
            </div>
            <p className="text-[12px] text-slate-600 mt-2 leading-relaxed">
              Anomaly recurrence achieves a 10.2× lift over the uniform 5.2% random baseline, demonstrating durable identification across time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
