import React, { useState, useEffect } from 'react';
import Skeleton, { SkeletonCard } from '../components/Skeleton';

export default function Methodology() {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('pipeline-architecture');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 320);
    return () => clearTimeout(timer);
  }, []);

  const scrollTo = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const stages = [
    { id: 'pipeline-architecture', num: 1, title: 'Research Pipeline', desc: 'Alur ingesti end-to-end' },
    { id: 'dataset-sampling', num: 2, title: 'Dataset & Sampling', desc: 'Rentang observasi 152 jam' },
    { id: 'data-engineering', num: 3, title: 'Data Engineering', desc: 'Lapisan agregasi MongoDB' },
    { id: 'feature-engineering', num: 4, title: 'Behavioral Features', desc: '11 metrik statistik & entropi' },
    { id: 'machine-learning', num: 5, title: 'ML & Clustering', desc: 'Isolation Forest & K-Means' },
    { id: 'evaluation-methodology', num: 6, title: 'Evaluation Metrics', desc: 'ROC, PR-AUC & drift temporal' },
    { id: 'privacy-boundaries', num: 7, title: 'Privacy & Boundaries', desc: 'Batasan pseudonimisasi data' },
  ];

  const featuresList = [
    { name: 'log_n', label: 'Log Total Events', desc: 'Transformasi logaritma volume event log(1 + n) untuk mengompresi distribusi ekor tebal (heavy-tailed power law).' },
    { name: 'frac_push', label: 'Fraction of Push Events', desc: 'Rasio operasi PushEvent terhadap total event. Nilai tinggi (>0,9) mencirikan skrip commit otomatis.' },
    { name: 'frac_create', label: 'Fraction of Create Events', desc: 'Rasio pembuatan repositori, cabang kerja (branch), atau tag baru.' },
    { name: 'frac_pr', label: 'Fraction of PR Events', desc: 'Rasio PullRequestEvent. Bot tooling (seperti Dependabot) memiliki volume PR yang dominan.' },
    { name: 'frac_issue', label: 'Fraction of Issue Events', desc: 'Rasio interaksi IssuesEvent dan IssueCommentEvent dalam diskusi repositori.' },
    { name: 'frac_social', label: 'Fraction of Social Events', desc: 'Rasio WatchEvent (Stars) dan ForkEvent yang mengindikasikan interaksi graf sosial.' },
    { name: 'log_events_per_repo', label: 'Events Per Repo', desc: 'Rasio logaritma log(1 + n_events / n_repos) untuk mengukur dispersi aktivitas repositori.' },
    { name: 'max_repo_share', label: 'Max Repo Concentration', desc: 'Proporsi total event yang terkonsentrasi pada satu repositori paling aktif [0, 1].' },
    { name: 'hour_entropy', label: 'Normalized 24h Entropy', desc: 'Entropi Shannon ternormalisasi sepanjang 24 jam sirkadian. Mendekati 0 = burst spike; mendekati 1 = bot aktif non-stop 24/7.' },
    { name: 'active_frac', label: 'Active Hour Fraction', desc: 'Proporsi jam observasi di mana akun memicu setidaknya 1 aksi aktivitas.' },
    { name: 'log_max_per_hour', label: 'Peak Velocity', desc: 'Logaritma dari jumlah event maksimum yang dieksekusi dalam satu jam jam dinding.' },
  ];

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
        <div className="bg-white border border-slate-200/90 rounded-[4px] p-6 flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-6 w-52" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </div>
          <Skeleton className="h-7 w-36" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-4">
            <SkeletonCard className="h-80" />
            <SkeletonCard className="h-48" />
          </div>
          <div className="lg:col-span-8 space-y-4">
            <SkeletonCard className="h-56" />
            <SkeletonCard className="h-64" />
            <SkeletonCard className="h-72" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
      {/* Editorial Page Header - Calm, Clean, Clear Focus */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">
            Methodology & Architecture
          </h1>
          <p className="text-[13px] text-slate-500 mt-0.5">
            Desain penelitian, arsitektur pipeline big data, rekayasa fitur perilaku 11 dimensi, dan kerangka analitik nir-terbimbing (unsupervised).
          </p>
        </div>
        <div className="text-[11px] font-medium text-slate-500">
          PBL Big Data 2026 · Universitas Riau
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (4 cols): Sticky Navigation Index & Quick Specs */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          {/* Navigation Index Card */}
          <div className="bg-white border border-slate-200/90 rounded-[4px] p-5 shadow-2xs">
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-bold mb-3 font-mono">
              Execution Stages
            </div>
            <nav className="flex flex-col space-y-1">
              {stages.map((st) => {
                const isActive = activeSection === st.id;
                return (
                  <button
                    key={st.id}
                    onClick={() => scrollTo(st.id)}
                    className={`flex items-start gap-3 p-2.5 text-left border rounded-[4px] transition-colors ${
                      isActive
                        ? 'bg-slate-50 border-navy-950 text-navy-950 font-medium'
                        : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-200 hover:text-navy-900'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 text-[11px] font-bold font-mono flex items-center justify-center shrink-0 mt-0.5 rounded-[2px] ${
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

          {/* Dataset Specification Card */}
          <div className="bg-white border border-slate-200/90 rounded-[4px] p-5 shadow-2xs">
            <div className="text-[11px] font-bold text-navy-950 uppercase tracking-wider mb-3 font-mono">
              Dataset Specification
            </div>
            <dl className="space-y-2 text-[12px]">
              <div className="flex justify-between py-1 border-b border-slate-100 font-mono">
                <dt className="text-slate-500 font-sans">Sumber Data</dt>
                <dd className="font-semibold text-navy-950">GH Archive (APIv3)</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 font-mono">
                <dt className="text-slate-500 font-sans">Interval Blok A</dt>
                <dd className="text-navy-950">76 jam (T0 → T76)</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 font-mono">
                <dt className="text-slate-500 font-sans">Interval Blok B</dt>
                <dd className="text-navy-950">76 jam (T76 → T152)</dd>
              </div>
              <div className="flex justify-between py-1 font-mono">
                <dt className="text-slate-500 font-sans">Engine Penyimpanan</dt>
                <dd className="text-navy-950">MongoDB WiredTiger</dd>
              </div>
            </dl>
          </div>
        </aside>

        {/* Right Column (8 cols): Structured Documentation Sections */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Section 1: Research Pipeline */}
          <article className="bg-white border border-slate-200/90 rounded-[4px] p-6 shadow-2xs scroll-mt-20" id="pipeline-architecture">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold font-mono">
                  Section 01
                </span>
                <h2 className="text-[16px] font-semibold text-slate-900 tracking-tight mt-0.5">
                  Research Pipeline
                </h2>
              </div>
              <span className="text-[10px] text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-[4px] uppercase font-mono">
                FLOW ARCHITECTURE
              </span>
            </div>
            <p className="text-[13px] text-slate-600 leading-relaxed mb-4">
              Kerangka kerja pemrosesan mengonsumsi aliran aktivitas mentah langsung dari arsip linimasa publik GitHub (GH Archive), menormalisasi event ke dalam skema dokumen berindeks, menurunkan matriks perilaku temporal dan struktural, serta melatih model nir-terbimbing untuk estimasi klaster dan deteksi anomali.
            </p>

            {/* Pipeline Step Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 border border-slate-200/90 rounded-[4px] overflow-hidden divide-x divide-y sm:divide-y-0 divide-slate-200 text-center bg-slate-50/50">
              <div className="p-3">
                <div className="text-[10px] text-slate-400 font-bold uppercase font-mono">Step 1</div>
                <div className="text-[12px] font-bold text-navy-950 mt-1">GH Archive</div>
                <div className="text-[10px] text-slate-500 mt-0.5 font-mono">Linimasa JSON</div>
              </div>
              <div className="p-3">
                <div className="text-[10px] text-slate-400 font-bold uppercase font-mono">Step 2</div>
                <div className="text-[12px] font-bold text-navy-950 mt-1">MongoDB</div>
                <div className="text-[10px] text-slate-500 mt-0.5 font-mono">Agregasi NoSQL</div>
              </div>
              <div className="p-3">
                <div className="text-[10px] text-slate-400 font-bold uppercase font-mono">Step 3</div>
                <div className="text-[12px] font-bold text-navy-950 mt-1">11 Fitur</div>
                <div className="text-[10px] text-slate-500 mt-0.5 font-mono">Matriks Perilaku</div>
              </div>
              <div className="p-3">
                <div className="text-[10px] text-slate-400 font-bold uppercase font-mono">Step 4</div>
                <div className="text-[12px] font-bold text-navy-950 mt-1">Isolation Forest</div>
                <div className="text-[10px] text-slate-500 mt-0.5 font-mono">Skoring Anomali</div>
              </div>
              <div className="p-3 col-span-2 sm:col-span-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase font-mono">Step 5</div>
                <div className="text-[12px] font-bold text-navy-950 mt-1">K-Means (k=7)</div>
                <div className="text-[10px] text-slate-500 mt-0.5 font-mono">Partisi Arketipe</div>
              </div>
            </div>
          </article>

          {/* Section 2: Dataset Sampling */}
          <article className="bg-white border border-slate-200/90 rounded-[4px] p-6 shadow-2xs scroll-mt-20" id="dataset-sampling">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold font-mono">
              Section 02
            </span>
            <h2 className="text-[16px] font-semibold text-slate-900 tracking-tight mt-0.5 mb-3">
              Dataset Sampling & Observation Windows
            </h2>
            <p className="text-[13px] text-slate-600 leading-relaxed">
              Untuk mengevaluasi keandalan model dan ketahanan temporal, linimasa dipartisi menjadi dua blok observasi independen masing-masing berdurasi 76 jam (total 152 jam kontinu). Sebanyak 9,88 juta event mentah diindeks dari 239,6 ribu aktor aktif, menghasilkan 44.200 akun termodel yang memenuhi kriteria ambang batas aktivitas minimal.
            </p>
          </article>

          {/* Section 3: Data Engineering */}
          <article className="bg-white border border-slate-200/90 rounded-[4px] p-6 shadow-2xs scroll-mt-20" id="data-engineering">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold font-mono">
              Section 03
            </span>
            <h2 className="text-[16px] font-semibold text-slate-900 tracking-tight mt-0.5 mb-3">
              Data Engineering & Index Optimization
            </h2>
            <p className="text-[13px] text-slate-600 leading-relaxed mb-3">
              Untuk mendukung agregasi cepat pada jutaan dokumen tanpa pemindaian koleksi menyeluruh (COLLSCAN), indeks majemuk B-Tree dibangun pada pasangan kunci <code className="bg-slate-100 text-navy-950 px-1.5 py-0.5 border border-slate-200 rounded-[4px] font-medium font-mono">&#123; account_id: 1, created_at: 1 &#125;</code>.
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-[4px] text-[11px] text-slate-800 font-mono">
              <span className="text-slate-400 block mb-1">// MongoDB Aggregation Pipeline</span>
              db.events.aggregate([<br />
              &nbsp;&nbsp;&#123; $match: &#123; created_at: &#123; $gte: ISODate("T0"), $lt: ISODate("T76") &#125; &#125; &#125;,<br />
              &nbsp;&nbsp;&#123; $group: &#123; _id: "$actor.id", total: &#123; $sum: 1 &#125;, repos: &#123; $addToSet: "$repo.id" &#125;, hours: &#123; $addToSet: &#123; $hour: "$created_at" &#125; &#125; &#125; &#125;<br />
              ]);
            </div>
          </article>

          {/* Section 4: Behavioral Features */}
          <article className="bg-white border border-slate-200/90 rounded-[4px] p-6 shadow-2xs scroll-mt-20" id="feature-engineering">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold font-mono">
              Section 04
            </span>
            <h2 className="text-[16px] font-semibold text-slate-900 tracking-tight mt-0.5 mb-3">
              11 Behavioral Features
            </h2>
            <p className="text-[13px] text-slate-600 leading-relaxed mb-4">
              Vektor fitur mengukur keberagaman aksi Git, fokus distribusi repositori, entropi ritme sirkadian 24 jam, dan kecepatan lonjakan (burst velocity) per jam.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {featuresList.map((feat) => (
                <div key={feat.name} className="p-3.5 border border-slate-200/90 rounded-[4px] bg-white shadow-2xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-bold text-navy-950">{feat.label}</span>
                    <span className="text-[10px] font-mono text-navy-700 bg-slate-100 px-1.5 py-0.5 border border-slate-200 rounded-[4px]">
                      {feat.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </article>

          {/* Section 5: Machine Learning */}
          <article className="bg-white border border-slate-200/90 rounded-[4px] p-6 shadow-2xs scroll-mt-20" id="machine-learning">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold font-mono">
              Section 05
            </span>
            <h2 className="text-[16px] font-semibold text-slate-900 tracking-tight mt-0.5 mb-3">
              Machine Learning & Anomaly Detection
            </h2>
            <p className="text-[13px] text-slate-600 leading-relaxed mb-3">
              Kami menerapkan algoritma <strong>Isolation Forest</strong> untuk isolasi anomali nir-terbimbing tanpa memerlukan label negatif bersih. Struktur pohon mengisolasi titik anomali dengan kedalaman jalur (path length) yang pendek karena vektor anomali berada terisolasi di ruang fitur.
            </p>
            <p className="text-[13px] text-slate-600 leading-relaxed">
              Algoritma <strong>K-Means (k=7)</strong> mempartisi aktor normal dan anomali ke dalam arketipe perilaku yang terpisah secara tegas: burst pushers, developer reguler, multi-repo committers, tooling bots, dan continuous logger 24/7.
            </p>
          </article>

          {/* Section 6: Evaluation Metrics */}
          <article className="bg-white border border-slate-200/90 rounded-[4px] p-6 shadow-2xs scroll-mt-20" id="evaluation-methodology">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold font-mono">
              Section 06
            </span>
            <h2 className="text-[16px] font-semibold text-slate-900 tracking-tight mt-0.5 mb-3">
              Evaluation Methodology & Benchmarks
            </h2>
            <p className="text-[13px] text-slate-600 leading-relaxed">
              Evaluasi dilakukan menggunakan kurva karakteristik operasi penerima (ROC-AUC 0,809 vs 0,595 baseline volume tunggal), area kurva presisi-recall (PR-AUC 0,301 vs 0,119 baseline), korelasi peringkat Spearman lintas-blok (ρ = 0,720), serta tingkat rekurensi persistensi perilaku (52,9% vs 5,2% pada baseline acak seragam).
            </p>
          </article>

          {/* Section 7: Privacy & Limitations */}
          <article className="bg-white border border-slate-200/90 rounded-[4px] p-6 shadow-2xs scroll-mt-20" id="privacy-boundaries">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold font-mono">
              Section 07
            </span>
            <h2 className="text-[16px] font-semibold text-slate-900 tracking-tight mt-0.5 mb-3">
              Privacy Preservation & Ethical Boundaries
            </h2>
            <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-[4px] text-[12px] text-slate-600 leading-relaxed">
              <strong className="text-navy-950 block mb-1">Pseudonymization Policy</strong>
              Seluruh identificator akun di-hash secara satu arah dan disamarkan (potongan SHA-256) secara permanen. Tidak ada badan kode sumber repositori, email pribadi kontributor, maupun pesan commit privat yang diambil atau diproses selama tahapan ekstraksi fitur.
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
