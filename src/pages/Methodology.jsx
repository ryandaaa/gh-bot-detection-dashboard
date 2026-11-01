import React, { useState } from 'react';

export default function Methodology() {
  const [activeSection, setActiveSection] = useState('pipeline-architecture');

  const scrollTo = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const stages = [
    { id: 'pipeline-architecture', num: 1, title: 'Research Pipeline', desc: 'End-to-end ingestion flow' },
    { id: 'dataset-sampling', num: 2, title: 'Dataset & Sampling', desc: '152-hour observation span' },
    { id: 'data-engineering', num: 3, title: 'Data Engineering', desc: 'MongoDB aggregation layer' },
    { id: 'feature-engineering', num: 4, title: 'Behavioral Features', desc: '11 statistical & entropy metrics' },
    { id: 'machine-learning', num: 5, title: 'ML & Clustering', desc: 'Isolation Forest & K-Means' },
    { id: 'evaluation-methodology', num: 6, title: 'Evaluation Metrics', desc: 'ROC, PR-AUC & temporal drift' },
    { id: 'privacy-boundaries', num: 7, title: 'Privacy & Boundaries', desc: 'Pseudonymization boundaries' },
  ];

  const featuresList = [
    { name: 'log_n', label: 'Log Total Events', desc: 'Log-transformed event volume log(1 + n) to compress heavy-tailed power distributions.' },
    { name: 'frac_push', label: 'Fraction of Push Events', desc: 'Ratio of PushEvent to total events. High values (>0.9) characterize commit loop scripts.' },
    { name: 'frac_create', label: 'Fraction of Create Events', desc: 'Ratio of repository, branch, or tag creations.' },
    { name: 'frac_pr', label: 'Fraction of PR Events', desc: 'Ratio of PullRequestEvent. Tooling bots (Dependabot) show high PR volume.' },
    { name: 'frac_issue', label: 'Fraction of Issue Events', desc: 'Ratio of IssuesEvent and IssueCommentEvent interactions.' },
    { name: 'frac_social', label: 'Fraction of Social Events', desc: 'Ratio of WatchEvent (Stars) and ForkEvent indicating social graph interaction.' },
    { name: 'log_events_per_repo', label: 'Events Per Repo', desc: 'Log ratio log(1 + n_events / n_repos) capturing activity dispersal.' },
    { name: 'max_repo_share', label: 'Max Repo Concentration', desc: 'Proportion of total events dedicated to the single most active repository [0, 1].' },
    { name: 'hour_entropy', label: 'Normalized 24h Entropy', desc: 'Shannon entropy across 24 circadian hours. Near 0 = burst spike; Near 1 = continuous 24/7 bot.' },
    { name: 'active_frac', label: 'Active Hour Fraction', desc: 'Proportion of total observation hours in which the account triggered at least 1 action.' },
    { name: 'log_max_per_hour', label: 'Peak Velocity', desc: 'Log of the maximum event count executed within any single clock hour.' },
  ];

  return (
    <div className="w-full flex flex-col font-sans">
      {/* Editorial Header Bar - Full Bleed Edge-to-Edge */}
      <section className="px-6 py-5 border-b border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-navy-950 tracking-tight uppercase">
            Methodology & Architecture
          </h1>
          <p className="text-[13px] text-slate-500 mt-0.5">
            Research design, data pipeline, behavioral feature definitions, and analytical approach for anomaly detection across GitHub public activity streams.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 uppercase tracking-wider">
            PIPELINE V1.4.2 · VERIFIED
          </span>
        </div>
      </section>

      {/* Main Two-Column Layout with Hairline Divider */}
      <section className="w-full grid grid-cols-1 lg:grid-cols-12 border-b border-slate-200 bg-white divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* Left Column (4 cols): Sticky Navigation Index & Quick Specs */}
        <aside className="lg:col-span-4 p-6 flex flex-col gap-6 bg-slate-50/30">
          {/* Navigation Index */}
          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-bold mb-3">
              Execution Stages
            </div>
            <nav className="flex flex-col space-y-1">
              {stages.map((st) => {
                const isActive = activeSection === st.id;
                return (
                  <button
                    key={st.id}
                    onClick={() => scrollTo(st.id)}
                    className={`flex items-start gap-3 p-2.5 text-left border transition-colors ${
                      isActive
                        ? 'bg-white border-navy-950 text-navy-950 font-medium'
                        : 'bg-transparent border-transparent text-slate-600 hover:bg-white hover:border-slate-200 hover:text-navy-900'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                        isActive ? 'bg-navy-950 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {st.num}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-semibold leading-tight">
                        {st.title}
                      </span>
                      <span className="text-[11px] text-slate-500 mt-0.5">
                        {st.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Dataset Specification */}
          <div className="border border-slate-200 bg-white p-4">
            <div className="text-[11px] font-bold text-navy-950 uppercase tracking-wider mb-3">
              Dataset Specification
            </div>
            <dl className="space-y-2 text-[12px]">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <dt className="text-slate-500">Source</dt>
                <dd className="font-semibold text-navy-950">GH Archive (APIv3)</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <dt className="text-slate-500">Interval Block A</dt>
                <dd className="text-navy-950">76h (T0 → T76)</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <dt className="text-slate-500">Interval Block B</dt>
                <dd className="text-navy-950">76h (T76 → T152)</dd>
              </div>
              <div className="flex justify-between py-1">
                <dt className="text-slate-500">Storage Engine</dt>
                <dd className="text-navy-950">MongoDB WiredTiger</dd>
              </div>
            </dl>
          </div>
        </aside>

        {/* Right Column (8 cols): Structured Documentation Sections */}
        <div className="lg:col-span-8 p-6 flex flex-col divide-y divide-slate-200">
          {/* Section 1: Research Pipeline */}
          <article className="pb-8 scroll-mt-20" id="pipeline-architecture">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  Section 01
                </span>
                <h2 className="text-[16px] font-bold text-navy-950 uppercase tracking-tight mt-0.5">
                  Research Pipeline
                </h2>
              </div>
              <span className="text-[10px] text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 uppercase">
                FLOW ARCHITECTURE
              </span>
            </div>
            <p className="text-[13px] text-slate-600 leading-relaxed mb-4">
              The processing framework consumes raw activity streams directly from the GitHub public timeline archive, normalizes events into an indexed document schema, derives temporal and structural behavioral matrices, and trains unsupervised learning nodes for cluster and outlier estimation.
            </p>

            {/* Pipeline Step Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 border border-slate-200 divide-x divide-y sm:divide-y-0 divide-slate-200 text-center bg-slate-50/50">
              <div className="p-3">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Step 1</div>
                <div className="text-[12px] font-bold text-navy-950 mt-1">GH Archive</div>
                <div className="text-[10px] text-slate-500 mt-0.5">JSON Timeline</div>
              </div>
              <div className="p-3">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Step 2</div>
                <div className="text-[12px] font-bold text-navy-950 mt-1">MongoDB</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Aggregation</div>
              </div>
              <div className="p-3">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Step 3</div>
                <div className="text-[12px] font-bold text-navy-950 mt-1">11 Features</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Matrices</div>
              </div>
              <div className="p-3">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Step 4</div>
                <div className="text-[12px] font-bold text-navy-950 mt-1">Isolation Forest</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Anomaly Scoring</div>
              </div>
              <div className="p-3 col-span-2 sm:col-span-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Step 5</div>
                <div className="text-[12px] font-bold text-navy-950 mt-1">K-Means (k=7)</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Archetypes</div>
              </div>
            </div>
          </article>

          {/* Section 2: Dataset Sampling */}
          <article className="py-8 scroll-mt-20" id="dataset-sampling">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
              Section 02
            </span>
            <h2 className="text-[16px] font-bold text-navy-950 uppercase tracking-tight mt-0.5 mb-3">
              Dataset Sampling & Observation Windows
            </h2>
            <p className="text-[13px] text-slate-600 leading-relaxed">
              To evaluate model reliability and temporal robustness, the timeline is partitioned into two disjoint observation blocks of 76 hours each (total 152 continuous hours). In total, 9.88 million raw events were indexed across 239.6K active actors, resulting in 44,200 modeled accounts meeting the activity threshold criteria.
            </p>
          </article>

          {/* Section 3: Data Engineering */}
          <article className="py-8 scroll-mt-20" id="data-engineering">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
              Section 03
            </span>
            <h2 className="text-[16px] font-bold text-navy-950 uppercase tracking-tight mt-0.5 mb-3">
              Data Engineering & Index Optimization
            </h2>
            <p className="text-[13px] text-slate-600 leading-relaxed mb-3">
              To support rapid aggregation across millions of documents without full collection scans, compound B-Tree indices were constructed on <code className="bg-slate-100 text-navy-950 px-1.5 py-0.5 border border-slate-200 font-medium">&#123; account_id: 1, created_at: 1 &#125;</code>.
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 text-[11px] text-slate-800 font-mono">
              <span className="text-slate-400 block mb-1">// MongoDB Aggregation Pipeline</span>
              db.events.aggregate([<br />
              &nbsp;&nbsp;&#123; $match: &#123; created_at: &#123; $gte: ISODate("T0"), $lt: ISODate("T76") &#125; &#125; &#125;,<br />
              &nbsp;&nbsp;&#123; $group: &#123; _id: "$actor.id", total: &#123; $sum: 1 &#125;, repos: &#123; $addToSet: "$repo.id" &#125;, hours: &#123; $addToSet: &#123; $hour: "$created_at" &#125; &#125; &#125; &#125;<br />
              ]);
            </div>
          </article>

          {/* Section 4: Behavioral Features */}
          <article className="py-8 scroll-mt-20" id="feature-engineering">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
              Section 04
            </span>
            <h2 className="text-[16px] font-bold text-navy-950 uppercase tracking-tight mt-0.5 mb-3">
              11 Behavioral Features
            </h2>
            <p className="text-[13px] text-slate-600 leading-relaxed mb-4">
              Feature vectors quantify action diversity, repository distribution focus, circadian rhythm entropy, and hourly burst velocities.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {featuresList.map((feat) => (
                <div key={feat.name} className="p-3 border border-slate-200 bg-white">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-bold text-navy-950">{feat.label}</span>
                    <span className="text-[10px] text-navy-700 bg-slate-100 px-1.5 py-0.5 border border-slate-200">
                      {feat.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </article>

          {/* Section 5: Machine Learning */}
          <article className="py-8 scroll-mt-20" id="machine-learning">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
              Section 05
            </span>
            <h2 className="text-[16px] font-bold text-navy-950 uppercase tracking-tight mt-0.5 mb-3">
              Machine Learning & Anomaly Detection
            </h2>
            <p className="text-[13px] text-slate-600 leading-relaxed mb-3">
              We employ <strong>Isolation Forest</strong> for unsupervised outlier isolation without requiring clean negative labels. Trees isolate anomalies with short path lengths because anomalous vectors sit isolated in feature space.
            </p>
            <p className="text-[13px] text-slate-600 leading-relaxed">
              <strong>K-Means (k=7)</strong> partitions normal and anomalous actors into distinct behavioral archetypes: burst pushers, regular developers, multi-repo committers, tooling bots, and 24/7 continuous loggers.
            </p>
          </article>

          {/* Section 6: Evaluation Metrics */}
          <article className="py-8 scroll-mt-20" id="evaluation-methodology">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
              Section 06
            </span>
            <h2 className="text-[16px] font-bold text-navy-950 uppercase tracking-tight mt-0.5 mb-3">
              Evaluation Methodology & Benchmarks
            </h2>
            <p className="text-[13px] text-slate-600 leading-relaxed">
              We evaluate using receiver operating characteristic (ROC-AUC 0.809 vs 0.595 baseline), precision-recall area (PR-AUC 0.301 vs 0.119), Spearman rank correlation (ρ = 0.720), and recurrence rate (52.9% vs 5.2% uniform baseline).
            </p>
          </article>

          {/* Section 7: Privacy & Limitations */}
          <article className="pt-8 scroll-mt-20" id="privacy-boundaries">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
              Section 07
            </span>
            <h2 className="text-[16px] font-bold text-navy-950 uppercase tracking-tight mt-0.5 mb-3">
              Privacy Preservation & Ethical Boundaries
            </h2>
            <div className="p-3.5 bg-slate-50 border border-slate-200 text-[12px] text-slate-600 leading-relaxed">
              <strong className="text-navy-950 block mb-1">Pseudonymization Policy</strong>
              All account IDs are irreversibly hashed and pseudonymized. No repository code bodies, personal emails, or private commit messages were scraped or processed during feature extraction.
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
