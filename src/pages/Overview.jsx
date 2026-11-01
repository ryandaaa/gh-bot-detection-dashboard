import React from 'react';
import { ArrowRight, CheckCircle2, TrendingUp, Clock, ShieldCheck } from 'lucide-react';

export default function Overview({ onOpenAnalyzeModal }) {
  // Cluster distribution percentages based on models/cluster_profiles.json
  const clusterData = [
    { id: 1, name: 'Cluster 1: Push Focused', pct: 39.5, color: '#64748b' },
    { id: 5, name: 'Cluster 5: Push & Create', pct: 19.6, color: '#7c3aed' },
    { id: 2, name: 'Cluster 2: Multi-Repo Push', pct: 18.0, color: '#0f172a' },
    { id: 6, name: 'Cluster 6: 24/7 High Vol', pct: 12.7, color: '#059669' },
    { id: 0, name: 'Cluster 0: Burst Pushers', pct: 6.3, color: '#2563eb' },
    { id: 3, name: 'Cluster 3: Automated CI', pct: 3.5, color: '#dc2626' },
    { id: 4, name: 'Cluster 4: Tooling Bots', pct: 0.4, color: '#d97706' },
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-margin py-space-lg space-y-space-lg">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-semibold">
            Overview
          </h1>
          <p className="font-body-md text-body-md text-secondary mt-1">
            A behavioral analysis of GitHub activities using anomaly detection and unsupervised machine learning.
          </p>
        </div>
        <div className="flex items-center gap-space-sm self-start sm:self-center">
          <button
            onClick={onOpenAnalyzeModal}
            className="inline-flex items-center gap-2 bg-primary text-on-primary hover:bg-primary-container px-4 py-2 rounded-lg font-label-md text-label-md transition-all shadow-sm active:scale-95"
            type="button"
          >
            <span>Analyze an account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Verified Metrics Bar (4 Cards with Real Data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        {/* Card 1: Total Events */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl flex flex-col justify-between shadow-sm border border-border-subtle/70">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-secondary uppercase tracking-wider font-semibold">
              Events Ingested
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <div className="mt-space-sm flex items-baseline gap-2">
            <span className="font-metric-display text-metric-display text-on-surface tracking-tight font-bold">
              9.88M
            </span>
            <span className="font-code-sm text-code-sm text-secondary">GH Archive</span>
          </div>
        </div>

        {/* Card 2: Modeled Accounts */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl flex flex-col justify-between shadow-sm border border-border-subtle/70">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-secondary uppercase tracking-wider font-semibold">
              Modeled Accounts
            </span>
            <span className="font-code-sm text-code-sm px-1.5 py-0.5 rounded bg-surface-container text-secondary">
              239.6K Raw
            </span>
          </div>
          <div className="mt-space-sm flex items-baseline gap-2">
            <span className="font-metric-display text-metric-display text-on-surface tracking-tight font-bold">
              44.2K
            </span>
            <span className="font-code-sm text-code-sm text-secondary">Feature Vectors</span>
          </div>
        </div>

        {/* Card 3: Anomaly Candidates */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl flex flex-col justify-between shadow-sm border border-border-subtle/70">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-secondary uppercase tracking-wider font-semibold">
              Anomaly Candidates
            </span>
            <span className="px-1.5 py-0.5 rounded text-accent-anomaly bg-rose-50 border border-rose-200 font-code-sm text-code-sm font-semibold">
              Top 5%
            </span>
          </div>
          <div className="mt-space-sm flex items-baseline gap-2">
            <span className="font-metric-display text-metric-display text-accent-anomaly tracking-tight font-bold">
              2,210
            </span>
            <span className="font-code-sm text-code-sm text-secondary">(τ ≥ 0.5514)</span>
          </div>
        </div>

        {/* Card 4: Clusters */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl flex flex-col justify-between shadow-sm border border-border-subtle/70">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-secondary uppercase tracking-wider font-semibold">
              Behavioral Clusters
            </span>
            <span className="font-code-sm text-code-sm px-1.5 py-0.5 rounded bg-surface-container text-secondary">
              k = 7
            </span>
          </div>
          <div className="mt-space-sm flex items-baseline gap-2">
            <span className="font-metric-display text-metric-display text-on-surface tracking-tight font-bold">
              7
            </span>
            <span className="font-code-sm text-code-sm text-secondary">Archetypes</span>
          </div>
        </div>
      </div>

      {/* Main Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
        {/* Card 1: Anomaly Score Distribution */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl flex flex-col justify-between shadow-sm border border-border-subtle/70">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Anomaly Score Distribution
              </h2>
              <span className="font-code-sm text-code-sm px-2 py-0.5 rounded bg-surface-muted text-secondary border border-border-subtle">
                Isolation Forest
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-secondary mt-1">
              Density curve of calculated isolation forest scores across 44.2K feature vectors
            </p>
          </div>

          <div className="mt-space-lg relative w-full">
            {/* Density Plot SVG */}
            <div className="w-full h-56 relative">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 200">
                <defs>
                  <linearGradient id="curveGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                {/* Horizontal grid guides */}
                <line stroke="#e5e7eb" strokeWidth="1" x1="0" x2="500" y1="180" y2="180" />
                <line stroke="#e5e7eb" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="500" y1="120" y2="120" />
                <line stroke="#e5e7eb" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="500" y1="60" y2="60" />

                {/* Right-skewed distribution fill and outline */}
                <path
                  d="M 0 180 
                     C 30 180, 50 160, 70 90 
                     C 90 20, 110 15, 130 35 
                     C 160 65, 180 120, 230 155 
                     C 275 168, 320 174, 380 178 
                     C 430 179.5, 470 179.8, 500 180 
                     L 500 180 L 0 180 Z"
                  fill="url(#curveGradient)"
                />
                <path
                  d="M 0 180 
                     C 30 180, 50 160, 70 90 
                     C 90 20, 110 15, 130 35 
                     C 160 65, 180 120, 230 155 
                     C 275 168, 320 174, 380 178 
                     C 430 179.5, 470 179.8, 500 180"
                  fill="none"
                  stroke="#151c25"
                  strokeWidth="2"
                />

                {/* Anomaly cutoff threshold indicator at τ = 0.5514 (x = 275) */}
                <line
                  stroke="#dc2626"
                  strokeDasharray="4 3"
                  strokeWidth="1.5"
                  x1="275"
                  x2="275"
                  y1="20"
                  y2="180"
                />
                <text className="font-code-sm text-[11px] font-semibold" fill="#dc2626" x="282" y="32">
                  Cutoff τ = 0.5514 (Top 5%)
                </text>
              </svg>
            </div>
            {/* X-Axis Labels */}
            <div className="flex justify-between items-center text-secondary font-code-sm text-code-sm pt-2">
              <span>0.0 (Normal)</span>
              <span>0.2</span>
              <span>0.4</span>
              <span>0.6</span>
              <span>0.8</span>
              <span>1.0 (Anomaly)</span>
            </div>
          </div>
        </div>

        {/* Card 2: Cluster Distribution */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl flex flex-col justify-between shadow-sm border border-border-subtle/70">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Cluster Distribution
              </h2>
              <span className="font-code-sm text-code-sm px-2 py-0.5 rounded bg-surface-muted text-secondary border border-border-subtle">
                K-Means (k=7)
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-secondary mt-1">
              Behavioral clustering breakdown using 11-dimensional feature space
            </p>
          </div>

          <div className="mt-space-lg flex flex-col sm:flex-row items-center justify-around gap-space-lg py-2">
            {/* Donut SVG */}
            <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                {/* Total circumference: 2 * PI * 60 = 376.99 */}
                {/* Cluster 1: 39.5% -> 148.9 */}
                <circle
                  className="transition-all duration-300 hover:opacity-80"
                  cx="80"
                  cy="80"
                  fill="transparent"
                  r="60"
                  stroke="#64748b"
                  strokeDasharray="148.9 376.99"
                  strokeDashoffset="0"
                  strokeWidth="20"
                />
                {/* Cluster 5: 19.6% -> 73.89 */}
                <circle
                  className="transition-all duration-300 hover:opacity-80"
                  cx="80"
                  cy="80"
                  fill="transparent"
                  r="60"
                  stroke="#7c3aed"
                  strokeDasharray="73.89 376.99"
                  strokeDashoffset="-148.9"
                  strokeWidth="20"
                />
                {/* Cluster 2: 18.0% -> 67.86 */}
                <circle
                  className="transition-all duration-300 hover:opacity-80"
                  cx="80"
                  cy="80"
                  fill="transparent"
                  r="60"
                  stroke="#0f172a"
                  strokeDasharray="67.86 376.99"
                  strokeDashoffset="-222.79"
                  strokeWidth="20"
                />
                {/* Cluster 6: 12.7% -> 47.88 */}
                <circle
                  className="transition-all duration-300 hover:opacity-80"
                  cx="80"
                  cy="80"
                  fill="transparent"
                  r="60"
                  stroke="#059669"
                  strokeDasharray="47.88 376.99"
                  strokeDashoffset="-290.65"
                  strokeWidth="20"
                />
                {/* Cluster 0: 6.3% -> 23.75 */}
                <circle
                  className="transition-all duration-300 hover:opacity-80"
                  cx="80"
                  cy="80"
                  fill="transparent"
                  r="60"
                  stroke="#2563eb"
                  strokeDasharray="23.75 376.99"
                  strokeDashoffset="-338.53"
                  strokeWidth="20"
                />
                {/* Cluster 3: 3.5% -> 13.19 */}
                <circle
                  className="transition-all duration-300 hover:opacity-80"
                  cx="80"
                  cy="80"
                  fill="transparent"
                  r="60"
                  stroke="#dc2626"
                  strokeDasharray="13.19 376.99"
                  strokeDashoffset="-362.28"
                  strokeWidth="20"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="font-metric-display text-3xl font-bold text-on-surface leading-none">
                  7
                </span>
                <span className="font-label-sm text-[11px] text-secondary mt-1">Clusters</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-2 w-full max-w-[240px]">
              {clusterData.slice(0, 5).map((cl) => (
                <div key={cl.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cl.color }}
                    />
                    <span className="font-body-sm text-on-surface truncate">{cl.name}</span>
                  </div>
                  <span className="font-code-md text-secondary font-medium ml-2">{cl.pct}%</span>
                </div>
              ))}
              <div className="pt-1 border-t border-border-subtle flex justify-between text-[11px] text-secondary">
                <span>CI & Tooling Bots (C3, C4)</span>
                <span className="font-code-md font-semibold text-rose-600">3.9%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Key Findings Summary */}
      <div className="pt-space-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          {/* Finding 1 */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-border-subtle/70">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-secondary uppercase tracking-wider font-semibold">
                Evaluation Performance
              </span>
              <TrendingUp className="w-4 h-4 text-accent-cluster-1" />
            </div>
            <div className="mt-space-md">
              <div className="flex items-baseline gap-2">
                <span className="font-metric-display text-metric-display text-on-surface font-bold">
                  0.781
                </span>
                <span className="font-label-md text-label-md text-secondary font-semibold">
                  ROC-AUC
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-secondary mt-1">
                Substantial lift over the single-dimension volume baseline (<code className="font-code-sm">0.595</code>), proving multi-feature behavioral discrimination.
              </p>
            </div>
          </div>

          {/* Finding 2 */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-border-subtle/70">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-secondary uppercase tracking-wider font-semibold">
                Temporal Stability
              </span>
              <Clock className="w-4 h-4 text-accent-cluster-2" />
            </div>
            <div className="mt-space-md">
              <div className="flex items-baseline gap-2">
                <span className="font-metric-display text-metric-display text-on-surface font-bold">
                  0.720
                </span>
                <span className="font-label-md text-label-md text-secondary font-semibold">
                  Spearman ρ
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-secondary mt-1">
                Strong rank correlation between Block A and Block B confirms behavioral fingerprints persist over time.
              </p>
            </div>
          </div>

          {/* Finding 3 */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-border-subtle/70">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-secondary uppercase tracking-wider font-semibold">
                Stability Grade
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-emerald-700 bg-emerald-50 border border-emerald-200 font-label-sm text-label-sm font-semibold">
                Consistent
              </span>
            </div>
            <div className="mt-space-md">
              <div className="flex items-baseline gap-2">
                <span className="font-metric-display text-metric-display text-on-surface font-bold">
                  Stable
                </span>
                <span className="font-code-sm text-code-sm text-secondary">Across Windows</span>
              </div>
              <p className="font-body-sm text-body-sm text-secondary mt-1">
                Recurrence rate reaches 52.9% (10.2× lift over the 5.2% uniform random baseline) across disjoint observation windows.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
