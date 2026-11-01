/**
 * GH Intelligence Dashboard - Global "Analyze an Account" Interactive Modal
 * Provides:
 * 1. Global modal popup injected dynamically into document.body
 * 2. Tab 1: Live GitHub URL / Username lookup via /api/analyze-github (Default Active)
 *    - Real-time profile & 100-event extraction
 *    - Quick-fill chips (mccartyashley284, hiro-kurage, nonkh, torvalds)
 *    - Profile avatar, bio, stats, 11-D extracted metrics, and model anomaly inference
 * 3. Tab 2: Manual Feature Simulation
 *    - 5 Presets: Custom, Spam Gambling Bot, Forex EA Logger, Extreme Loop, Normal Human
 *    - 11 Behavioral metric sliders and number inputs
 *    - POST to /api/predict with loading spinner and offline fallback simulation
 * 4. Two-way interoperability: "Tweak in Manual Mode" moves live extracted metrics to manual sliders
 */

(function () {
  'use strict';

  const PRESETS = {
    custom: {
      label: 'Custom Input',
      events: 50,
      repos: 2,
      activeHours: 12,
      pushPct: 70,
      prPct: 15,
      issuePct: 10,
      createPct: 5,
      socialPct: 0,
      maxRepoShare: 80,
      hourEntropy: 0.55,
      maxEventsPerHour: 15,
      desc: 'Manually configure all 11 behavioral metrics.'
    },
    gambling_bot: {
      label: 'Spam Gambling Bot (mccartyashley284)',
      events: 35,
      repos: 1,
      activeHours: 2,
      pushPct: 100,
      prPct: 0,
      issuePct: 0,
      createPct: 0,
      socialPct: 0,
      maxRepoShare: 100,
      hourEntropy: 0.12,
      maxEventsPerHour: 25,
      desc: 'Black-hat SEO gambling campaign pushing markdown backlink spam in rapid compressed bursts.'
    },
    forex_logger: {
      label: 'Forex EA Trading Logger (hiro-kurage)',
      events: 24,
      repos: 1,
      activeHours: 22,
      pushPct: 100,
      prPct: 0,
      issuePct: 0,
      createPct: 0,
      socialPct: 0,
      maxRepoShare: 100,
      hourEntropy: 0.95,
      maxEventsPerHour: 2,
      desc: 'Persistent cron logger committing trading bot status every 15-60 min across 22 hours daily.'
    },
    loop_spoofer: {
      label: 'Extreme Loop 100k Commits (nonkh)',
      events: 1868,
      repos: 1,
      activeHours: 78,
      pushPct: 100,
      prPct: 0,
      issuePct: 0,
      createPct: 0,
      socialPct: 0,
      maxRepoShare: 100,
      hourEntropy: 0.98,
      maxEventsPerHour: 120,
      desc: 'Contribution graph fraud script executing infinite loop commits 24/7 without sleep.'
    },
    human_dev: {
      label: 'Normal Human Developer (torvalds / VectoDE)',
      events: 45,
      repos: 4,
      activeHours: 8,
      pushPct: 55,
      prPct: 25,
      issuePct: 10,
      createPct: 5,
      socialPct: 5,
      maxRepoShare: 45,
      hourEntropy: 0.65,
      maxEventsPerHour: 8,
      desc: 'Typical software developer with balanced code commits, PR reviews, issue discussions, and circadian sleep pattern.'
    }
  };

  const THRESHOLD = 0.55139; // Top 5% Anomaly Threshold from model_metadata.json

  let modalElement = null;
  let activeTab = 'live'; // 'live' | 'manual'
  let lastLiveMetrics = null;

  function createModal() {
    if (document.getElementById('analyze-modal-root')) return;

    const modalHTML = `
      <div id="analyze-modal-root" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 hidden">
        <!-- Backdrop -->
        <div id="modal-backdrop" class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"></div>

        <!-- Modal Dialog Box -->
        <div class="relative w-full max-w-4xl bg-surface-container-lowest border border-border-subtle rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] modal-card-animate z-10">
          
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b border-border-subtle flex items-center justify-between bg-surface-muted/50">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-xs">
                <span class="material-symbols-outlined text-[20px]">smart_toy</span>
              </div>
              <div>
                <h3 class="font-headline-sm text-headline-sm text-on-surface tracking-tight">Analyze an Account</h3>
                <p class="font-body-sm text-body-sm text-secondary">Live GitHub API ingestion or 11-dimensional behavioral simulation</p>
              </div>
            </div>
            <button id="modal-close-btn" type="button" class="p-1.5 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-hover transition-colors cursor-pointer" aria-label="Close modal">
              <span class="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>

          <!-- Navigation Tabs Bar -->
          <div class="px-6 border-b border-border-subtle bg-surface-muted/30 flex items-center gap-1">
            <button id="tabBtnLive" type="button" class="flex items-center gap-2 px-4 py-3 font-label-md text-label-md font-semibold text-primary border-b-2 border-primary transition-all cursor-pointer">
              <span class="material-symbols-outlined text-[18px]">travel_explore</span>
              <span>Live GitHub URL / Username</span>
            </button>
            <button id="tabBtnManual" type="button" class="flex items-center gap-2 px-4 py-3 font-label-md text-label-md font-medium text-secondary hover:text-on-surface border-b-2 border-transparent transition-all cursor-pointer">
              <span class="material-symbols-outlined text-[18px]">tune</span>
              <span>Manual Feature Simulation</span>
            </button>
          </div>

          <!-- Modal Body (Scrollable) -->
          <div class="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6 text-on-surface">
            
            <!-- ============================================================== -->
            <!-- TAB 1: LIVE GITHUB ACCOUNT LOOKUP (DEFAULT ACTIVE)             -->
            <!-- ============================================================== -->
            <div id="tabPanelLive" class="space-y-5">
              
              <!-- Search Card -->
              <div class="p-5 rounded-xl bg-surface-container-low border border-border-subtle space-y-3.5">
                <div>
                  <label for="liveGithubInput" class="block font-label-md text-label-md text-on-surface font-semibold uppercase tracking-wider mb-1">
                    GitHub Profile URL or Username
                  </label>
                  <p class="font-body-sm text-body-sm text-secondary">
                    Input a GitHub username or complete URL. We fetch recent public events, extract 11 behavioral features, and run Isolation Forest anomaly detection.
                  </p>
                </div>

                <form id="liveSearchForm" class="flex flex-col sm:flex-row gap-2.5">
                  <div class="relative flex-1">
                    <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary text-[20px] pointer-events-none">search</span>
                    <input
                      id="liveGithubInput"
                      type="text"
                      placeholder="e.g. torvalds or https://github.com/mccartyashley284"
                      class="w-full bg-surface-container-lowest border border-border-subtle rounded-xl pl-10 pr-3.5 py-2.5 font-code-md text-code-md text-on-surface placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      autocomplete="off"
                      spellcheck="false"
                    />
                  </div>
                  <button
                    id="btnLiveAnalyze"
                    type="submit"
                    class="inline-flex items-center justify-center gap-2 bg-primary text-on-primary hover:bg-primary-container px-5 py-2.5 rounded-xl font-label-md text-label-md font-semibold shadow-sm transition-all whitespace-nowrap cursor-pointer"
                  >
                    <span class="material-symbols-outlined text-[18px]">travel_explore</span>
                    <span>Analyze Profile</span>
                  </button>
                </form>

                <!-- Quick-Fill Chips -->
                <div class="pt-1 flex flex-wrap items-center gap-2">
                  <span class="font-label-sm text-label-sm text-secondary font-semibold uppercase tracking-wider mr-1">
                    Quick-Fill:
                  </span>
                  <button
                    type="button"
                    data-username="mccartyashley284"
                    class="quick-chip px-3 py-1 rounded-full text-xs font-code-sm bg-surface-container-lowest hover:bg-surface-container-high text-on-surface border border-border-subtle transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                  >
                    <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span>mccartyashley284 (Spam Bot)</span>
                  </button>
                  <button
                    type="button"
                    data-username="hiro-kurage"
                    class="quick-chip px-3 py-1 rounded-full text-xs font-code-sm bg-surface-container-lowest hover:bg-surface-container-high text-on-surface border border-border-subtle transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                  >
                    <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>hiro-kurage (Forex EA)</span>
                  </button>
                  <button
                    type="button"
                    data-username="nonkh"
                    class="quick-chip px-3 py-1 rounded-full text-xs font-code-sm bg-surface-container-lowest hover:bg-surface-container-high text-on-surface border border-border-subtle transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                  >
                    <span class="w-2 h-2 rounded-full bg-purple-500"></span>
                    <span>nonkh (Commit Spoofer)</span>
                  </button>
                  <button
                    type="button"
                    data-username="torvalds"
                    class="quick-chip px-3 py-1 rounded-full text-xs font-code-sm bg-surface-container-lowest hover:bg-surface-container-high text-on-surface border border-border-subtle transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                  >
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>torvalds (Human Contributor)</span>
                  </button>
                </div>
              </div>

              <!-- Live Error Banner -->
              <div id="liveErrorAlert" class="hidden p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
                <span class="material-symbols-outlined text-rose-600 text-[22px] shrink-0">error</span>
                <div class="flex-1">
                  <span id="liveErrorMessage" class="font-medium">Error message placeholder</span>
                </div>
              </div>

              <!-- Live Loading Spinner -->
              <div id="liveLoading" class="hidden py-12 flex flex-col items-center justify-center space-y-3">
                <div class="w-10 h-10 border-3 border-border-subtle border-t-primary rounded-full animate-spin"></div>
                <p class="font-label-md text-label-md text-on-surface font-semibold">Fetching Public Events & Running Model Inference...</p>
                <p class="font-body-sm text-body-sm text-secondary">Contacting GitHub REST API and computing 11-dimensional behavioral features</p>
              </div>

              <!-- Live Result Container -->
              <div id="liveResultContainer" class="hidden space-y-5 animate-in fade-in">
                <!-- User Profile Header Card -->
                <div class="p-4 rounded-xl bg-surface-container-low border border-border-subtle flex items-start sm:items-center gap-4">
                  <img id="liveUserAvatar" src="" alt="Avatar" class="w-16 h-16 rounded-full border-2 border-border-subtle shrink-0 object-cover bg-surface-container-lowest" />
                  <div class="flex-1 min-w-0">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <h4 id="liveUserName" class="font-headline-sm text-headline-sm font-bold text-on-surface truncate">User Name</h4>
                        <a id="liveUserLink" href="#" target="_blank" rel="noopener noreferrer" class="font-code-sm text-code-sm text-primary hover:underline inline-flex items-center gap-1">
                          <span id="liveUserLogin">@username</span>
                          <span class="material-symbols-outlined text-[14px]">open_in_new</span>
                        </a>
                      </div>
                      <div class="flex flex-wrap items-center gap-2 text-xs">
                        <span class="px-2.5 py-1 rounded-md bg-surface-container-lowest border border-border-subtle font-code-sm text-secondary">
                          Repos: <strong id="liveUserRepos" class="text-on-surface">0</strong>
                        </span>
                        <span class="px-2.5 py-1 rounded-md bg-surface-container-lowest border border-border-subtle font-code-sm text-secondary">
                          Followers: <strong id="liveUserFollowers" class="text-on-surface">0</strong>
                        </span>
                        <span class="px-2.5 py-1 rounded-md bg-surface-container-lowest border border-border-subtle font-code-sm text-secondary">
                          Events Sampled: <strong id="liveUserEventsSampled" class="text-on-surface">100</strong>
                        </span>
                      </div>
                    </div>
                    <p id="liveUserBio" class="font-body-sm text-body-sm text-secondary mt-1.5 line-clamp-2">Bio text</p>
                  </div>
                </div>

                <!-- Extracted 11 Metrics Grid -->
                <div class="p-4 rounded-xl bg-surface-container-low border border-border-subtle space-y-3">
                  <div class="flex items-center justify-between border-b border-border-subtle/70 pb-2">
                    <div class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-[18px] text-primary">data_object</span>
                      <span class="font-label-md text-label-md text-on-surface font-semibold uppercase tracking-wider">11 Extracted Behavioral Features</span>
                    </div>
                    <button id="btnTransferToManual" type="button" class="text-xs text-primary hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer">
                      <span class="material-symbols-outlined text-[14px]">tune</span>
                      <span>Fine-Tune in Manual Mode</span>
                    </button>
                  </div>
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-code-sm text-code-sm">
                    <div class="p-2.5 rounded-lg bg-surface-container-lowest border border-border-subtle/60">
                      <span class="text-[11px] text-secondary uppercase block">Push Ratio</span>
                      <span id="liveMetricPush" class="text-sm font-semibold text-on-surface">100%</span>
                    </div>
                    <div class="p-2.5 rounded-lg bg-surface-container-lowest border border-border-subtle/60">
                      <span class="text-[11px] text-secondary uppercase block">PR / Review</span>
                      <span id="liveMetricPr" class="text-sm font-semibold text-on-surface">0%</span>
                    </div>
                    <div class="p-2.5 rounded-lg bg-surface-container-lowest border border-border-subtle/60">
                      <span class="text-[11px] text-secondary uppercase block">Issue Ratio</span>
                      <span id="liveMetricIssue" class="text-sm font-semibold text-on-surface">0%</span>
                    </div>
                    <div class="p-2.5 rounded-lg bg-surface-container-lowest border border-border-subtle/60">
                      <span class="text-[11px] text-secondary uppercase block">Create Ratio</span>
                      <span id="liveMetricCreate" class="text-sm font-semibold text-on-surface">0%</span>
                    </div>
                    <div class="p-2.5 rounded-lg bg-surface-container-lowest border border-border-subtle/60">
                      <span class="text-[11px] text-secondary uppercase block">Max Repo Share</span>
                      <span id="liveMetricRepoShare" class="text-sm font-semibold text-on-surface">100%</span>
                    </div>
                    <div class="p-2.5 rounded-lg bg-surface-container-lowest border border-border-subtle/60">
                      <span class="text-[11px] text-secondary uppercase block">Hour Entropy</span>
                      <span id="liveMetricEntropy" class="text-sm font-semibold text-on-surface">0.19</span>
                    </div>
                    <div class="p-2.5 rounded-lg bg-surface-container-lowest border border-border-subtle/60">
                      <span class="text-[11px] text-secondary uppercase block">Active Hours</span>
                      <span id="liveMetricActiveHours" class="text-sm font-semibold text-on-surface">2h / 152h</span>
                    </div>
                    <div class="p-2.5 rounded-lg bg-surface-container-lowest border border-border-subtle/60">
                      <span class="text-[11px] text-secondary uppercase block">Peak Burst/Hour</span>
                      <span id="liveMetricBurst" class="text-sm font-semibold text-on-surface">71 evt/h</span>
                    </div>
                  </div>
                </div>

                <!-- Prediction Card for Live -->
                <div class="p-5 rounded-2xl border border-border-subtle bg-surface-container-low space-y-5">
                  <!-- Header Status -->
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
                    <div class="flex items-center gap-2.5">
                      <span id="liveResStatusBadge" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        <span class="w-2 h-2 rounded-full"></span>
                        <span id="liveResStatusText">NORMAL</span>
                      </span>
                      <span id="liveResConfidence" class="font-code-sm text-code-sm text-secondary">Score: 0.410</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="font-label-md text-label-md text-secondary">Behavioral Cluster:</span>
                      <span id="liveResClusterBadge" class="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-surface-container-highest text-on-surface font-semibold font-code-sm text-code-sm">
                        Cluster 0: Heavy Pushers
                      </span>
                    </div>
                  </div>

                  <!-- Anomaly Score Meter -->
                  <div class="space-y-2">
                    <div class="flex items-center justify-between font-label-md text-label-md">
                      <span class="text-on-surface font-semibold">Anomaly Score Meter</span>
                      <div class="flex items-center gap-2 font-code-sm text-code-sm">
                        <span class="text-secondary">Cutoff Threshold:</span>
                        <span class="text-accent-anomaly font-semibold">0.551</span>
                      </div>
                    </div>
                    <div class="relative w-full h-4 bg-surface-container-highest rounded-full overflow-hidden p-0.5">
                      <div id="liveResScoreBar" class="h-full rounded-full transition-all duration-700 ease-out bg-accent-success" style="width: 41%;"></div>
                      <div class="absolute top-0 bottom-0 w-0.5 bg-red-600 z-10" style="left: 55.1%;" title="Threshold Cutoff (0.551)"></div>
                    </div>
                    <div class="flex justify-between text-[11px] font-code-sm text-secondary">
                      <span>0.00 (Standard Activity)</span>
                      <span class="text-red-500 font-medium">Cutoff (Top 5%)</span>
                      <span>1.00 (Extreme Outlier)</span>
                    </div>
                  </div>

                  <!-- PCA Coordinates -->
                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div class="bg-surface-container-lowest p-3 rounded-xl border border-border-subtle/60">
                      <span class="font-label-sm text-label-sm text-secondary uppercase">PC1 (Volume/Burst)</span>
                      <div id="liveResPC1" class="font-code-md text-code-md font-semibold text-on-surface mt-1">+1.37</div>
                    </div>
                    <div class="bg-surface-container-lowest p-3 rounded-xl border border-border-subtle/60">
                      <span class="font-label-sm text-label-sm text-secondary uppercase">PC2 (Interaction Type)</span>
                      <div id="liveResPC2" class="font-code-md text-code-md font-semibold text-on-surface mt-1">-2.27</div>
                    </div>
                    <div class="bg-surface-container-lowest p-3 rounded-xl border border-border-subtle/60 col-span-2 sm:col-span-1">
                      <span class="font-label-sm text-label-sm text-secondary uppercase">Decision State</span>
                      <div id="liveResDecisionPill" class="font-code-md text-code-md font-semibold text-accent-success mt-1">Normal Human</div>
                    </div>
                  </div>

                  <!-- Cluster Profile Characteristics -->
                  <div class="bg-surface-container-lowest p-4 rounded-xl border border-border-subtle/80 space-y-2">
                    <div class="flex items-center gap-2 font-label-md text-label-md text-on-surface font-semibold">
                      <span class="material-symbols-outlined text-[18px] text-primary">fact_check</span>
                      <span>Cluster Characteristics & Forensic Profile Insight</span>
                    </div>
                    <ul id="liveResCharacteristics" class="list-disc list-inside space-y-1 font-body-sm text-body-sm text-secondary">
                      <li>Aktivitas wajar dengan ritme sirkadian organik.</li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>

            <!-- ============================================================== -->
            <!-- TAB 2: MANUAL FEATURE SIMULATION (SLIDERS & PRESETS)           -->
            <!-- ============================================================== -->
            <div id="tabPanelManual" class="space-y-6 hidden">
              
              <!-- Preset Selector Card -->
              <div class="p-4 rounded-xl bg-surface-container-low border border-border-subtle space-y-2">
                <label for="accountPresetSelect" class="block font-label-md text-label-md text-on-surface font-semibold uppercase tracking-wider">
                  Select Account Archetype Preset
                </label>
                <div class="relative">
                  <select id="accountPresetSelect" class="w-full appearance-none bg-surface-container-lowest border border-border-subtle rounded-lg px-3.5 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
                    <option value="custom">⚙️ Custom Input</option>
                    <option value="gambling_bot">🚨 Spam Gambling Bot (mccartyashley284)</option>
                    <option value="forex_logger">📈 Forex EA Trading Logger (hiro-kurage)</option>
                    <option value="loop_spoofer">🔄 Extreme Loop 100k Commits (nonkh)</option>
                    <option value="human_dev">👤 Normal Human Developer (torvalds / VectoDE)</option>
                  </select>
                  <span class="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]">expand_more</span>
                </div>
                <p id="presetDescription" class="font-body-sm text-body-sm text-secondary pt-1">
                  Manually configure all 11 behavioral metrics.
                </p>
              </div>

              <!-- Form: 11 Behavioral Metrics -->
              <form id="analyzeForm" class="space-y-5">
                <div class="flex items-center justify-between pb-1 border-b border-border-subtle/70">
                  <span class="font-label-md text-label-md text-secondary font-semibold uppercase tracking-wider">11 Behavioral Feature Vector</span>
                  <span class="font-code-sm text-code-sm text-secondary">Block Observation: 78h</span>
                </div>

                <!-- Metric Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  
                  <!-- 1. Events -->
                  <div class="space-y-1.5">
                    <div class="flex items-center justify-between">
                      <label class="font-label-md text-label-md text-on-surface font-medium" for="inEvents">Events (Total Actions)</label>
                      <input id="inEventsNum" type="number" min="1" max="100000" class="w-24 text-right font-code-sm text-code-sm border border-border-subtle rounded px-2 py-0.5 bg-surface-container-lowest" />
                    </div>
                    <input id="inEvents" type="range" min="1" max="5000" class="metric-slider" />
                    <div class="flex justify-between text-[11px] text-secondary font-code-sm">
                      <span>1</span>
                      <span>5,000+</span>
                    </div>
                  </div>

                  <!-- 2. Repos -->
                  <div class="space-y-1.5">
                    <div class="flex items-center justify-between">
                      <label class="font-label-md text-label-md text-on-surface font-medium" for="inRepos">Repositories Targeted</label>
                      <input id="inReposNum" type="number" min="1" max="100" class="w-20 text-right font-code-sm text-code-sm border border-border-subtle rounded px-2 py-0.5 bg-surface-container-lowest" />
                    </div>
                    <input id="inRepos" type="range" min="1" max="50" class="metric-slider" />
                    <div class="flex justify-between text-[11px] text-secondary font-code-sm">
                      <span>1 repo</span>
                      <span>50 repos</span>
                    </div>
                  </div>

                  <!-- 3. Active Hours -->
                  <div class="space-y-1.5">
                    <div class="flex items-center justify-between">
                      <label class="font-label-md text-label-md text-on-surface font-medium" for="inActiveHours">Active Hours (in 78h)</label>
                      <input id="inActiveHoursNum" type="number" min="1" max="78" class="w-20 text-right font-code-sm text-code-sm border border-border-subtle rounded px-2 py-0.5 bg-surface-container-lowest" />
                    </div>
                    <input id="inActiveHours" type="range" min="1" max="78" class="metric-slider" />
                    <div class="flex justify-between text-[11px] text-secondary font-code-sm">
                      <span>1h (Spike)</span>
                      <span>78h (24/7 Loop)</span>
                    </div>
                  </div>

                  <!-- 4. Push % -->
                  <div class="space-y-1.5">
                    <div class="flex items-center justify-between">
                      <label class="font-label-md text-label-md text-on-surface font-medium" for="inPushPct">Push Ratio (%)</label>
                      <input id="inPushPctNum" type="number" min="0" max="100" class="w-20 text-right font-code-sm text-code-sm border border-border-subtle rounded px-2 py-0.5 bg-surface-container-lowest" />
                    </div>
                    <input id="inPushPct" type="range" min="0" max="100" class="metric-slider" />
                    <div class="flex justify-between text-[11px] text-secondary font-code-sm">
                      <span>0%</span>
                      <span>100% (Commit Bot)</span>
                    </div>
                  </div>

                  <!-- 5. PR % -->
                  <div class="space-y-1.5">
                    <div class="flex items-center justify-between">
                      <label class="font-label-md text-label-md text-on-surface font-medium" for="inPrPct">Pull Request Ratio (%)</label>
                      <input id="inPrPctNum" type="number" min="0" max="100" class="w-20 text-right font-code-sm text-code-sm border border-border-subtle rounded px-2 py-0.5 bg-surface-container-lowest" />
                    </div>
                    <input id="inPrPct" type="range" min="0" max="100" class="metric-slider" />
                    <div class="flex justify-between text-[11px] text-secondary font-code-sm">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <!-- 6. Issue % -->
                  <div class="space-y-1.5">
                    <div class="flex items-center justify-between">
                      <label class="font-label-md text-label-md text-on-surface font-medium" for="inIssuePct">Issue Interaction Ratio (%)</label>
                      <input id="inIssuePctNum" type="number" min="0" max="100" class="w-20 text-right font-code-sm text-code-sm border border-border-subtle rounded px-2 py-0.5 bg-surface-container-lowest" />
                    </div>
                    <input id="inIssuePct" type="range" min="0" max="100" class="metric-slider" />
                    <div class="flex justify-between text-[11px] text-secondary font-code-sm">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <!-- 7. Create % -->
                  <div class="space-y-1.5">
                    <div class="flex items-center justify-between">
                      <label class="font-label-md text-label-md text-on-surface font-medium" for="inCreatePct">Create Branch/Repo Ratio (%)</label>
                      <input id="inCreatePctNum" type="number" min="0" max="100" class="w-20 text-right font-code-sm text-code-sm border border-border-subtle rounded px-2 py-0.5 bg-surface-container-lowest" />
                    </div>
                    <input id="inCreatePct" type="range" min="0" max="100" class="metric-slider" />
                    <div class="flex justify-between text-[11px] text-secondary font-code-sm">
                      <span>0%</span>
                      <span>100% (CI Runner)</span>
                    </div>
                  </div>

                  <!-- 8. Social % -->
                  <div class="space-y-1.5">
                    <div class="flex items-center justify-between">
                      <label class="font-label-md text-label-md text-on-surface font-medium" for="inSocialPct">Social Watch/Fork Ratio (%)</label>
                      <input id="inSocialPctNum" type="number" min="0" max="100" class="w-20 text-right font-code-sm text-code-sm border border-border-subtle rounded px-2 py-0.5 bg-surface-container-lowest" />
                    </div>
                    <input id="inSocialPct" type="range" min="0" max="100" class="metric-slider" />
                    <div class="flex justify-between text-[11px] text-secondary font-code-sm">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <!-- 9. Max Repo Share -->
                  <div class="space-y-1.5">
                    <div class="flex items-center justify-between">
                      <label class="font-label-md text-label-md text-on-surface font-medium" for="inMaxRepoShare">Max Repo Share (%)</label>
                      <input id="inMaxRepoShareNum" type="number" min="0" max="100" class="w-20 text-right font-code-sm text-code-sm border border-border-subtle rounded px-2 py-0.5 bg-surface-container-lowest" />
                    </div>
                    <input id="inMaxRepoShare" type="range" min="0" max="100" class="metric-slider" />
                    <div class="flex justify-between text-[11px] text-secondary font-code-sm">
                      <span>Distributed (0%)</span>
                      <span>Single Repo Focus (100%)</span>
                    </div>
                  </div>

                  <!-- 10. Hour Entropy -->
                  <div class="space-y-1.5">
                    <div class="flex items-center justify-between">
                      <label class="font-label-md text-label-md text-on-surface font-medium" for="inHourEntropy">Hour Entropy (Circadian Uniformity)</label>
                      <input id="inHourEntropyNum" type="number" min="0" max="1" step="0.01" class="w-20 text-right font-code-sm text-code-sm border border-border-subtle rounded px-2 py-0.5 bg-surface-container-lowest" />
                    </div>
                    <input id="inHourEntropy" type="range" min="0" max="100" class="metric-slider" />
                    <div class="flex justify-between text-[11px] text-secondary font-code-sm">
                      <span>0.00 (Single Hour)</span>
                      <span>1.00 (Flat 24h Robot)</span>
                    </div>
                  </div>

                  <!-- 11. Max Events/Hour -->
                  <div class="space-y-1.5 md:col-span-2">
                    <div class="flex items-center justify-between">
                      <label class="font-label-md text-label-md text-on-surface font-medium" for="inMaxPerHour">Max Events in a Single Hour (Burst Rate)</label>
                      <input id="inMaxPerHourNum" type="number" min="1" max="1000" class="w-24 text-right font-code-sm text-code-sm border border-border-subtle rounded px-2 py-0.5 bg-surface-container-lowest" />
                    </div>
                    <input id="inMaxPerHour" type="range" min="1" max="300" class="metric-slider" />
                    <div class="flex justify-between text-[11px] text-secondary font-code-sm">
                      <span>1 event/hour</span>
                      <span>300+ events/hour</span>
                    </div>
                  </div>

                </div>

                <!-- Submit Buttons -->
                <div class="pt-2 flex items-center justify-end gap-3">
                  <button id="btnResetMetrics" type="button" class="px-4 py-2 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-hover font-label-md text-label-md transition-colors cursor-pointer">
                    Reset
                  </button>
                  <button id="btnRunAnalysis" type="submit" class="inline-flex items-center gap-2 bg-primary text-on-primary hover:bg-primary-container px-5 py-2.5 rounded-lg font-label-md text-label-md shadow-sm transition-all cursor-pointer">
                    <span class="material-symbols-outlined text-[18px]">play_arrow</span>
                    <span class="font-semibold">Run Analysis</span>
                  </button>
                </div>
              </form>

              <!-- Loading Spinner State -->
              <div id="analysisLoading" class="hidden py-12 flex flex-col items-center justify-center space-y-3">
                <div class="w-10 h-10 border-3 border-border-subtle border-t-primary rounded-full animate-spin"></div>
                <p class="font-label-md text-label-md text-on-surface font-semibold">Running Isolation Forest & K-Means Inference...</p>
                <p class="font-body-sm text-body-sm text-secondary">Computing 11-dimensional feature projection and anomaly density</p>
              </div>

              <!-- Prediction Result Card (Slide-in) -->
              <div id="analysisResult" class="hidden p-5 rounded-2xl border border-border-subtle bg-surface-container-low space-y-5 animate-in fade-in">
                
                <!-- Result Status Header -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
                  <div class="flex items-center gap-2.5">
                    <span id="resStatusBadge" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      <span class="w-2 h-2 rounded-full"></span>
                      <span id="resStatusText">BOT ANOMALY</span>
                    </span>
                    <span id="resConfidence" class="font-code-sm text-code-sm text-secondary">Score: 0.781</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="font-label-md text-label-md text-secondary">Behavioral Cluster:</span>
                    <span id="resClusterBadge" class="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-surface-container-highest text-on-surface font-semibold font-code-sm text-code-sm">
                      Cluster 3: Automated CI / Bots
                    </span>
                  </div>
                </div>

                <!-- Anomaly Score Meter vs Threshold -->
                <div class="space-y-2">
                  <div class="flex items-center justify-between font-label-md text-label-md">
                    <span class="text-on-surface font-semibold">Anomaly Score Meter</span>
                    <div class="flex items-center gap-2 font-code-sm text-code-sm">
                      <span class="text-secondary">Cutoff Threshold:</span>
                      <span class="text-accent-anomaly font-semibold">0.551</span>
                    </div>
                  </div>
                  <!-- Progress track -->
                  <div class="relative w-full h-4 bg-surface-container-highest rounded-full overflow-hidden p-0.5">
                    <div id="resScoreBar" class="h-full rounded-full transition-all duration-700 ease-out bg-accent-anomaly" style="width: 78%;"></div>
                    <!-- Cutoff Marker line -->
                    <div class="absolute top-0 bottom-0 w-0.5 bg-red-600 z-10" style="left: 55.1%;" title="Threshold Cutoff (0.551)"></div>
                  </div>
                  <div class="flex justify-between text-[11px] font-code-sm text-secondary">
                    <span>0.00 (Standard Activity)</span>
                    <span class="text-red-500 font-medium">Cutoff (Top 5%)</span>
                    <span>1.00 (Extreme Outlier)</span>
                  </div>
                </div>

                <!-- PCA Projection Coordinates -->
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div class="bg-surface-container-lowest p-3 rounded-xl border border-border-subtle/60">
                    <span class="font-label-sm text-label-sm text-secondary uppercase">PC1 (Volume/Burst)</span>
                    <div id="resPC1" class="font-code-md text-code-md font-semibold text-on-surface mt-1">+2.41</div>
                  </div>
                  <div class="bg-surface-container-lowest p-3 rounded-xl border border-border-subtle/60">
                    <span class="font-label-sm text-label-sm text-secondary uppercase">PC2 (Interaction Type)</span>
                    <div id="resPC2" class="font-code-md text-code-md font-semibold text-on-surface mt-1">-1.15</div>
                  </div>
                  <div class="bg-surface-container-lowest p-3 rounded-xl border border-border-subtle/60 col-span-2 sm:col-span-1">
                    <span class="font-label-sm text-label-sm text-secondary uppercase">Decision Confidence</span>
                    <div id="resDecisionPill" class="font-code-md text-code-md font-semibold text-accent-anomaly mt-1">High Confidence</div>
                  </div>
                </div>

                <!-- Recommendation & Forensic Explanation -->
                <div class="bg-surface-container-lowest p-4 rounded-xl border border-border-subtle/80 space-y-2">
                  <div class="flex items-center gap-2 font-label-md text-label-md text-on-surface font-semibold">
                    <span class="material-symbols-outlined text-[18px] text-primary">fact_check</span>
                    <span>Forensic Recommendation & Profile Insight</span>
                  </div>
                  <p id="resRecommendation" class="font-body-sm text-body-sm text-secondary leading-relaxed">
                    Pola push 100% terisolasi pada satu repositori dengan entropi jam 0.98 mengindikasikan otomasi non-stop commit spoofer untuk manipulasi grafik kontribusi.
                  </p>
                </div>

                <!-- Action buttons in result -->
                <div class="flex items-center justify-end gap-2 pt-1">
                  <button id="btnModifyInput" type="button" class="px-4 py-2 rounded-lg bg-surface-container-lowest hover:bg-surface-hover text-on-surface font-label-md text-label-md border border-border-subtle transition-colors cursor-pointer">
                    Adjust Metrics
                  </button>
                </div>

              </div>

            </div>

          </div>

          <!-- Modal Footer -->
          <div class="px-6 py-3 border-t border-border-subtle bg-surface-muted/30 flex items-center justify-between text-secondary">
            <div class="flex items-center gap-1.5 font-code-sm text-code-sm">
              <span class="material-symbols-outlined text-[14px]">shield</span>
              <span>Trained on 15,213 GitHub Accounts · 11 Features</span>
            </div>
            <button id="modal-footer-close" type="button" class="font-label-md text-label-md text-secondary hover:text-on-surface cursor-pointer">
              Close
            </button>
          </div>

        </div>
      </div>
    `;

    const container = document.createElement('div');
    container.innerHTML = modalHTML;
    document.body.appendChild(container.firstElementChild);

    modalElement = document.getElementById('analyze-modal-root');
    bindModalEvents();
  }

  function bindModalEvents() {
    if (!modalElement) return;

    // Close buttons & backdrop
    const closeBtn = document.getElementById('modal-close-btn');
    const footerClose = document.getElementById('modal-footer-close');
    const backdrop = document.getElementById('modal-backdrop');

    [closeBtn, footerClose, backdrop].forEach((el) => {
      if (el) el.addEventListener('click', closeModal);
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modalElement.classList.contains('hidden')) {
        closeModal();
      }
    });

    // Tab Navigation
    const tabBtnLive = document.getElementById('tabBtnLive');
    const tabBtnManual = document.getElementById('tabBtnManual');

    if (tabBtnLive) tabBtnLive.addEventListener('click', () => switchTab('live'));
    if (tabBtnManual) tabBtnManual.addEventListener('click', () => switchTab('manual'));

    // --- Tab 1: Live Search Events ---
    const liveForm = document.getElementById('liveSearchForm');
    if (liveForm) {
      liveForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('liveGithubInput');
        if (input && input.value.trim()) {
          runLiveAnalysis(input.value.trim());
        }
      });
    }

    // Quick-Fill Chips
    document.querySelectorAll('.quick-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const username = chip.getAttribute('data-username');
        const input = document.getElementById('liveGithubInput');
        if (input) input.value = username;
        runLiveAnalysis(username);
      });
    });

    // Transfer live metrics to manual tab
    const btnTransfer = document.getElementById('btnTransferToManual');
    if (btnTransfer) {
      btnTransfer.addEventListener('click', () => {
        if (lastLiveMetrics) {
          transferLiveToManual(lastLiveMetrics);
          switchTab('manual');
        }
      });
    }

    // --- Tab 2: Manual Events ---
    const presetSelect = document.getElementById('accountPresetSelect');
    const form = document.getElementById('analyzeForm');
    const resetBtn = document.getElementById('btnResetMetrics');
    const modifyBtn = document.getElementById('btnModifyInput');

    if (presetSelect) {
      presetSelect.addEventListener('change', (e) => {
        applyPreset(e.target.value);
      });
    }

    // Sync sliders and number inputs
    setupSliderSync('inEvents', 'inEventsNum', 1);
    setupSliderSync('inRepos', 'inReposNum', 1);
    setupSliderSync('inActiveHours', 'inActiveHoursNum', 1);
    setupSliderSync('inPushPct', 'inPushPctNum', 1);
    setupSliderSync('inPrPct', 'inPrPctNum', 1);
    setupSliderSync('inIssuePct', 'inIssuePctNum', 1);
    setupSliderSync('inCreatePct', 'inCreatePctNum', 1);
    setupSliderSync('inSocialPct', 'inSocialPctNum', 1);
    setupSliderSync('inMaxRepoShare', 'inMaxRepoShareNum', 1);
    setupSliderSync('inHourEntropy', 'inHourEntropyNum', 0.01);
    setupSliderSync('inMaxPerHour', 'inMaxPerHourNum', 1);

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        runAnalysis();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (presetSelect) presetSelect.value = 'custom';
        applyPreset('custom');
      });
    }

    if (modifyBtn) {
      modifyBtn.addEventListener('click', () => {
        const resCard = document.getElementById('analysisResult');
        const aForm = document.getElementById('analyzeForm');
        if (resCard) resCard.classList.add('hidden');
        if (aForm) aForm.classList.remove('hidden');
      });
    }

    // Apply default preset (Custom)
    applyPreset('custom');
  }

  function switchTab(tab) {
    activeTab = tab;
    const tabBtnLive = document.getElementById('tabBtnLive');
    const tabBtnManual = document.getElementById('tabBtnManual');
    const panelLive = document.getElementById('tabPanelLive');
    const panelManual = document.getElementById('tabPanelManual');

    if (tab === 'live') {
      if (tabBtnLive) {
        tabBtnLive.className = 'flex items-center gap-2 px-4 py-3 font-label-md text-label-md font-semibold text-primary border-b-2 border-primary transition-all cursor-pointer';
      }
      if (tabBtnManual) {
        tabBtnManual.className = 'flex items-center gap-2 px-4 py-3 font-label-md text-label-md font-medium text-secondary hover:text-on-surface border-b-2 border-transparent transition-all cursor-pointer';
      }
      if (panelLive) panelLive.classList.remove('hidden');
      if (panelManual) panelManual.classList.add('hidden');
    } else {
      if (tabBtnManual) {
        tabBtnManual.className = 'flex items-center gap-2 px-4 py-3 font-label-md text-label-md font-semibold text-primary border-b-2 border-primary transition-all cursor-pointer';
      }
      if (tabBtnLive) {
        tabBtnLive.className = 'flex items-center gap-2 px-4 py-3 font-label-md text-label-md font-medium text-secondary hover:text-on-surface border-b-2 border-transparent transition-all cursor-pointer';
      }
      if (panelManual) panelManual.classList.remove('hidden');
      if (panelLive) panelLive.classList.add('hidden');
    }
  }

  // --- Live GitHub Analysis Function ---
  async function runLiveAnalysis(usernameOrUrl) {
    const errorAlert = document.getElementById('liveErrorAlert');
    const errorMsg = document.getElementById('liveErrorMessage');
    const loading = document.getElementById('liveLoading');
    const resultContainer = document.getElementById('liveResultContainer');
    const analyzeBtn = document.getElementById('btnLiveAnalyze');

    if (errorAlert) errorAlert.classList.add('hidden');
    if (resultContainer) resultContainer.classList.add('hidden');
    if (loading) loading.classList.remove('hidden');
    if (analyzeBtn) analyzeBtn.disabled = true;

    try {
      const response = await fetch(`/api/analyze-github?username=${encodeURIComponent(usernameOrUrl)}`);
      
      if (!response.ok) {
        let errMsg = `Server returned HTTP ${response.status}`;
        try {
          const errData = await response.json();
          if (errData && errData.detail) errMsg = errData.detail;
        } catch (_) {}
        throw new Error(errMsg);
      }

      const data = await response.json();
      lastLiveMetrics = data;
      renderLiveResult(data);
      if (resultContainer) resultContainer.classList.remove('hidden');
    } catch (err) {
      console.error('Live analysis failed:', err);
      if (errorMsg) errorMsg.textContent = err.message || 'Failed to analyze GitHub account.';
      if (errorAlert) errorAlert.classList.remove('hidden');
    } finally {
      if (loading) loading.classList.add('hidden');
      if (analyzeBtn) analyzeBtn.disabled = false;
    }
  }

  function renderLiveResult(data) {
    const user = data.user_info || {};
    const raw = data.raw_metrics || {};
    const pred = data.prediction || {};

    // 1. User Profile Header
    const avatar = document.getElementById('liveUserAvatar');
    const nameEl = document.getElementById('liveUserName');
    const loginEl = document.getElementById('liveUserLogin');
    const linkEl = document.getElementById('liveUserLink');
    const bioEl = document.getElementById('liveUserBio');
    const reposEl = document.getElementById('liveUserRepos');
    const followersEl = document.getElementById('liveUserFollowers');
    const sampledEl = document.getElementById('liveUserEventsSampled');

    if (avatar) avatar.src = user.avatar_url || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
    if (nameEl) nameEl.textContent = user.name || user.username || 'GitHub Contributor';
    if (loginEl) loginEl.textContent = `@${user.username || ''}`;
    if (linkEl) linkEl.href = user.html_url || `https://github.com/${user.username}`;
    if (bioEl) {
      bioEl.textContent = user.bio || 'No public bio provided.';
      bioEl.style.display = user.bio ? 'block' : 'none';
    }
    if (reposEl) reposEl.textContent = user.public_repos !== undefined ? user.public_repos : '-';
    if (followersEl) followersEl.textContent = user.followers !== undefined ? user.followers : '-';
    if (sampledEl) sampledEl.textContent = raw.n_events || 0;

    // 2. Extracted Metrics Grid
    const mPush = document.getElementById('liveMetricPush');
    const mPr = document.getElementById('liveMetricPr');
    const mIssue = document.getElementById('liveMetricIssue');
    const mCreate = document.getElementById('liveMetricCreate');
    const mRepoShare = document.getElementById('liveMetricRepoShare');
    const mEntropy = document.getElementById('liveMetricEntropy');
    const mActiveHours = document.getElementById('liveMetricActiveHours');
    const mBurst = document.getElementById('liveMetricBurst');

    if (mPush) mPush.textContent = `${Math.round((raw.push_ratio || 0) * 100)}%`;
    if (mPr) mPr.textContent = `${Math.round((raw.pr_ratio || 0) * 100)}%`;
    if (mIssue) mIssue.textContent = `${Math.round((raw.issue_ratio || 0) * 100)}%`;
    if (mCreate) mCreate.textContent = `${Math.round((raw.create_ratio || 0) * 100)}%`;
    if (mRepoShare) mRepoShare.textContent = `${Math.round((raw.max_repo_share || 0) * 100)}%`;
    if (mEntropy) mEntropy.textContent = typeof raw.hour_entropy === 'number' ? raw.hour_entropy.toFixed(2) : '-';
    if (mActiveHours) mActiveHours.textContent = `${raw.active_hours || 0}h / 152h`;
    if (mBurst) mBurst.textContent = `${raw.max_per_hour || 0} evt/h`;

    // 3. Prediction Card
    const threshold = typeof pred.threshold === 'number' ? pred.threshold : THRESHOLD;
    const score = typeof pred.score === 'number' ? pred.score : 0.5;
    const isAnomaly = typeof pred.is_anomaly === 'boolean' ? pred.is_anomaly : score >= threshold;

    const badge = document.getElementById('liveResStatusBadge');
    const badgeText = document.getElementById('liveResStatusText');
    const confidence = document.getElementById('liveResConfidence');

    if (badge && badgeText) {
      if (isAnomaly) {
        badge.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-accent-anomaly/10 text-accent-anomaly border border-accent-anomaly/30 pulse-anomaly';
        badge.querySelector('.w-2').className = 'w-2 h-2 rounded-full bg-accent-anomaly';
        badgeText.textContent = 'BOT ANOMALY';
      } else {
        badge.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-accent-success/10 text-accent-success border border-accent-success/30';
        badge.querySelector('.w-2').className = 'w-2 h-2 rounded-full bg-accent-success';
        badgeText.textContent = 'NORMAL BEHAVIOR';
      }
    }

    if (confidence) {
      confidence.textContent = `Score: ${score.toFixed(3)} (Threshold: ${threshold.toFixed(3)})`;
    }

    const clusterEl = document.getElementById('liveResClusterBadge');
    if (clusterEl) {
      const cId = pred.cluster_id !== undefined ? pred.cluster_id : 0;
      const cTitle = pred.cluster_title || `Cluster ${cId}`;
      const cBadge = pred.cluster_badge ? ` (${pred.cluster_badge})` : '';
      clusterEl.textContent = `${cTitle}${cBadge}`;
    }

    const scoreBar = document.getElementById('liveResScoreBar');
    if (scoreBar) {
      const pct = Math.max(2, Math.min(100, Math.round(score * 100)));
      scoreBar.style.width = pct + '%';
      scoreBar.className = isAnomaly
        ? 'h-full rounded-full transition-all duration-700 ease-out bg-accent-anomaly'
        : 'h-full rounded-full transition-all duration-700 ease-out bg-accent-success';
    }

    const pc1El = document.getElementById('liveResPC1');
    const pc2El = document.getElementById('liveResPC2');
    const decisionPill = document.getElementById('liveResDecisionPill');

    const pc1Val = pred.pc1 !== undefined ? pred.pc1 : 0;
    const pc2Val = pred.pc2 !== undefined ? pred.pc2 : 0;

    if (pc1El) pc1El.textContent = (pc1Val >= 0 ? '+' : '') + Number(pc1Val).toFixed(2);
    if (pc2El) pc2El.textContent = (pc2Val >= 0 ? '+' : '') + Number(pc2Val).toFixed(2);

    if (decisionPill) {
      if (isAnomaly) {
        decisionPill.textContent = score >= 0.70 ? 'Extreme Outlier' : 'Anomaly Candidate';
        decisionPill.className = 'font-code-md text-code-md font-semibold text-accent-anomaly mt-1';
      } else {
        decisionPill.textContent = 'Normal Human';
        decisionPill.className = 'font-code-md text-code-md font-semibold text-accent-success mt-1';
      }
    }

    const charList = document.getElementById('liveResCharacteristics');
    if (charList) {
      charList.innerHTML = '';
      if (Array.isArray(pred.cluster_characteristics) && pred.cluster_characteristics.length > 0) {
        pred.cluster_characteristics.forEach((item) => {
          const li = document.createElement('li');
          li.textContent = item;
          charList.appendChild(li);
        });
      } else {
        const li = document.createElement('li');
        li.textContent = isAnomaly
          ? 'Skor anomali melampaui batas kritis model 0.551 (top 5% deviasi bot).'
          : 'Pola interaksi kolaboratif dan jam kerja seimbang sesuai pengembang manusia wajar.';
        charList.appendChild(li);
      }
    }
  }

  function transferLiveToManual(liveData) {
    const raw = liveData.raw_metrics || {};
    const select = document.getElementById('accountPresetSelect');
    if (select) select.value = 'custom';

    const descEl = document.getElementById('presetDescription');
    if (descEl && liveData.user_info) {
      descEl.textContent = `Configured from live GitHub profile @${liveData.user_info.username}`;
    }

    setMetricValues({
      events: raw.n_events || 50,
      repos: raw.n_repos || 1,
      activeHours: Math.min(raw.active_hours || 12, 78),
      pushPct: Math.round((raw.push_ratio || 0) * 100),
      prPct: Math.round((raw.pr_ratio || 0) * 100),
      issuePct: Math.round((raw.issue_ratio || 0) * 100),
      createPct: Math.round((raw.create_ratio || 0) * 100),
      socialPct: Math.round((raw.social_ratio || 0) * 100),
      maxRepoShare: Math.round((raw.max_repo_share || 1) * 100),
      hourEntropy: raw.hour_entropy || 0.5,
      maxEventsPerHour: raw.max_per_hour || 1
    });

    const form = document.getElementById('analyzeForm');
    const resultCard = document.getElementById('analysisResult');
    if (form) form.classList.remove('hidden');
    if (resultCard) resultCard.classList.add('hidden');
  }

  // --- Manual Simulation Setup & Helpers ---
  function setupSliderSync(sliderId, numId, stepScale) {
    const slider = document.getElementById(sliderId);
    const num = document.getElementById(numId);
    if (!slider || !num) return;

    slider.addEventListener('input', () => {
      if (stepScale < 1) {
        num.value = (parseFloat(slider.value) * stepScale).toFixed(2);
      } else {
        num.value = slider.value;
      }
    });

    num.addEventListener('input', () => {
      if (stepScale < 1) {
        slider.value = Math.round(parseFloat(num.value || 0) / stepScale);
      } else {
        slider.value = num.value;
      }
    });
  }

  function setMetricValues(vals) {
    const setVal = (sliderId, numId, v, isEntropy) => {
      const s = document.getElementById(sliderId);
      const n = document.getElementById(numId);
      if (s) s.value = isEntropy ? Math.round(v * 100) : v;
      if (n) n.value = isEntropy ? Number(v).toFixed(2) : v;
    };

    setVal('inEvents', 'inEventsNum', vals.events);
    setVal('inRepos', 'inReposNum', vals.repos);
    setVal('inActiveHours', 'inActiveHoursNum', vals.activeHours);
    setVal('inPushPct', 'inPushPctNum', vals.pushPct);
    setVal('inPrPct', 'inPrPctNum', vals.prPct);
    setVal('inIssuePct', 'inIssuePctNum', vals.issuePct);
    setVal('inCreatePct', 'inCreatePctNum', vals.createPct);
    setVal('inSocialPct', 'inSocialPctNum', vals.socialPct);
    setVal('inMaxRepoShare', 'inMaxRepoShareNum', vals.maxRepoShare);
    setVal('inHourEntropy', 'inHourEntropyNum', vals.hourEntropy, true);
    setVal('inMaxPerHour', 'inMaxPerHourNum', vals.maxEventsPerHour);
  }

  function applyPreset(key) {
    const preset = PRESETS[key] || PRESETS.custom;
    setMetricValues(preset);

    const descEl = document.getElementById('presetDescription');
    if (descEl) descEl.textContent = preset.desc;
  }

  function getFormMetrics() {
    const events = parseFloat(document.getElementById('inEventsNum')?.value) || 1;
    const repos = parseFloat(document.getElementById('inReposNum')?.value) || 1;
    const activeHours = parseFloat(document.getElementById('inActiveHoursNum')?.value) || 1;
    const pushPct = parseFloat(document.getElementById('inPushPctNum')?.value) || 0;
    const prPct = parseFloat(document.getElementById('inPrPctNum')?.value) || 0;
    const issuePct = parseFloat(document.getElementById('inIssuePctNum')?.value) || 0;
    const createPct = parseFloat(document.getElementById('inCreatePctNum')?.value) || 0;
    const socialPct = parseFloat(document.getElementById('inSocialPctNum')?.value) || 0;
    const maxRepoShare = parseFloat(document.getElementById('inMaxRepoShareNum')?.value) || 0;
    const hourEntropy = parseFloat(document.getElementById('inHourEntropyNum')?.value) || 0;
    const maxEventsPerHour = parseFloat(document.getElementById('inMaxPerHourNum')?.value) || 1;

    return {
      n_events: events,
      n_repos: repos,
      jam_aktif: activeHours,
      frac_push: pushPct / 100,
      frac_create: createPct / 100,
      frac_pr: prPct / 100,
      frac_issue: issuePct / 100,
      frac_social: socialPct / 100,
      max_repo_share: maxRepoShare / 100,
      hour_entropy: hourEntropy,
      max_per_hour: maxEventsPerHour,
      active_frac: activeHours / 78,
      events,
      repos,
      activeHours,
      pushPct,
      prPct,
      issuePct,
      createPct,
      socialPct,
      maxRepoShare,
      maxEventsPerHour,
      features: {
        log_n: Math.log1p(events),
        frac_push: pushPct / 100,
        frac_create: createPct / 100,
        frac_pr: prPct / 100,
        frac_issue: issuePct / 100,
        frac_social: socialPct / 100,
        log_events_per_repo: Math.log1p(events / repos),
        max_repo_share: maxRepoShare / 100,
        hour_entropy: hourEntropy,
        active_frac: activeHours / 78,
        log_max_per_hour: Math.log1p(maxEventsPerHour)
      }
    };
  }

  async function runAnalysis() {
    const payload = getFormMetrics();
    const form = document.getElementById('analyzeForm');
    const loading = document.getElementById('analysisLoading');
    const resultCard = document.getElementById('analysisResult');

    if (form) form.classList.add('hidden');
    if (resultCard) resultCard.classList.add('hidden');
    if (loading) loading.classList.remove('hidden');

    let result = null;

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        result = await response.json();
      } else {
        throw new Error('API returned status ' + response.status);
      }
    } catch (err) {
      console.warn('Backend /api/predict unreachable, using client heuristic fallback:', err);
      result = simulateModelInference(payload);
    } finally {
      setTimeout(() => {
        if (loading) loading.classList.add('hidden');
        renderResult(result);
        if (resultCard) resultCard.classList.remove('hidden');
      }, 350);
    }
  }

  function simulateModelInference(payload) {
    const { events, repos, activeHours, pushPct, prPct, issuePct, createPct, hourEntropy, maxRepoShare, maxEventsPerHour } = payload;
    const f = payload.features;

    let score = 0.35;
    if (pushPct >= 95 && maxRepoShare >= 90) score += 0.20;
    if (activeHours >= 65 || hourEntropy >= 0.90) score += 0.18;
    if (events >= 1000) score += 0.15;
    if (maxEventsPerHour >= 50) score += 0.10;
    if (createPct >= 40 && prPct >= 20) score += 0.22;

    if (prPct + issuePct + (payload.socialPct || 0) >= 30 && activeHours <= 16 && hourEntropy <= 0.75) {
      score -= 0.18;
    }

    score = Math.max(0.15, Math.min(0.95, score));
    const isAnomaly = score >= THRESHOLD;

    let clusterId = 1;
    let clusterName = 'Cluster 1';
    let clusterBadge = 'Diverse Collaborators';

    if (createPct >= 35 || (prPct >= 30 && repos >= 5)) {
      clusterId = 3;
      clusterName = 'Cluster 3';
      clusterBadge = 'Automated CI / Bots';
    } else if (events >= 500 && pushPct >= 85) {
      clusterId = 2;
      clusterName = 'Cluster 2';
      clusterBadge = 'Heavy Pushers (High Volume)';
    } else if (pushPct >= 85 && maxRepoShare >= 80) {
      clusterId = 0;
      clusterName = 'Cluster 0';
      clusterBadge = 'Heavy Pushers (Single Repo)';
    } else if (events <= 30 && hourEntropy <= 0.4) {
      clusterId = 4;
      clusterName = 'Cluster 4';
      clusterBadge = 'Sporadic Browsers';
    }

    const pc1 = ((f.log_n * 0.45) + (f.log_max_per_hour * 0.35) + (f.active_frac * 0.20) - 2.5).toFixed(2);
    const pc2 = ((f.frac_push * 2.5) - (f.frac_pr * 1.8) - (f.frac_issue * 1.5) - 0.5).toFixed(2);

    let recommendation = '';
    if (isAnomaly) {
      if (activeHours >= 60 && pushPct >= 95) {
        recommendation = '🚨 Pola push terus menerus tanpa jeda biologis (' + activeHours + ' jam aktif, entropi jam ' + hourEntropy.toFixed(2) + ') mengindikasikan infinite contribution loop daemon.';
      } else if (pushPct >= 95 && maxRepoShare >= 95 && events <= 60) {
        recommendation = '🚨 Aktivitas push terkonsentrasi sangat cepat pada repositori tunggal tanpa keterlibatan sosial menyerupai kampanye spam SEO / gambling referral dump.';
      } else if (createPct >= 35) {
        recommendation = '🚨 Proporsi pembuatan branch/repo (' + createPct + '%) dan pembukaan PR otonom menunjukkan bot continuous integration atau testing pipeline tak berizin.';
      } else {
        recommendation = '🚨 Skor anomali ' + score.toFixed(3) + ' melampaui batas kritis model 0.551. Perilaku ini masuk dalam kandidat anomali bot top-5%.';
      }
    } else {
      recommendation = '✅ Distribusi aktivitas interaktif (PR ' + prPct + '%, Issue ' + issuePct + '%) serta pola jam kerja wajar menunjukkan pengembang manusia alami.';
    }

    return {
      status: isAnomaly ? 'BOT ANOMALY' : 'NORMAL BEHAVIOR',
      is_anomaly: isAnomaly,
      score: score,
      threshold: THRESHOLD,
      cluster_id: clusterId,
      cluster_title: clusterName,
      cluster_badge: clusterBadge,
      pc1: parseFloat(pc1),
      pc2: parseFloat(pc2),
      recommendation: recommendation
    };
  }

  function renderResult(result) {
    const threshold = typeof result.threshold === 'number' ? result.threshold : THRESHOLD;
    const score = typeof result.score === 'number' ? result.score : (typeof result.anomaly_score === 'number' ? result.anomaly_score : 0.5);
    const isAnomaly = (typeof result.is_anomaly === 'boolean')
      ? result.is_anomaly
      : (score >= threshold || (result.status && result.status.toLowerCase().includes('anomaly')));

    const badge = document.getElementById('resStatusBadge');
    const badgeText = document.getElementById('resStatusText');
    const confidenceText = document.getElementById('resConfidence');

    if (badge && badgeText) {
      if (isAnomaly) {
        badge.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-accent-anomaly/10 text-accent-anomaly border border-accent-anomaly/30 pulse-anomaly';
        badge.querySelector('.w-2').className = 'w-2 h-2 rounded-full bg-accent-anomaly';
        badgeText.textContent = 'BOT ANOMALY';
      } else {
        badge.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-accent-success/10 text-accent-success border border-accent-success/30';
        badge.querySelector('.w-2').className = 'w-2 h-2 rounded-full bg-accent-success';
        badgeText.textContent = 'NORMAL BEHAVIOR';
      }
    }

    if (confidenceText) {
      confidenceText.textContent = `Score: ${score.toFixed(3)} (Threshold: ${threshold.toFixed(3)})`;
    }

    const clusterEl = document.getElementById('resClusterBadge');
    if (clusterEl) {
      const cId = result.cluster_id !== undefined ? result.cluster_id : 1;
      const cName = result.cluster_title || result.cluster_name || `Cluster ${cId}`;
      const cBadge = result.cluster_badge ? ` (${result.cluster_badge})` : '';
      clusterEl.textContent = `${cName}${cBadge}`;
    }

    const scoreBar = document.getElementById('resScoreBar');
    if (scoreBar) {
      const pct = Math.max(2, Math.min(100, Math.round(score * 100)));
      scoreBar.style.width = pct + '%';
      scoreBar.className = isAnomaly
        ? 'h-full rounded-full transition-all duration-700 ease-out bg-accent-anomaly'
        : 'h-full rounded-full transition-all duration-700 ease-out bg-accent-success';
    }

    const pc1El = document.getElementById('resPC1');
    const pc2El = document.getElementById('resPC2');
    const decisionPill = document.getElementById('resDecisionPill');

    const pc1Val = result.pc1 !== undefined ? result.pc1 : 0;
    const pc2Val = result.pc2 !== undefined ? result.pc2 : 0;

    if (pc1El) pc1El.textContent = (pc1Val >= 0 ? '+' : '') + Number(pc1Val).toFixed(2);
    if (pc2El) pc2El.textContent = (pc2Val >= 0 ? '+' : '') + Number(pc2Val).toFixed(2);

    if (decisionPill) {
      if (isAnomaly) {
        decisionPill.textContent = score >= 0.70 ? 'Extreme Outlier' : 'Anomaly Candidate';
        decisionPill.className = 'font-code-md text-code-md font-semibold text-accent-anomaly mt-1';
      } else {
        decisionPill.textContent = 'Standard Human';
        decisionPill.className = 'font-code-md text-code-md font-semibold text-accent-success mt-1';
      }
    }

    const recEl = document.getElementById('resRecommendation');
    if (recEl) {
      let recText = result.recommendation;
      if (!recText) {
        if (Array.isArray(result.cluster_characteristics) && result.cluster_characteristics.length > 0) {
          recText = (isAnomaly ? '🚨 ' : '✅ ') + result.cluster_characteristics.join(' · ');
        } else if (isAnomaly) {
          recText = '🚨 Skor anomali melampaui batas kritis model 0.551. Perilaku ini masuk dalam kandidat anomali bot top-5%.';
        } else {
          recText = '✅ Pola interaksi kolaboratif dan ritme kerja seimbang sesuai profil pengembang manusia normal.';
        }
      }
      recEl.textContent = recText;
    }
  }

  function openModal(defaultUsername) {
    createModal();
    if (modalElement) {
      modalElement.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      
      // Default to live tab
      switchTab('live');

      if (defaultUsername) {
        const input = document.getElementById('liveGithubInput');
        if (input) input.value = defaultUsername;
        runLiveAnalysis(defaultUsername);
      }
    }
  }

  function closeModal() {
    if (modalElement) {
      modalElement.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  // Intercept all "Analyze an account" buttons across any page
  function attachOpenTriggers() {
    document.querySelectorAll('button, a').forEach((el) => {
      const text = (el.textContent || '').trim().toLowerCase();
      const hasAction = el.getAttribute('data-action') === 'analyze';
      const hasId = el.id === 'analyzeAccountBtn';

      if (text.includes('analyze an account') || hasAction || hasId) {
        if (!el.dataset.modalBound) {
          el.dataset.modalBound = 'true';
          el.addEventListener('click', (e) => {
            e.preventDefault();
            const targetUsername = el.getAttribute('data-username');
            openModal(targetUsername || null);
          });
        }
      }
    });
  }

  // Expose global API
  window.GHModal = {
    open: openModal,
    close: closeModal,
    switchTab: switchTab,
    applyPreset: applyPreset,
    analyzeLive: runLiveAnalysis
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      createModal();
      attachOpenTriggers();
    });
  } else {
    createModal();
    attachOpenTriggers();
  }
})();
