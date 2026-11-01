import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Overview({ onOpenAnalyzeModal }) {
  // Cluster distribution percentages based on models/cluster_profiles.json
  const clusterData = [
    { id: 1, name: 'C1: Push Focused', pct: 39.5, color: '#64748b' },
    { id: 5, name: 'C5: Push & Create', pct: 19.6, color: '#7c3aed' },
    { id: 2, name: 'C2: Multi-Repo Push', pct: 18.0, color: '#0f172a' },
    { id: 6, name: 'C6: 24/7 High Vol', pct: 12.7, color: '#059669' },
    { id: 0, name: 'C0: Burst Pushers', pct: 6.3, color: '#2563eb' },
    { id: 3, name: 'C3: Automated CI', pct: 3.5, color: '#dc2626' },
    { id: 4, name: 'C4: Tooling Bots', pct: 0.4, color: '#d97706' },
  ];

  return (
    <div className="w-full flex flex-col font-sans">
      {/* Top Editorial Header Bar - Full Bleed Edge-to-Edge */}
      <section className="px-6 py-5 border-b border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-navy-950 tracking-tight uppercase">
            System Overview
          </h1>
          <p className="text-[13px] text-slate-500 mt-0.5">
            Behavioral analysis of GitHub public activity streams using unsupervised machine learning and anomaly detection.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAnalyzeModal}
            className="inline-flex items-center gap-1.5 bg-navy-950 hover:bg-navy-900 text-white px-3.5 py-1.5 rounded text-[12px] font-medium transition-colors border border-navy-800"
            type="button"
          >
            <span>Analyze Account</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
          </button>
        </div>
      </section>

      {/* Metrics Strip - Hairline Divided Cells (No box-in-a-box) */}
      <section className="border-b border-slate-200 bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
        {/* Cell 1: Total Events */}
        <div className="p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              Events Ingested
            </span>
            <span className="font-mono text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 border border-slate-200 font-medium">
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

        {/* Cell 2: Modeled Accounts */}
        <div className="p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              Modeled Accounts
            </span>
            <span className="font-mono text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 border border-slate-200 font-medium">
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

        {/* Cell 3: Anomaly Candidates */}
        <div className="p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              Anomaly Candidates
            </span>
            <span className="font-mono text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 border border-rose-200">
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

        {/* Cell 4: Clusters */}
        <div className="p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              Behavioral Archetypes
            </span>
            <span className="font-mono text-[10px] text-navy-800 bg-navy-50 px-1.5 py-0.5 border border-navy-200 font-medium">
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

      {/* Main Visualizations - 2 Split Columns with Hairline Divider */}
      <section className="border-b border-slate-200 bg-white grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* Panel 1: Anomaly Score Distribution */}
        <div className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] font-bold text-navy-950 uppercase tracking-wider">
                Anomaly Score Distribution
              </h2>
              <span className="font-mono text-[10px] text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5">
                ISOLATION FOREST
              </span>
            </div>
            <p className="text-[12px] text-slate-500 mt-1">
              Empirical density curve of anomaly scores computed across 44.2K feature vectors.
            </p>
          </div>

          <div className="mt-6 relative w-full">
            <div className="w-full h-52 relative">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 200">
                <defs>
                  <linearGradient id="navyCurveGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.01" />
                  </linearGradient>
                </defs>
                {/* Hairline Grid Guides */}
                <line stroke="#e2e8f0" strokeWidth="1" x1="0" x2="500" y1="180" y2="180" />
                <line stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="500" y1="120" y2="120" />
                <line stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="500" y1="60" y2="60" />

                {/* Right-skewed distribution fill and outline */}
                <path
                  d="M 0 180 
                     C 30 180, 50 160, 70 90 
                     C 90 20, 110 15, 130 35 
                     C 160 65, 180 120, 230 155 
                     C 275 168, 320 174, 380 178 
                     C 430 179.5, 470 179.8, 500 180 
                     L 500 180 L 0 180 Z"
                  fill="url(#navyCurveGradient)"
                />
                <path
                  d="M 0 180 
                     C 30 180, 50 160, 70 90 
                     C 90 20, 110 15, 130 35 
                     C 160 65, 180 120, 230 155 
                     C 275 168, 320 174, 380 178 
                     C 430 179.5, 470 179.8, 500 180"
                  fill="none"
                  stroke="#0a192f"
                  strokeWidth="2"
                />

                {/* Anomaly Cutoff at τ = 0.5514 */}
                <line
                  stroke="#dc2626"
                  strokeDasharray="4 3"
                  strokeWidth="1.5"
                  x1="275"
                  x2="275"
                  y1="20"
                  y2="180"
                />
                <text className="font-mono text-[11px] font-semibold" fill="#dc2626" x="282" y="32">
                  Cutoff τ = 0.5514 (Top 5%)
                </text>
              </svg>
            </div>
            {/* Axis Labels */}
            <div className="flex justify-between items-center text-slate-500 font-mono text-[11px] pt-2">
              <span>0.0 (Normal)</span>
              <span>0.2</span>
              <span>0.4</span>
              <span>0.6</span>
              <span>0.8</span>
              <span>1.0 (Anomaly)</span>
            </div>
          </div>
        </div>

        {/* Panel 2: Cluster Distribution */}
        <div className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] font-bold text-navy-950 uppercase tracking-wider">
                Cluster Distribution
              </h2>
              <span className="font-mono text-[10px] text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5">
                K-MEANS (K=7)
              </span>
            </div>
            <p className="text-[12px] text-slate-500 mt-1">
              Behavioral clustering breakdown across 11 normalized feature dimensions.
            </p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-around gap-6">
            {/* Donut SVG */}
            <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  fill="transparent"
                  r="60"
                  stroke="#64748b"
                  strokeDasharray="148.9 376.99"
                  strokeDashoffset="0"
                  strokeWidth="18"
                />
                <circle
                  cx="80"
                  cy="80"
                  fill="transparent"
                  r="60"
                  stroke="#7c3aed"
                  strokeDasharray="73.89 376.99"
                  strokeDashoffset="-148.9"
                  strokeWidth="18"
                />
                <circle
                  cx="80"
                  cy="80"
                  fill="transparent"
                  r="60"
                  stroke="#0f172a"
                  strokeDasharray="67.86 376.99"
                  strokeDashoffset="-222.79"
                  strokeWidth="18"
                />
                <circle
                  cx="80"
                  cy="80"
                  fill="transparent"
                  r="60"
                  stroke="#059669"
                  strokeDasharray="47.88 376.99"
                  strokeDashoffset="-290.65"
                  strokeWidth="18"
                />
                <circle
                  cx="80"
                  cy="80"
                  fill="transparent"
                  r="60"
                  stroke="#2563eb"
                  strokeDasharray="23.75 376.99"
                  strokeDashoffset="-338.53"
                  strokeWidth="18"
                />
                <circle
                  cx="80"
                  cy="80"
                  fill="transparent"
                  r="60"
                  stroke="#dc2626"
                  strokeDasharray="13.19 376.99"
                  strokeDashoffset="-362.28"
                  strokeWidth="18"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="font-mono text-2xl font-bold text-navy-950 leading-none">
                  7
                </span>
                <span className="font-mono text-[10px] text-slate-500 uppercase mt-0.5">ARCHETYPES</span>
              </div>
            </div>

            {/* Legend - Minimal editorial table style */}
            <div className="flex flex-col gap-1.5 w-full max-w-[240px]">
              {clusterData.slice(0, 5).map((cl) => (
                <div key={cl.id} className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 shrink-0"
                      style={{ backgroundColor: cl.color }}
                    />
                    <span className="font-sans text-slate-800 truncate">{cl.name}</span>
                  </div>
                  <span className="font-mono text-slate-600 font-medium ml-2">{cl.pct}%</span>
                </div>
              ))}
              <div className="pt-1.5 border-t border-slate-200 flex justify-between text-[11px] text-slate-500 font-mono">
                <span>CI & Tooling (C3, C4)</span>
                <span className="font-bold text-rose-600">3.9%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Findings Section - Hairline Divided Columns (No box-in-a-box) */}
      <section className="border-b border-slate-200 bg-white grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
        {/* Finding 1 */}
        <div className="p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              Evaluation Performance
            </span>
            <span className="font-mono text-[10px] text-navy-700 bg-navy-50 px-1.5 py-0.5 border border-navy-200 font-medium">
              +36% LIFT
            </span>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-navy-950">
                0.781
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
        <div className="p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              Temporal Stability
            </span>
            <span className="font-mono text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 border border-slate-200 font-medium">
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
        <div className="p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              Stability Benchmark
            </span>
            <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200 font-medium">
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
