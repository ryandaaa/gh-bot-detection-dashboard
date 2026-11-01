import React from 'react';
import {
  TrendingUp,
  Clock,
  Database,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function Evaluation() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-margin py-space-xl flex flex-col gap-space-xl">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-md">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-semibold">
            Model Evaluation
          </h1>
          <p className="font-body-md text-body-md text-secondary mt-1 max-w-2xl">
            Empirical performance, temporal stability across disjoint blocks, and high-performance MongoDB query execution benchmarks.
          </p>
        </div>
        <div className="flex items-center gap-space-sm self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-code-sm text-code-sm font-semibold border border-emerald-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Benchmark Verified: Block A / B
          </span>
        </div>
      </div>

      {/* Section 1: Model Performance & ROC Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-stretch">
        {/* Left Column: Metrics & Evaluation Matrix */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-space-lg">
          {/* Metric Callouts */}
          <div className="grid grid-cols-2 gap-space-md">
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-border-subtle flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">
                    ROC-AUC
                  </span>
                  <span className="font-code-sm text-code-sm px-1.5 py-0.5 rounded bg-blue-50 text-accent-cluster-1 font-bold border border-blue-200">
                    +36.0% Lift
                  </span>
                </div>
                <div className="font-metric-display text-3xl sm:text-4xl text-on-surface mt-2 tracking-tight font-bold">
                  0.809
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-secondary mt-2">
                Isolation Forest vs. <code className="font-code-sm">0.595</code> Volume Baseline
              </p>
            </div>

            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-border-subtle flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">
                    PR-AUC
                  </span>
                  <span className="font-code-sm text-code-sm px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    +153% Lift
                  </span>
                </div>
                <div className="font-metric-display text-3xl sm:text-4xl text-on-surface mt-2 tracking-tight font-bold">
                  0.301
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-secondary mt-2">
                Precision-Recall Area under curve (imbalanced positive class)
              </p>
            </div>
          </div>

          {/* Comparison Matrix Panel */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-border-subtle flex flex-col justify-between flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Model Discrimination Matrix
                </h2>
                <p className="font-body-sm text-body-sm text-secondary">
                  Supervised evaluation on labeled empirical and curated anomalies.
                </p>
              </div>
              <BarChart3 className="w-5 h-5 text-secondary" />
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-muted text-on-surface-variant font-label-md text-label-md uppercase tracking-wider border-b border-border-subtle">
                    <th className="py-2.5 px-3 font-semibold">Method</th>
                    <th className="py-2.5 px-3 font-semibold text-right">ROC-AUC ↑</th>
                    <th className="py-2.5 px-3 font-semibold text-right">PR-AUC ↑</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Cohen's κ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle/50 text-on-surface font-body-sm text-body-sm">
                  <tr className="bg-surface-container-low/40 hover:bg-surface-hover transition-colors font-medium">
                    <td className="py-3 px-3 flex items-center gap-2">
                      <span className="w-2.5 h-1 bg-primary rounded-full inline-block"></span>
                      <span>Isolation Forest</span>
                      <span className="px-1.5 py-0.2 rounded bg-primary/10 text-primary font-code-sm text-xs font-semibold">
                        Proposed
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-code-md text-code-md font-bold text-on-surface">
                      0.809
                    </td>
                    <td className="py-3 px-3 text-right font-code-md text-code-md font-bold text-on-surface">
                      0.301
                    </td>
                    <td className="py-3 px-3 text-right font-code-md text-code-md font-semibold text-emerald-600">
                      0.684
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-hover transition-colors text-secondary">
                    <td className="py-3 px-3 flex items-center gap-2">
                      <span className="w-2.5 h-1 bg-secondary-fixed-dim rounded-full inline-block"></span>
                      <span>Volume Baseline (Log n)</span>
                    </td>
                    <td className="py-3 px-3 text-right font-code-md text-code-md">0.595</td>
                    <td className="py-3 px-3 text-right font-code-md text-code-md">0.119</td>
                    <td className="py-3 px-3 text-right font-code-md text-code-md">0.245</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-3 border-t border-border-subtle flex items-center gap-2 font-code-sm text-code-sm text-secondary">
              <AlertCircle className="w-4 h-4 text-accent-cluster-1 shrink-0" />
              <span>Evaluated over 239.6K feature vectors from 152 observation hours across 2 discrete time blocks.</span>
            </div>
          </div>
        </div>

        {/* Right Column: ROC Curve Visualizer Panel */}
        <div className="lg:col-span-6 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-border-subtle flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                ROC Curve Comparison
              </h2>
              <p className="font-body-sm text-body-sm text-secondary">
                Trade-off between true positive rate (TPR) and false positive rate (FPR)
              </p>
            </div>
            {/* Chart Legend */}
            <div className="flex flex-col gap-1 text-right self-start sm:self-auto text-xs">
              <div className="flex items-center justify-end gap-2">
                <span className="w-3.5 h-[2.5px] bg-primary inline-block"></span>
                <span className="font-medium text-on-surface">
                  Isolation Forest <span className="font-code-sm text-secondary">(AUC = 0.809)</span>
                </span>
              </div>
              <div className="flex items-center justify-end gap-2">
                <span className="w-3.5 h-[2px] bg-secondary-fixed-dim border-b border-dashed border-secondary inline-block"></span>
                <span className="text-secondary">
                  Volume baseline <span className="font-code-sm text-secondary">(AUC = 0.595)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Scaled High Fidelity SVG ROC Chart */}
          <div className="w-full relative py-2">
            <svg aria-label="ROC Chart" className="w-full h-auto overflow-visible select-none" viewBox="0 0 460 280">
              <defs>
                <pattern id="grid-roc" width="70" height="42" patternUnits="userSpaceOnUse">
                  <path d="M 70 0 L 0 0 0 42" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                </pattern>
              </defs>
              <rect x="50" y="20" width="350" height="210" fill="url(#grid-roc)" />

              {/* Axis base lines */}
              <line x1="50" y1="230" x2="400" y2="230" stroke="#d1d5db" strokeWidth="1.2" />
              <line x1="50" y1="20" x2="50" y2="230" stroke="#d1d5db" strokeWidth="1.2" />

              {/* Y Axis Labels */}
              <g className="font-code-sm text-[11px] fill-secondary" textAnchor="end">
                <text x="42" y="234">0.0</text>
                <text x="42" y="192">0.2</text>
                <text x="42" y="150">0.4</text>
                <text x="42" y="108">0.6</text>
                <text x="42" y="66">0.8</text>
                <text x="42" y="24">1.0</text>
              </g>

              {/* X Axis Labels */}
              <g className="font-code-sm text-[11px] fill-secondary" textAnchor="middle">
                <text x="50" y="248">0.0</text>
                <text x="120" y="248">0.2</text>
                <text x="190" y="248">0.4</text>
                <text x="260" y="248">0.6</text>
                <text x="330" y="248">0.8</text>
                <text x="400" y="248">1.0</text>
              </g>

              {/* Axis Titles */}
              <text x="225" y="272" textAnchor="middle" className="font-label-sm text-[11px] fill-secondary tracking-wider uppercase font-semibold">
                False Positive Rate (FPR)
              </text>
              <text
                x="-125"
                y="18"
                transform="rotate(-90)"
                textAnchor="middle"
                className="font-label-sm text-[11px] fill-secondary tracking-wider uppercase font-semibold"
              >
                True Positive Rate (TPR)
              </text>

              {/* Diagonal Baseline (Random Guessing AUC 0.5) */}
              <line x1="50" y1="230" x2="400" y2="20" stroke="#9ca3af" strokeWidth="1" strokeDasharray="3 3" />

              {/* Curve 2: Volume baseline (AUC 0.595) */}
              <path d="M 50 230 C 130 185, 230 115, 400 20" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 3" />

              {/* Curve 1 Area Fill subtle */}
              <path d="M 50 230 C 70 90, 140 40, 400 20 L 400 230 Z" fill="#2563eb" fillOpacity="0.05" />

              {/* Curve 1: Isolation Forest (AUC 0.809) */}
              <path d="M 50 230 C 70 90, 140 40, 400 20" fill="none" stroke="#151c25" strokeWidth="2.5" />

              {/* Key inspection point at τ = 0.5514 / FPR 0.17 */}
              <circle cx="110" cy="68" r="4.5" fill="#2563eb" />
              <line x1="110" y1="68" x2="110" y2="230" stroke="#2563eb" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="50" y1="68" x2="110" y2="68" stroke="#2563eb" strokeWidth="1" strokeDasharray="2 2" />

              {/* Tooltip Anchor */}
              <g transform="translate(125, 52)">
                <rect x="0" y="0" width="140" height="42" rx="6" fill="white" stroke="#d1d5db" strokeWidth="1" className="shadow-md" />
                <text x="10" y="17" className="font-code-sm text-[11px] fill-on-surface font-bold">TPR: 0.771</text>
                <text x="10" y="32" className="font-code-sm text-[10px] fill-secondary">FPR: 0.171 @ τ = 0.5514</text>
              </g>
            </svg>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
            <span className="font-body-sm text-body-sm text-secondary">
              Optimal Cutoff Threshold: <code className="font-code-sm text-on-surface font-semibold bg-surface-muted px-1.5 py-0.5 rounded">τ = 0.5514</code>
            </span>
            <span className="font-label-sm text-label-sm text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
              High Discrimination Lift
            </span>
          </div>
        </div>
      </div>

      {/* Section 2: Temporal Stability */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-border-subtle flex flex-col gap-space-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-space-xs border-b border-border-subtle">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              Temporal Stability & Inter-block Agreement
            </h2>
            <p className="font-body-sm text-body-sm text-secondary">
              Anomaly persistence evaluated across two disjoint 76-hour observation windows (Block A vs. Block B).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-surface-container text-on-surface font-code-sm text-code-sm font-semibold">
              Δt = 76 hours
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-space-lg items-center">
          {/* Metric 1: Spearman's rho */}
          <div className="md:col-span-3 flex flex-col justify-center bg-surface-muted p-space-md rounded-xl border border-border-subtle">
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">
              Spearman ρ
            </span>
            <div className="font-metric-display text-3xl font-bold text-on-surface mt-1">0.720</div>
            <p className="font-body-sm text-xs text-secondary mt-1">
              Rank correlation of anomaly scores between time slices
            </p>
          </div>

          {/* Metric 2: Recurrence Rate Display */}
          <div className="md:col-span-3 flex flex-col justify-center bg-surface-muted p-space-md rounded-xl border border-border-subtle">
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">
              Recurrence Rate
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-metric-display text-3xl font-bold text-on-surface">52.9%</span>
              <span className="font-code-sm text-xs text-secondary">(base: 5.2%)</span>
            </div>
            <p className="font-body-sm text-xs text-secondary mt-1">
              Candidate re-identification in subsequent observation window
            </p>
          </div>

          {/* Visual Comparison Bars */}
          <div className="md:col-span-6 flex flex-col justify-center gap-space-md pl-0 md:pl-space-md">
            {/* Bar 1: Anomaly recurrence */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center font-label-md text-label-md">
                <span className="font-medium text-on-surface flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  Anomaly Recurrence (Proposed IF Model)
                </span>
                <span className="font-code-md text-code-md font-bold text-on-surface">52.9%</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-3 overflow-hidden">
                <div className="bg-primary h-full rounded-full transition-all duration-700 ease-out" style={{ width: '52.9%' }}></div>
              </div>
            </div>

            {/* Bar 2: Random baseline */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center font-label-md text-label-md">
                <span className="text-secondary flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary-fixed-dim"></span>
                  Uniform Random Baseline
                </span>
                <span className="font-code-md text-code-md text-secondary">5.2%</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-3 overflow-hidden">
                <div className="bg-slate-300 h-full rounded-full transition-all duration-700 ease-out" style={{ width: '5.2%' }}></div>
              </div>
            </div>

            <p className="font-body-sm text-xs text-secondary leading-relaxed">
              The 10.2× lift over baseline confirms behavioral fingerprint durability across observation windows, demonstrating robust resilience against temporal variance and transient activity spikes.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Database Benchmark & Query Plans */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-border-subtle flex flex-col gap-space-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-space-xs border-b border-border-subtle">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Database Benchmark & Query Plans
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-label-sm text-label-sm font-bold border border-emerald-200">
                9.0x Faster Speedup
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-secondary mt-1">
              MongoDB Atlas cluster benchmark with compound index <code className="font-code-sm bg-surface-muted px-1 py-0.5 rounded text-on-surface font-semibold">&#123; account_id: 1, created_at: 1 &#125;</code>.
            </p>
          </div>
          <div className="flex items-center gap-space-xs font-code-sm text-code-sm text-secondary bg-surface-muted px-3 py-1.5 rounded-lg border border-border-subtle">
            <Database className="w-4 h-4 text-secondary" />
            <span>Atlas M30 · 8 vCPU · 16GB RAM</span>
          </div>
        </div>

        {/* Benchmark Execution Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-muted text-on-surface-variant font-label-md text-label-md uppercase tracking-wider border-b border-border-subtle">
                <th className="py-2.5 px-4 font-semibold">Query Window Range</th>
                <th className="py-2.5 px-4 font-semibold text-right">COLLSCAN (Unindexed)</th>
                <th className="py-2.5 px-4 font-semibold text-right">IXSCAN (Compound Index)</th>
                <th className="py-2.5 px-4 font-semibold text-right">Speedup Factor</th>
                <th className="py-2.5 px-4 font-semibold text-center">Execution Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50 text-on-surface font-body-sm text-body-sm">
              <tr className="hover:bg-surface-hover transition-colors">
                <td className="py-3.5 px-4 font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4 text-secondary" />
                  <span className="font-code-md">24 hours window</span>
                </td>
                <td className="py-3.5 px-4 text-right font-code-md text-secondary">8.42 s</td>
                <td className="py-3.5 px-4 text-right font-code-md font-bold text-emerald-600">0.93 s</td>
                <td className="py-3.5 px-4 text-right font-code-md font-bold text-on-surface">9.05×</td>
                <td className="py-3.5 px-4 text-center">
                  <div className="w-24 bg-surface-container rounded-full h-2 mx-auto overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: '11%' }}></div>
                  </div>
                </td>
              </tr>
              <tr className="bg-surface-container-low/20 hover:bg-surface-hover transition-colors">
                <td className="py-3.5 px-4 font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4 text-secondary" />
                  <span className="font-code-md">48 hours window</span>
                </td>
                <td className="py-3.5 px-4 text-right font-code-md text-secondary">17.66 s</td>
                <td className="py-3.5 px-4 text-right font-code-md font-bold text-emerald-600">2.11 s</td>
                <td className="py-3.5 px-4 text-right font-code-md font-bold text-on-surface">8.37×</td>
                <td className="py-3.5 px-4 text-center">
                  <div className="w-24 bg-surface-container rounded-full h-2 mx-auto overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: '12%' }}></div>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-surface-hover transition-colors">
                <td className="py-3.5 px-4 font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4 text-secondary" />
                  <span className="font-code-md">78 hours window</span>
                </td>
                <td className="py-3.5 px-4 text-right font-code-md text-secondary">31.70 s</td>
                <td className="py-3.5 px-4 text-right font-code-md font-bold text-emerald-600">3.25 s</td>
                <td className="py-3.5 px-4 text-right font-code-md font-bold text-on-surface">9.75×</td>
                <td className="py-3.5 px-4 text-center">
                  <div className="w-24 bg-surface-container rounded-full h-2 mx-auto overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Execution Plan Summary Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-2">
          <div className="bg-surface-muted p-space-sm rounded-xl border border-border-subtle flex items-center gap-space-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div className="font-body-sm text-xs">
              <span className="font-bold text-on-surface">COLLSCAN Stage:</span>
              <span className="text-secondary"> Scans 100% of event documents linearly with memory disk spilling at &gt;48 hours.</span>
            </div>
          </div>
          <div className="bg-surface-muted p-space-sm rounded-xl border border-border-subtle flex items-center gap-space-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="font-body-sm text-xs">
              <span className="font-bold text-on-surface">IXSCAN + FETCH Stage:</span>
              <span className="text-secondary"> Bounds queries using B-Tree index, reducing scanned doc ratio to 0.04% of total collection.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
