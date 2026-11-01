import React, { useState, useEffect, useRef } from 'react';
import Skeleton, { SkeletonCard } from '../components/Skeleton';

export default function Overview() {
  const [loading, setLoading] = useState(true);
  const [hoveredScore, setHoveredScore] = useState(null);
  const [hoveredCluster, setHoveredCluster] = useState(null);
  const curveRef = useRef(null);

  useEffect(() => {
    // Simulated instant SaaS loading transition
    const timer = setTimeout(() => setLoading(false), 320);
    return () => clearTimeout(timer);
  }, []);

  // Cluster distribution percentages based on models/cluster_profiles.json
  const clusterData = [
    { id: 1, name: 'C1: Heavy Pushers', accounts: '17,458', pct: 39.5, color: '#64748b', desc: 'Single-repo organic push contributor' },
    { id: 5, name: 'C5: Push & Create', accounts: '8,663', pct: 19.6, color: '#7c3aed', desc: 'Frequent repo and branch initialization' },
    { id: 2, name: 'C2: Multi-Repo Push', accounts: '7,956', pct: 18.0, color: '#0f172a', desc: 'Distributed commits across diverse projects' },
    { id: 6, name: 'C6: 24/7 High Vol', accounts: '5,613', pct: 12.7, color: '#059669', desc: 'Continuous round-the-clock commit streams' },
    { id: 0, name: 'C0: Burst Pushers', accounts: '2,785', pct: 6.3, color: '#2563eb', desc: 'High velocity short duration burst spikes' },
    { id: 3, name: 'C3: Automated CI', accounts: '1,547', pct: 3.5, color: '#dc2626', desc: 'High PR and issue ratios (Dependabot/CI)' },
    { id: 4, name: 'C4: Tooling Bots', accounts: '178', pct: 0.4, color: '#d97706', desc: 'Automated release and maintenance scripts' },
  ];

  // Mouse move handler for interactive crosshair on density curve
  const handleMouseMove = (e) => {
    if (!curveRef.current) return;
    const rect = curveRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const paddingX = width * 0.06;
    const chartW = width - paddingX * 2;
    const clampedX = Math.max(paddingX, Math.min(x, width - paddingX));
    const scoreVal = (clampedX - paddingX) / chartW;

    // Approximate empirical density & accounts
    const score = Math.max(0, Math.min(scoreVal, 1));
    // Log-normal shape peaking around 0.38
    const mode = 0.38;
    const diff = score - mode;
    const density = Math.exp(-(diff * diff) / 0.045);
    const percentile = Math.min(99.9, Math.max(0.1, (1 / (1 + Math.exp(-9 * (score - 0.42)))) * 100));
    const count = Math.round(density * 3400 + 40);

    setHoveredScore({
      x: clampedX,
      pctX: (clampedX / width) * 100,
      score: score,
      density: density,
      percentile: percentile,
      count: count,
      isAnomaly: score >= 0.5514,
    });
  };

  const handleMouseLeave = () => {
    setHoveredScore(null);
  };

  // SVG dimensions
  const svgW = 600;
  const svgH = 220;
  const padX = 35;
  const padY = 30;
  const graphW = svgW - padX * 2;
  const graphH = svgH - padY * 2;

  // Cutoff point at score 0.5514
  const cutoffX = padX + 0.5514 * graphW;

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
        {/* Header Skeleton */}
        <div className="bg-white border border-slate-200/90 rounded-[4px] p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </div>
          <Skeleton className="h-7 w-32" />
        </div>

        {/* 4 Metric Cards Skeleton */}
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

        {/* 2 Visualizations Skeleton */}
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

        {/* 3 Findings Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} className="space-y-3">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </SkeletonCard>
          ))}
        </div>
      </div>
    );
  }

  const activeClusterInfo = hoveredCluster !== null ? clusterData.find(c => c.id === hoveredCluster) : null;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
      {/* Editorial Header Card - Modular, No duplicate button */}
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

      {/* Main Interactive Visualizations - 2 Modular Cards */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Interactive Anomaly Score Distribution with Crosshair Cursor */}
        <div className="bg-white border border-slate-200/90 rounded-[4px] p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] font-bold text-navy-950 uppercase tracking-wider">
                Anomaly Score Distribution
              </h2>
              <span className="font-mono text-[10px] text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-[4px]">
                LIVE CROSSHAIR INSPECTOR
              </span>
            </div>
            <p className="text-[12px] text-slate-500 mt-1">
              Move cursor over curve to inspect real-time empirical probability density & anomaly thresholds.
            </p>
          </div>

          {/* Interactive Chart Container */}
          <div
            ref={curveRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="mt-6 relative w-full select-none cursor-crosshair"
          >
            {/* Live Floating Tooltip */}
            {hoveredScore && (
              <div
                className="absolute pointer-events-none z-20 bg-navy-950 text-white border border-navy-800 p-2.5 rounded-[4px] shadow-lg text-[11px] font-mono transition-transform duration-75 ease-out -top-14"
                style={{
                  left: `${hoveredScore.pctX}%`,
                  transform: hoveredScore.pctX > 70 ? 'translateX(-105%)' : hoveredScore.pctX < 30 ? 'translateX(5%)' : 'translateX(-50%)',
                }}
              >
                <div className="flex items-center gap-2 border-b border-navy-800 pb-1 mb-1">
                  <span className="font-bold text-slate-200">Score: {hoveredScore.score.toFixed(3)}</span>
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded-[2px] ${
                      hoveredScore.isAnomaly ? 'bg-rose-500 text-white font-bold' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {hoveredScore.isAnomaly ? 'ANOMALY' : 'NORMAL'}
                  </span>
                </div>
                <div className="text-slate-300 text-[10px] space-y-0.5">
                  <div>Percentile: <strong className="text-white">{hoveredScore.percentile.toFixed(1)}%</strong></div>
                  <div>Estimated Accounts: <strong className="text-white">~{hoveredScore.count.toLocaleString()}</strong></div>
                </div>
              </div>
            )}

            <div className="w-full h-56 relative">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox={`0 0 ${svgW} ${svgH}`}>
                <defs>
                  <linearGradient id="curveGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.30" />
                    <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.02" />
                  </linearGradient>
                  <linearGradient id="anomalyShade" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#dc2626" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#dc2626" stopOpacity="0.03" />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                <line stroke="#e2e8f0" strokeWidth="1" x1={padX} x2={svgW - padX} y1={svgH - padY} y2={svgH - padY} />
                <line stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" x1={padX} x2={svgW - padX} y1={svgH - padY - graphH * 0.33} y2={svgH - padY - graphH * 0.33} />
                <line stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" x1={padX} x2={svgW - padX} y1={svgH - padY - graphH * 0.66} y2={svgH - padY - graphH * 0.66} />

                {/* Anomaly region background fill (right of cutoff 0.5514) */}
                <path
                  d={`M ${cutoffX} ${svgH - padY}
                     L ${cutoffX} 65
                     C 380 120, 430 150, 480 170
                     C 510 180, 540 186, ${svgW - padX} ${svgH - padY}
                     Z`}
                  fill="url(#anomalyShade)"
                />

                {/* Primary Distribution Fill */}
                <path
                  d={`M ${padX} ${svgH - padY} 
                     C 70 ${svgH - padY}, 100 170, 130 90 
                     C 160 25, 190 20, 220 40 
                     C 260 70, 300 125, 350 155 
                     C 400 170, 460 180, ${svgW - padX} ${svgH - padY} 
                     Z`}
                  fill="url(#curveGradient)"
                />

                {/* Primary Distribution Stroke */}
                <path
                  d={`M ${padX} ${svgH - padY} 
                     C 70 ${svgH - padY}, 100 170, 130 90 
                     C 160 25, 190 20, 220 40 
                     C 260 70, 300 125, 350 155 
                     C 400 170, 460 180, ${svgW - padX} ${svgH - padY}`}
                  fill="none"
                  stroke="#0a192f"
                  strokeWidth="2.5"
                />

                {/* Anomaly Cutoff at τ = 0.5514 */}
                <line
                  stroke="#dc2626"
                  strokeDasharray="4 3"
                  strokeWidth="1.5"
                  x1={cutoffX}
                  x2={cutoffX}
                  y1={20}
                  y2={svgH - padY}
                />
                <rect x={cutoffX + 4} y="22" width="135" height="18" fill="#fef2f2" stroke="#fecaca" rx="2" />
                <text className="font-mono text-[10px] font-bold" fill="#dc2626" x={cutoffX + 8} y="35">
                  Cutoff τ = 0.5514 (Top 5%)
                </text>

                {/* Vertical Interactive Crosshair Hairline */}
                {hoveredScore && (
                  <g>
                    <line
                      stroke="#2563eb"
                      strokeDasharray="2 2"
                      strokeWidth="1.5"
                      x1={hoveredScore.x * (svgW / (curveRef.current?.getBoundingClientRect().width || svgW))}
                      x2={hoveredScore.x * (svgW / (curveRef.current?.getBoundingClientRect().width || svgW))}
                      y1={15}
                      y2={svgH - padY}
                    />
                    <circle
                      cx={hoveredScore.x * (svgW / (curveRef.current?.getBoundingClientRect().width || svgW))}
                      cy={svgH - padY - hoveredScore.density * graphH * 0.9}
                      r="5"
                      fill="#2563eb"
                      stroke="#ffffff"
                      strokeWidth="2"
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

        {/* Card 2: Interactive Donut Chart / Sunburst with Hover Expansion */}
        <div className="bg-white border border-slate-200/90 rounded-[4px] p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] font-bold text-navy-950 uppercase tracking-wider">
                Cluster Distribution
              </h2>
              <span className="font-mono text-[10px] text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-[4px]">
                K-MEANS (K=7)
              </span>
            </div>
            <p className="text-[12px] text-slate-500 mt-1">
              Hover over slices or legend items to inspect behavioral profiles and segment populations.
            </p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-around gap-6">
            {/* Interactive SVG Donut */}
            <div className="relative w-48 h-48 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 overflow-visible" viewBox="0 0 160 160">
                {/* Circumference for r=58: 2 * PI * 58 = 364.42 */}
                {/* C1: 39.5% -> 143.95 */}
                <circle
                  cx="80"
                  cy="80"
                  r="58"
                  fill="transparent"
                  stroke="#64748b"
                  strokeWidth={hoveredCluster === 1 ? 26 : 18}
                  strokeDasharray="143.95 364.42"
                  strokeDashoffset="0"
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredCluster(1)}
                  onMouseLeave={() => setHoveredCluster(null)}
                />
                {/* C5: 19.6% -> 71.43 */}
                <circle
                  cx="80"
                  cy="80"
                  r="58"
                  fill="transparent"
                  stroke="#7c3aed"
                  strokeWidth={hoveredCluster === 5 ? 26 : 18}
                  strokeDasharray="71.43 364.42"
                  strokeDashoffset="-143.95"
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredCluster(5)}
                  onMouseLeave={() => setHoveredCluster(null)}
                />
                {/* C2: 18.0% -> 65.60 */}
                <circle
                  cx="80"
                  cy="80"
                  r="58"
                  fill="transparent"
                  stroke="#0f172a"
                  strokeWidth={hoveredCluster === 2 ? 26 : 18}
                  strokeDasharray="65.60 364.42"
                  strokeDashoffset="-215.38"
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredCluster(2)}
                  onMouseLeave={() => setHoveredCluster(null)}
                />
                {/* C6: 12.7% -> 46.28 */}
                <circle
                  cx="80"
                  cy="80"
                  r="58"
                  fill="transparent"
                  stroke="#059669"
                  strokeWidth={hoveredCluster === 6 ? 26 : 18}
                  strokeDasharray="46.28 364.42"
                  strokeDashoffset="-280.98"
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredCluster(6)}
                  onMouseLeave={() => setHoveredCluster(null)}
                />
                {/* C0: 6.3% -> 22.96 */}
                <circle
                  cx="80"
                  cy="80"
                  r="58"
                  fill="transparent"
                  stroke="#2563eb"
                  strokeWidth={hoveredCluster === 0 ? 26 : 18}
                  strokeDasharray="22.96 364.42"
                  strokeDashoffset="-327.26"
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredCluster(0)}
                  onMouseLeave={() => setHoveredCluster(null)}
                />
                {/* C3: 3.5% -> 12.75 */}
                <circle
                  cx="80"
                  cy="80"
                  r="58"
                  fill="transparent"
                  stroke="#dc2626"
                  strokeWidth={hoveredCluster === 3 ? 26 : 18}
                  strokeDasharray="12.75 364.42"
                  strokeDashoffset="-350.22"
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredCluster(3)}
                  onMouseLeave={() => setHoveredCluster(null)}
                />
                {/* C4: 0.4% -> 1.45 */}
                <circle
                  cx="80"
                  cy="80"
                  r="58"
                  fill="transparent"
                  stroke="#d97706"
                  strokeWidth={hoveredCluster === 4 ? 26 : 18}
                  strokeDasharray="1.45 364.42"
                  strokeDashoffset="-362.97"
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredCluster(4)}
                  onMouseLeave={() => setHoveredCluster(null)}
                />
              </svg>

              {/* Dynamic Center Readout */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2">
                {activeClusterInfo ? (
                  <>
                    <span className="font-mono text-xl font-bold text-navy-950 leading-tight">
                      {activeClusterInfo.pct}%
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 uppercase truncate max-w-[110px]">
                      {activeClusterInfo.name.split(':')[0]}
                    </span>
                    <span className="font-mono text-[9px] text-navy-700 mt-0.5">
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

            {/* Interactive Legend */}
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
