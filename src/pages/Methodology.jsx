import React, { useState } from 'react';
import {
  Archive,
  Database,
  Cpu,
  Layers,
  Network,
  CheckCircle2,
  Shield,
  Clock,
  Code2,
  BarChart,
  ArrowRight
} from 'lucide-react';

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
    <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-margin py-space-xl">
      {/* Title & Breadcrumb Block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs font-code-sm text-code-sm text-secondary uppercase tracking-widest mb-space-xs">
            <span>Documentation</span>
            <span>/</span>
            <span className="text-on-surface font-semibold">Research Architecture</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-semibold">
            Methodology
          </h1>
          <p className="font-body-md text-body-md text-secondary mt-1 max-w-2xl">
            Research design, data pipeline, behavioral feature definitions, and analytical approach for anomaly detection across GitHub public activity streams.
          </p>
        </div>
        <div className="flex items-center gap-space-sm self-start md:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-muted text-secondary rounded-full font-code-sm text-code-sm border border-border-subtle shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Pipeline v1.4.2 · Verified
          </span>
        </div>
      </div>

      {/* Main Content Layout: Two-Column Step/Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        {/* Left Column: Sticky Step Navigation Index (4 cols) */}
        <aside className="lg:col-span-4 sticky top-24 flex flex-col gap-space-lg">
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-border-subtle">
            <div className="font-label-md text-label-md text-secondary uppercase tracking-wider mb-space-md font-semibold">
              Execution Stages
            </div>
            <nav className="flex flex-col space-y-1">
              {stages.map((st) => {
                const isActive = activeSection === st.id;
                return (
                  <button
                    key={st.id}
                    onClick={() => scrollTo(st.id)}
                    className={`flex items-start gap-3 p-2.5 rounded-lg text-left transition-all ${
                      isActive
                        ? 'bg-surface-hover text-on-surface font-semibold shadow-2xs'
                        : 'text-on-surface-variant hover:bg-surface-hover hover:text-on-surface'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full font-code-sm text-code-sm flex items-center justify-center shrink-0 mt-0.5 ${
                        isActive ? 'bg-primary text-on-primary' : 'bg-surface-container text-secondary'
                      }`}
                    >
                      {st.num}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-headline-sm text-headline-sm text-sm leading-tight">
                        {st.title}
                      </span>
                      <span className="font-body-sm text-body-sm text-xs text-secondary font-normal mt-0.5">
                        {st.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Spec Card */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md text-on-surface border border-border-subtle shadow-sm">
            <div className="flex items-center gap-space-xs mb-space-sm text-secondary">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-label-md text-label-md font-semibold text-on-surface">
                Dataset Specification
              </span>
            </div>
            <dl className="space-y-2 font-body-sm text-body-sm text-xs">
              <div className="flex justify-between py-1 bg-surface-muted px-2.5 rounded">
                <dt className="text-secondary font-medium">Source</dt>
                <dd className="font-code-sm font-semibold">GH Archive (APIv3)</dd>
              </div>
              <div className="flex justify-between py-1 px-2.5">
                <dt className="text-secondary font-medium">Interval Block A</dt>
                <dd className="font-code-sm">76h (T0 → T76)</dd>
              </div>
              <div className="flex justify-between py-1 bg-surface-muted px-2.5 rounded">
                <dt className="text-secondary font-medium">Interval Block B</dt>
                <dd className="font-code-sm">76h (T76 → T152)</dd>
              </div>
              <div className="flex justify-between py-1 px-2.5">
                <dt className="text-secondary font-medium">Storage Engine</dt>
                <dd className="font-code-sm">MongoDB WiredTiger</dd>
              </div>
            </dl>
          </div>
        </aside>

        {/* Right Column: Structured Documentation Sections (8 cols) */}
        <section className="lg:col-span-8 flex flex-col gap-space-xl">
          {/* Section 1: Research Pipeline */}
          <article
            className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-border-subtle scroll-mt-24"
            id="pipeline-architecture"
          >
            <div className="flex items-center justify-between mb-space-md">
              <div>
                <span className="font-code-sm text-code-sm text-secondary uppercase font-semibold">
                  Section 01
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mt-0.5 font-bold">
                  Research Pipeline
                </h2>
              </div>
              <span className="px-2 py-1 bg-surface-container text-secondary rounded font-code-sm text-code-sm">
                Flow Architecture
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg leading-relaxed">
              The processing framework consumes raw activity streams directly from the GitHub public timeline archive, normalizes events into an indexed document schema, derives temporal and structural behavioral matrices, and trains unsupervised learning nodes for cluster and outlier estimation.
            </p>

            {/* Interactive Node Pipeline Diagram */}
            <div className="bg-surface-muted rounded-xl p-space-lg mb-space-md overflow-x-auto border border-border-subtle">
              <div className="min-w-[620px] flex items-center justify-between gap-2">
                {/* Step A */}
                <div className="flex-1 bg-surface-container-lowest rounded-lg p-3 text-center shadow-xs border border-border-subtle">
                  <Archive className="w-5 h-5 mx-auto text-secondary mb-1" />
                  <div className="font-headline-sm text-sm font-semibold text-on-surface">GH Archive</div>
                  <div className="font-code-sm text-[10px] text-secondary mt-0.5">Public events (JSON)</div>
                </div>
                <div className="text-secondary font-bold">→</div>

                {/* Step B */}
                <div className="flex-1 bg-surface-container-lowest rounded-lg p-3 text-center shadow-xs border border-border-subtle">
                  <Database className="w-5 h-5 mx-auto text-secondary mb-1" />
                  <div className="font-headline-sm text-sm font-semibold text-on-surface">MongoDB</div>
                  <div className="font-code-sm text-[10px] text-secondary mt-0.5">Aggregation pipeline</div>
                </div>
                <div className="text-secondary font-bold">→</div>

                {/* Step C */}
                <div className="flex-1 bg-surface-container-lowest rounded-lg p-3 text-center shadow-xs border border-border-subtle">
                  <Cpu className="w-5 h-5 mx-auto text-accent-cluster-1 mb-1" />
                  <div className="font-headline-sm text-sm font-semibold text-on-surface">11 Features</div>
                  <div className="font-code-sm text-[10px] text-secondary mt-0.5">Behavioral matrices</div>
                </div>
                <div className="text-secondary font-bold">→</div>

                {/* Step D */}
                <div className="flex-1 bg-surface-container-lowest rounded-lg p-3 text-center shadow-xs border border-border-subtle">
                  <Layers className="w-5 h-5 mx-auto text-rose-600 mb-1" />
                  <div className="font-headline-sm text-sm font-semibold text-on-surface">Isolation Forest</div>
                  <div className="font-code-sm text-[10px] text-secondary mt-0.5">Anomaly Scoring</div>
                </div>
                <div className="text-secondary font-bold">→</div>

                {/* Step E */}
                <div className="flex-1 bg-surface-container-lowest rounded-lg p-3 text-center shadow-xs border border-border-subtle">
                  <Network className="w-5 h-5 mx-auto text-purple-600 mb-1" />
                  <div className="font-headline-sm text-sm font-semibold text-on-surface">K-Means (k=7)</div>
                  <div className="font-code-sm text-[10px] text-secondary mt-0.5">Archetype Clusters</div>
                </div>
              </div>
            </div>
          </article>

          {/* Section 2: Dataset Sampling */}
          <article
            className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-border-subtle scroll-mt-24"
            id="dataset-sampling"
          >
            <div className="flex items-center justify-between mb-space-md">
              <div>
                <span className="font-code-sm text-code-sm text-secondary uppercase font-semibold">
                  Section 02
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mt-0.5 font-bold">
                  Dataset Sampling & Observation Windows
                </h2>
              </div>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              To evaluate model reliability and temporal robustness, the timeline is partitioned into two disjoint observation blocks of 76 hours each (total 152 continuous hours). In total, 9.88 million raw events were indexed across 239.6K active actors, resulting in 44,200 modeled accounts meeting the activity threshold criteria.
            </p>
          </article>

          {/* Section 3: Data Engineering */}
          <article
            className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-border-subtle scroll-mt-24"
            id="data-engineering"
          >
            <div className="flex items-center justify-between mb-space-md">
              <div>
                <span className="font-code-sm text-code-sm text-secondary uppercase font-semibold">
                  Section 03
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mt-0.5 font-bold">
                  Data Engineering & Index Optimization
                </h2>
              </div>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-4">
              To support rapid aggregation across millions of documents without table scanning, compound B-Tree indices were constructed on <code className="font-code-sm bg-surface-muted px-1.5 py-0.5 rounded font-semibold text-on-surface">&#123; account_id: 1, created_at: 1 &#125;</code>.
            </p>
            <div className="p-4 rounded-xl bg-surface-muted border border-border-subtle text-xs font-code-sm">
              <span className="text-secondary block mb-1 font-semibold">// Aggregation Query Pipeline</span>
              db.events.aggregate([<br />
              &nbsp;&nbsp;&#123; $match: &#123; created_at: &#123; $gte: ISODate("T0"), $lt: ISODate("T76") &#125; &#125; &#125;,<br />
              &nbsp;&nbsp;&#123; $group: &#123; _id: "$actor.id", total: &#123; $sum: 1 &#125;, repos: &#123; $addToSet: "$repo.id" &#125;, hours: &#123; $addToSet: &#123; $hour: "$created_at" &#125; &#125; &#125; &#125;<br />
              ]);
            </div>
          </article>

          {/* Section 4: Behavioral Features */}
          <article
            className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-border-subtle scroll-mt-24"
            id="feature-engineering"
          >
            <div className="flex items-center justify-between mb-space-md">
              <div>
                <span className="font-code-sm text-code-sm text-secondary uppercase font-semibold">
                  Section 04
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mt-0.5 font-bold">
                  11 Behavioral Features
                </h2>
              </div>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-4">
              Feature vectors quantify action diversity, repository distribution focus, circadian rhythm entropy, and hourly burst velocities.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {featuresList.map((feat) => (
                <div key={feat.name} className="p-3.5 rounded-xl bg-surface-bright border border-border-subtle shadow-2xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-headline-sm text-xs font-bold text-on-surface">{feat.label}</span>
                    <code className="font-code-sm text-[11px] text-accent-cluster-1 font-semibold bg-blue-50 px-1 rounded">
                      {feat.name}
                    </code>
                  </div>
                  <p className="font-body-sm text-xs text-secondary leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </article>

          {/* Section 5: Machine Learning */}
          <article
            className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-border-subtle scroll-mt-24"
            id="machine-learning"
          >
            <div className="flex items-center justify-between mb-space-md">
              <div>
                <span className="font-code-sm text-code-sm text-secondary uppercase font-semibold">
                  Section 05
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mt-0.5 font-bold">
                  Machine Learning & Anomaly Detection
                </h2>
              </div>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-3">
              We employ <strong>Isolation Forest</strong> for unsupervised outlier isolation without requiring clean negative labels. Trees isolate anomalies with short path lengths because anomalous vectors sit isolated in feature space.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              <strong>K-Means (k=7)</strong> partitions normal and anomalous actors into distinct behavioral archetypes: burst pushers, regular developers, multi-repo committers, tooling bots, and 24/7 continuous loggers.
            </p>
          </article>

          {/* Section 6: Evaluation Metrics */}
          <article
            className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-border-subtle scroll-mt-24"
            id="evaluation-methodology"
          >
            <div className="flex items-center justify-between mb-space-md">
              <div>
                <span className="font-code-sm text-code-sm text-secondary uppercase font-semibold">
                  Section 06
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mt-0.5 font-bold">
                  Evaluation Methodology & Benchmarks
                </h2>
              </div>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              We evaluate using receiver operating characteristic (ROC-AUC 0.809 vs 0.595 baseline), precision-recall area (PR-AUC 0.301 vs 0.119), Spearman rank correlation (ρ = 0.720), and recurrence rate (52.9% vs 5.2% uniform baseline).
            </p>
          </article>

          {/* Section 7: Privacy & Limitations */}
          <article
            className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-border-subtle scroll-mt-24"
            id="privacy-boundaries"
          >
            <div className="flex items-center justify-between mb-space-md">
              <div>
                <span className="font-code-sm text-code-sm text-secondary uppercase font-semibold">
                  Section 07
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mt-0.5 font-bold">
                  Privacy Preservation & Ethical Boundaries
                </h2>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-surface-muted border border-border-subtle text-xs text-secondary flex items-start gap-3 leading-relaxed">
              <Shield className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-on-surface mb-1">Pseudonymization Policy</p>
                All account IDs are irreversibly hashed and pseudonymized. No repository code bodies, personal emails, or private commit messages were scraped or processed during feature extraction.
              </div>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
