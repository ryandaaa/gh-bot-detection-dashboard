import React from 'react';

export default function Evaluation() {
  return (
    <div className="w-full flex flex-col font-sans">
      {/* Editorial Header Bar - Full Bleed Edge-to-Edge */}
      <section className="px-6 py-5 border-b border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-navy-950 tracking-tight uppercase">
            Model Evaluation
          </h1>
          <p className="text-[13px] text-slate-500 mt-0.5">
            Empirical discrimination benchmarks, temporal stability across disjoint observation blocks, and MongoDB query execution latency.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 uppercase tracking-wider">
            BENCHMARK VERIFIED: BLOCK A / B
          </span>
        </div>
      </section>

      {/* Section 1: Model Performance & ROC Visualizations - Split 2 Columns */}
      <section className="border-b border-slate-200 bg-white grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* Left Column (6 cols): Metrics & Evaluation Matrix */}
        <div className="lg:col-span-6 flex flex-col divide-y divide-slate-200">
          {/* Top Metric Callouts Strip */}
          <div className="grid grid-cols-2 divide-x divide-slate-200">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                  ROC-AUC
                </span>
                <span className="text-[10px] text-blue-800 bg-blue-50 px-1.5 py-0.5 border border-blue-200 font-semibold">
                  +36.0% LIFT
                </span>
              </div>
              <div className="text-3xl font-bold text-navy-950 mt-2 tracking-tight">
                0.809
              </div>
              <p className="text-[12px] text-slate-500 mt-1">
                Isolation Forest vs. <strong className="text-slate-800">0.595</strong> Volume Baseline
              </p>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                  PR-AUC
                </span>
                <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200 font-semibold">
                  +153% LIFT
                </span>
              </div>
              <div className="text-3xl font-bold text-navy-950 mt-2 tracking-tight">
                0.301
              </div>
              <p className="text-[12px] text-slate-500 mt-1">
                Precision-Recall Area under curve (imbalanced positive class)
              </p>
            </div>
          </div>

          {/* Model Discrimination Matrix Table */}
          <div className="p-6 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[14px] font-bold text-navy-950 uppercase tracking-wider">
                  Model Discrimination Matrix
                </h2>
                <span className="text-[10px] text-slate-500 uppercase">
                  SUPERVISED VALIDATION
                </span>
              </div>
              <p className="text-[12px] text-slate-500 mb-4">
                Comparison of unsupervised behavioral features vs volume heuristics.
              </p>

              <div className="overflow-x-auto border border-slate-200">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider border-b border-slate-200">
                      <th className="py-2.5 px-3.5 font-semibold">Method</th>
                      <th className="py-2.5 px-3.5 font-semibold text-right">ROC-AUC ↑</th>
                      <th className="py-2.5 px-3.5 font-semibold text-right">PR-AUC ↑</th>
                      <th className="py-2.5 px-3.5 font-semibold text-right">Cohen's κ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[13px]">
                    <tr className="bg-slate-50/50">
                      <td className="py-3 px-3.5 font-semibold text-navy-950">
                        Isolation Forest (11 Features)
                      </td>
                      <td className="py-3 px-3.5 text-right font-bold text-navy-950">
                        0.809
                      </td>
                      <td className="py-3 px-3.5 text-right font-bold text-navy-950">
                        0.301
                      </td>
                      <td className="py-3 px-3.5 text-right font-semibold text-emerald-700">
                        0.684
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3.5 text-slate-600">
                        Volume Baseline (Log n)
                      </td>
                      <td className="py-3 px-3.5 text-right text-slate-600">0.595</td>
                      <td className="py-3 px-3.5 text-right text-slate-600">0.119</td>
                      <td className="py-3 px-3.5 text-right text-slate-600">0.245</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500">
              Evaluated over 239.6K feature vectors from 152 observation hours across 2 discrete time blocks.
            </div>
          </div>
        </div>

        {/* Right Column (6 cols): ROC Curve Visualizer Panel */}
        <div className="lg:col-span-6 p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div>
                <h2 className="text-[14px] font-bold text-navy-950 uppercase tracking-wider">
                  ROC Curve Comparison
                </h2>
                <p className="text-[12px] text-slate-500">
                  Trade-off between true positive rate (TPR) and false positive rate (FPR).
                </p>
              </div>

              {/* Legend - Minimal text style */}
              <div className="flex flex-col gap-1 text-right text-[11px]">
                <div className="flex items-center justify-end gap-1.5">
                  <span className="w-3 h-0.5 bg-navy-950 inline-block"></span>
                  <span className="font-semibold text-navy-950">
                    Isolation Forest (AUC 0.809)
                  </span>
                </div>
                <div className="flex items-center justify-end gap-1.5 text-slate-500">
                  <span className="w-3 h-0.5 bg-slate-400 inline-block"></span>
                  <span>Volume Baseline (AUC 0.595)</span>
                </div>
              </div>
            </div>

            {/* SVG ROC Chart */}
            <div className="w-full relative py-2">
              <svg aria-label="ROC Chart" className="w-full h-auto overflow-visible select-none" viewBox="0 0 460 270">
                <defs>
                  <pattern id="grid-roc" width="70" height="42" patternUnits="userSpaceOnUse">
                    <path d="M 70 0 L 0 0 0 42" fill="none" stroke="#f1f5f9" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect x="50" y="20" width="350" height="210" fill="url(#grid-roc)" />

                {/* Axis lines */}
                <line x1="50" y1="230" x2="400" y2="230" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="50" y1="20" x2="50" y2="230" stroke="#cbd5e1" strokeWidth="1" />

                {/* Y Axis Labels */}
                <g className="text-[10px] font-mono fill-slate-400" textAnchor="end">
                  <text x="42" y="234">0.0</text>
                  <text x="42" y="192">0.2</text>
                  <text x="42" y="150">0.4</text>
                  <text x="42" y="108">0.6</text>
                  <text x="42" y="66">0.8</text>
                  <text x="42" y="24">1.0</text>
                </g>

                {/* X Axis Labels */}
                <g className="text-[10px] font-mono fill-slate-400" textAnchor="middle">
                  <text x="50" y="248">0.0</text>
                  <text x="120" y="248">0.2</text>
                  <text x="190" y="248">0.4</text>
                  <text x="260" y="248">0.6</text>
                  <text x="330" y="248">0.8</text>
                  <text x="400" y="248">1.0</text>
                </g>

                {/* Axis Titles */}
                <text x="225" y="265" textAnchor="middle" className="text-[11px] fill-slate-500 uppercase tracking-wider font-semibold">
                  False Positive Rate (FPR)
                </text>
                <text
                  x="-125"
                  y="18"
                  transform="rotate(-90)"
                  textAnchor="middle"
                  className="text-[11px] fill-slate-500 uppercase tracking-wider font-semibold"
                >
                  True Positive Rate (TPR)
                </text>

                {/* Diagonal Baseline (Random Guessing AUC 0.5) */}
                <line x1="50" y1="230" x2="400" y2="20" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />

                {/* Curve 2: Volume baseline (AUC 0.595) */}
                <path d="M 50 230 C 130 185, 230 115, 400 20" fill="none" stroke="#94a3b8" strokeWidth="1.75" strokeDasharray="4 3" />

                {/* Curve 1: Isolation Forest (AUC 0.809) */}
                <path d="M 50 230 C 70 90, 140 40, 400 20" fill="none" stroke="#0a192f" strokeWidth="2.5" />

                {/* Operating Point Cutoff at τ = 0.5514 */}
                <circle cx="110" cy="68" r="4" fill="#1e3a8a" />
                <line x1="110" y1="68" x2="110" y2="230" stroke="#1e3a8a" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="50" y1="68" x2="110" y2="68" stroke="#1e3a8a" strokeWidth="1" strokeDasharray="2 2" />

                {/* Tooltip */}
                <g transform="translate(125, 48)">
                  <rect x="0" y="0" width="135" height="38" fill="white" stroke="#cbd5e1" strokeWidth="1" />
                  <text x="10" y="16" className="text-[11px] fill-navy-950 font-bold">TPR: 0.771</text>
                  <text x="10" y="30" className="text-[10px] fill-slate-500">FPR: 0.171 @ τ = 0.5514</text>
                </g>
              </svg>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-[12px]">
            <span className="text-slate-600">
              Optimal Threshold: <strong className="text-navy-950">τ = 0.5514</strong>
            </span>
            <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 font-semibold">
              HIGH DISCRIMINATION LIFT
            </span>
          </div>
        </div>
      </section>

      {/* Section 2: Temporal Stability & Inter-block Agreement */}
      <section className="p-6 border-b border-slate-200 bg-white flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
          <div>
            <h2 className="text-[14px] font-bold text-navy-950 uppercase tracking-wider">
              Temporal Stability & Inter-Block Agreement
            </h2>
            <p className="text-[12px] text-slate-500">
              Anomaly persistence evaluated across two disjoint 76-hour observation windows (Block A vs. Block B).
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5">
            ΔT = 76 HOURS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Spearman rho */}
          <div className="md:col-span-3 p-4 border border-slate-200 bg-slate-50/50">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">
              Spearman ρ
            </span>
            <div className="text-3xl font-bold text-navy-950 mt-1">0.720</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Rank correlation of anomaly scores between time slices
            </p>
          </div>

          {/* Recurrence Rate */}
          <div className="md:col-span-3 p-4 border border-slate-200 bg-slate-50/50">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">
              Recurrence Rate
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-navy-950">52.9%</span>
              <span className="text-[11px] text-slate-500">(Base: 5.2%)</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Candidate re-identification across disjoint window
            </p>
          </div>

          {/* Comparison Bars */}
          <div className="md:col-span-6 flex flex-col justify-center gap-3">
            <div>
              <div className="flex justify-between items-center text-[12px] mb-1">
                <span className="font-semibold text-navy-950">
                  Proposed Model Recurrence (Isolation Forest)
                </span>
                <span className="font-bold text-navy-950">52.9%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 overflow-hidden">
                <div className="bg-navy-950 h-full" style={{ width: '52.9%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-[12px] mb-1">
                <span className="text-slate-500">Uniform Random Baseline</span>
                <span className="text-slate-600">5.2%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 overflow-hidden">
                <div className="bg-slate-400 h-full" style={{ width: '5.2%' }}></div>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              The 10.2× lift over baseline confirms behavioral fingerprint durability across observation windows, demonstrating robust resilience against temporal variance.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Database Benchmark & Query Plans */}
      <section className="p-6 border-b border-slate-200 bg-white flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
          <div>
            <h2 className="text-[14px] font-bold text-navy-950 uppercase tracking-wider">
              Database Query Latency Benchmark
            </h2>
            <p className="text-[12px] text-slate-500">
              MongoDB Atlas M30 cluster benchmark comparing unindexed COLLSCAN vs compound B-Tree index (account_id, created_at).
            </p>
          </div>
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5">
            UP TO 9.75X SPEEDUP
          </span>
        </div>

        {/* Benchmark Table */}
        <div className="overflow-x-auto border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider border-b border-slate-200">
                <th className="py-2.5 px-4 font-semibold">Query Window Range</th>
                <th className="py-2.5 px-4 font-semibold text-right">COLLSCAN (Unindexed)</th>
                <th className="py-2.5 px-4 font-semibold text-right">IXSCAN (Compound Index)</th>
                <th className="py-2.5 px-4 font-semibold text-right">Speedup Factor</th>
                <th className="py-2.5 px-4 font-semibold text-center">Latency Reduction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px]">
              <tr>
                <td className="py-3 px-4 font-medium text-navy-950">24 Hours Window</td>
                <td className="py-3 px-4 text-right text-slate-500">8.42 s</td>
                <td className="py-3 px-4 text-right font-bold text-emerald-700">0.93 s</td>
                <td className="py-3 px-4 text-right font-bold text-navy-950">9.05×</td>
                <td className="py-3 px-4 text-center">
                  <div className="w-20 bg-slate-200 h-1.5 mx-auto overflow-hidden">
                    <div className="bg-emerald-600 h-full" style={{ width: '11%' }}></div>
                  </div>
                </td>
              </tr>
              <tr className="bg-slate-50/50">
                <td className="py-3 px-4 font-medium text-navy-950">48 Hours Window</td>
                <td className="py-3 px-4 text-right text-slate-500">17.66 s</td>
                <td className="py-3 px-4 text-right font-bold text-emerald-700">2.11 s</td>
                <td className="py-3 px-4 text-right font-bold text-navy-950">8.37×</td>
                <td className="py-3 px-4 text-center">
                  <div className="w-20 bg-slate-200 h-1.5 mx-auto overflow-hidden">
                    <div className="bg-emerald-600 h-full" style={{ width: '12%' }}></div>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-navy-950">78 Hours Window</td>
                <td className="py-3 px-4 text-right text-slate-500">31.70 s</td>
                <td className="py-3 px-4 text-right font-bold text-emerald-700">3.25 s</td>
                <td className="py-3 px-4 text-right font-bold text-navy-950">9.75×</td>
                <td className="py-3 px-4 text-center">
                  <div className="w-20 bg-slate-200 h-1.5 mx-auto overflow-hidden">
                    <div className="bg-emerald-600 h-full" style={{ width: '10%' }}></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[12px]">
          <div className="p-3 bg-slate-50 border border-slate-200">
            <span className="font-bold text-navy-950">COLLSCAN Stage:</span> Scans 100% of event documents linearly with disk spilling at &gt;48 hours.
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200">
            <span className="font-bold text-navy-950">IXSCAN + FETCH Stage:</span> Bounds queries using B-Tree index, reducing scanned doc ratio to 0.04% of total collection.
          </div>
        </div>
      </section>
    </div>
  );
}
