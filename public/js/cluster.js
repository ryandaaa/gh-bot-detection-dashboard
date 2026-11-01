/**
 * GH Intelligence Dashboard - Cluster Explorer Helper Script
 * Provides:
 * 1. Fetches cluster profiles from /api/clusters (with fallback to models/cluster_profiles.json)
 * 2. Renders interactive cards for 7 clusters (Cluster 0 to Cluster 6)
 * 3. Dynamic selection synchronization: Cards, Dropdown, PCA Legend, and Detail Panel
 * 4. Renders Behavioral Characteristics and Comparative Feature Progress Bars
 */

(function () {
  'use strict';

  // Fallback cluster data embedded directly from cluster_profiles.json
  // ensuring flawless offline / static file operation
  const FALLBACK_CLUSTERS = {
    '0': {
      cluster_id: 0,
      title: 'Cluster 0',
      badge: 'Heavy Pushers',
      accounts: '954',
      accountsPct: '(6.3%)',
      anomalyRate: '12.7%',
      score: 'μ 0.482',
      events: '48',
      repos: '1',
      characteristics: [
        'Aktivitas: median 48 event (103.8 rerata) pada 1 repositori',
        'Dominasi aksi: push 94.5%, PR 0.5%, issue 0.1%, sosial 0.0%',
        'Pola kerja: entropi jam 0.29, fraksi jam aktif 7.3%',
        'Deteksi anomali: 12.7% ditandai anomali (skor rata-rata μ 0.482)'
      ],
      fitur_mean: {
        frac_push: 0.9446,
        frac_pr: 0.0046,
        frac_issue: 0.0012,
        frac_create: 0.0495,
        frac_social: 0.0001,
        max_repo_share: 0.7645,
        hour_entropy: 0.2895,
        active_frac: 0.0728
      }
    },
    '1': {
      cluster_id: 1,
      title: 'Cluster 1',
      badge: 'Heavy Pushers',
      accounts: '6,008',
      accountsPct: '(39.5%)',
      anomalyRate: '0.0%',
      score: 'μ 0.375',
      events: '29',
      repos: '1',
      characteristics: [
        'Aktivitas: median 29 event (34.1 rerata) pada 1 repositori',
        'Dominasi aksi: push 94.4%, PR 1.2%, issue 0.6%, sosial 0.0%',
        'Pola kerja: entropi jam 0.75, fraksi jam aktif 25.7%',
        'Deteksi anomali: 0.0% ditandai anomali (skor rata-rata μ 0.375)'
      ],
      fitur_mean: {
        frac_push: 0.9441,
        frac_pr: 0.0116,
        frac_issue: 0.0057,
        frac_create: 0.0386,
        frac_social: 0.0,
        max_repo_share: 0.938,
        hour_entropy: 0.7471,
        active_frac: 0.2574
      }
    },
    '2': {
      cluster_id: 2,
      title: 'Cluster 2',
      badge: 'Heavy Pushers',
      accounts: '2,739',
      accountsPct: '(18.0%)',
      anomalyRate: '3.5%',
      score: 'μ 0.446',
      events: '31',
      repos: '8',
      characteristics: [
        'Aktivitas: median 31 event (43.6 rerata) pada 8 repositori',
        'Dominasi aksi: push 74.1%, PR 5.5%, issue 2.5%, sosial 0.0%',
        'Pola kerja: entropi jam 0.73, fraksi jam aktif 26.8%',
        'Deteksi anomali: 3.5% ditandai anomali (skor rata-rata μ 0.446)'
      ],
      fitur_mean: {
        frac_push: 0.7408,
        frac_pr: 0.0549,
        frac_issue: 0.025,
        frac_create: 0.1792,
        frac_social: 0.0001,
        max_repo_share: 0.3589,
        hour_entropy: 0.7327,
        active_frac: 0.2681
      }
    },
    '3': {
      cluster_id: 3,
      title: 'Cluster 3',
      badge: 'Automated CI / Bots',
      accounts: '534',
      accountsPct: '(3.5%)',
      anomalyRate: '42.9%',
      score: 'μ 0.548',
      events: '32',
      repos: '2',
      characteristics: [
        'Aktivitas: median 32 event (95.1 rerata) pada 2 repositori',
        'Dominasi aksi: push 26.5%, PR 22.1%, issue 40.5%, sosial 0.0%',
        'Pola kerja: entropi jam 0.78, fraksi jam aktif 33.3%',
        'Deteksi anomali: 42.9% ditandai anomali (skor rata-rata μ 0.548)'
      ],
      fitur_mean: {
        frac_push: 0.2648,
        frac_pr: 0.2211,
        frac_issue: 0.4051,
        frac_create: 0.1089,
        frac_social: 0.0001,
        max_repo_share: 0.7057,
        hour_entropy: 0.7763,
        active_frac: 0.3329
      }
    },
    '4': {
      cluster_id: 4,
      title: 'Cluster 4',
      badge: 'Automated CI / Bots',
      accounts: '58',
      accountsPct: '(0.4%)',
      anomalyRate: '46.6%',
      score: 'μ 0.548',
      events: '28',
      repos: '6',
      characteristics: [
        'Aktivitas: median 28 event (45.5 rerata) pada 6 repositori',
        'Dominasi aksi: push 66.2%, PR 4.8%, issue 4.7%, sosial 5.4%',
        'Pola kerja: entropi jam 0.69, fraksi jam aktif 23.1%',
        'Deteksi anomali: 46.6% ditandai anomali (skor rata-rata μ 0.548)'
      ],
      fitur_mean: {
        frac_push: 0.6624,
        frac_pr: 0.0475,
        frac_issue: 0.0465,
        frac_create: 0.1894,
        frac_social: 0.0542,
        max_repo_share: 0.4645,
        hour_entropy: 0.6863,
        active_frac: 0.2307
      }
    },
    '5': {
      cluster_id: 5,
      title: 'Cluster 5',
      badge: 'Heavy Pushers',
      accounts: '2,984',
      accountsPct: '(19.6%)',
      anomalyRate: '4.1%',
      score: 'μ 0.436',
      events: '29',
      repos: '2',
      characteristics: [
        'Aktivitas: median 29 event (35.8 rerata) pada 2 repositori',
        'Dominasi aksi: push 53.7%, PR 11.2%, issue 4.8%, sosial 0.0%',
        'Pola kerja: entropi jam 0.76, fraksi jam aktif 27.2%',
        'Deteksi anomali: 4.1% ditandai anomali (skor rata-rata μ 0.436)'
      ],
      fitur_mean: {
        frac_push: 0.5366,
        frac_pr: 0.1122,
        frac_issue: 0.048,
        frac_create: 0.3031,
        frac_social: 0.0001,
        max_repo_share: 0.8757,
        hour_entropy: 0.7605,
        active_frac: 0.2715
      }
    },
    '6': {
      cluster_id: 6,
      title: 'Cluster 6',
      badge: 'Heavy Pushers',
      accounts: '1,936',
      accountsPct: '(12.7%)',
      anomalyRate: '8.5%',
      score: 'μ 0.454',
      events: '134',
      repos: '1',
      characteristics: [
        'Aktivitas: median 134 event (646.2 rerata) pada 1 repositori',
        'Dominasi aksi: push 93.5%, PR 1.3%, issue 0.9%, sosial 0.0%',
        'Pola kerja: entropi jam 0.93, fraksi jam aktif 69.9%',
        'Deteksi anomali: 8.5% ditandai anomali (skor rata-rata μ 0.454)'
      ],
      fitur_mean: {
        frac_push: 0.935,
        frac_pr: 0.0135,
        frac_issue: 0.0088,
        frac_create: 0.0426,
        frac_social: 0.0,
        max_repo_share: 0.9005,
        hour_entropy: 0.9295,
        active_frac: 0.6987
      }
    }
  };

  const CLUSTER_COLORS = {
    '0': '#2563eb', // Blue
    '1': '#64748b', // Slate
    '2': '#0f172a', // Dark slate
    '3': '#dc2626', // Red (Automated CI / Anomaly)
    '4': '#d97706', // Amber (Automated CI / Social)
    '5': '#7c3aed', // Purple (Push / Create)
    '6': '#059669', // Emerald (High Volume 24/7)
  };

  let clusterData = FALLBACK_CLUSTERS;
  let activeClusterId = '2';

  async function loadClusterProfiles() {
    try {
      const res = await fetch('/api/clusters');
      if (res.ok) {
        const json = await res.json();
        if (json && Object.keys(json).length > 0) {
          clusterData = json;
          console.info('Loaded cluster profiles from /api/clusters');
          return;
        }
      }
    } catch (e) {
      // Ignore and attempt local file fetch
    }

    try {
      const res = await fetch('models/cluster_profiles.json');
      if (res.ok) {
        const json = await res.json();
        if (json && Object.keys(json).length > 0) {
          clusterData = json;
          console.info('Loaded cluster profiles from models/cluster_profiles.json');
          return;
        }
      }
    } catch (e) {
      console.warn('Using embedded fallback cluster profiles');
    }
  }

  function renderClusterCards() {
    let cardsContainer = document.getElementById('clusterCardsContainer');
    const mainGrid = document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-12');

    if (!cardsContainer && mainGrid && mainGrid.parentNode) {
      cardsContainer = document.createElement('div');
      cardsContainer.id = 'clusterCardsContainer';
      cardsContainer.className = 'w-full mb-6 space-y-3';
      
      const headerLabel = document.createElement('div');
      headerLabel.className = 'flex items-center justify-between';
      headerLabel.innerHTML = `
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[20px] text-primary">hub</span>
          <span class="font-headline-sm text-headline-sm text-on-surface">Behavioral Clusters (K = 7)</span>
        </div>
        <span class="font-code-sm text-code-sm text-secondary">Click a card to inspect signature & comparison</span>
      `;
      cardsContainer.appendChild(headerLabel);

      const grid = document.createElement('div');
      grid.id = 'clusterCardsGrid';
      grid.className = 'grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3';
      cardsContainer.appendChild(grid);

      mainGrid.parentNode.insertBefore(cardsContainer, mainGrid);
    }

    const grid = document.getElementById('clusterCardsGrid');
    if (!grid) return;

    grid.innerHTML = '';

    const clusterKeys = Object.keys(clusterData).sort((a, b) => parseInt(a) - parseInt(b));

    clusterKeys.forEach((cId) => {
      const item = clusterData[cId];
      const color = CLUSTER_COLORS[cId] || '#475569';
      const isSelected = cId === activeClusterId;
      const isCiBot = (item.badge || '').toLowerCase().includes('bot') || (item.badge || '').toLowerCase().includes('ci');
      const anomalyNum = parseFloat(item.anomalyRate || item.persentase_anomali || 0);

      const card = document.createElement('button');
      card.type = 'button';
      card.setAttribute('data-cluster-card', cId);
      card.className = `cluster-card p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between shadow-xs select-none ${
        isSelected
          ? 'bg-surface-container-lowest border-primary ring-2 ring-primary/20 shadow-sm'
          : 'bg-surface-container-lowest border-border-subtle hover:border-primary/40 hover:bg-surface-hover/50'
      }`;

      card.innerHTML = `
        <div class="flex items-center justify-between w-full mb-2">
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${color}"></span>
            <span class="font-headline-sm text-sm text-on-surface font-semibold">C${cId}</span>
          </div>
          ${
            isCiBot
              ? `<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-accent-anomaly/10 text-accent-anomaly uppercase">BOT</span>`
              : `<span class="px-1.5 py-0.5 rounded text-[10px] font-medium bg-surface-container text-secondary">DEV</span>`
          }
        </div>

        <div class="space-y-1 w-full">
          <div class="font-label-sm text-[11px] text-secondary truncate" title="${item.badge || 'Cluster ' + cId}">
            ${item.badge || 'Cluster ' + cId}
          </div>
          <div class="flex items-baseline justify-between pt-1">
            <span class="font-code-md text-code-md font-semibold text-on-surface">
              ${item.accounts || item.jumlah_akun || '-'}
            </span>
            <span class="font-code-sm text-[11px] text-secondary">
              ${item.accountsPct || (item.persentase_akun ? '(' + item.persentase_akun + '%)' : '')}
            </span>
          </div>
          <div class="flex items-center justify-between text-[11px] pt-1 border-t border-border-subtle/50">
            <span class="text-secondary">Anomaly:</span>
            <span class="font-code-sm font-semibold ${anomalyNum >= 10 ? 'text-accent-anomaly' : 'text-on-surface'}">
              ${item.anomalyRate || (item.persentase_anomali ? item.persentase_anomali.toFixed(1) + '%' : '0%')}
            </span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        selectCluster(cId);
      });

      grid.appendChild(card);
    });
  }

  function updateDropdownMenu() {
    const clusterMenu = document.getElementById('clusterMenu');
    if (!clusterMenu) return;

    clusterMenu.innerHTML = '';

    const allBtn = document.createElement('button');
    allBtn.type = 'button';
    allBtn.className = 'cluster-opt w-full text-left px-3 py-1.5 font-label-md text-label-md hover:bg-surface-hover text-secondary';
    allBtn.setAttribute('data-cluster', 'all');
    allBtn.innerHTML = '<span>All Clusters</span>';
    allBtn.addEventListener('click', () => selectCluster('all'));
    clusterMenu.appendChild(allBtn);

    const clusterKeys = Object.keys(clusterData).sort((a, b) => parseInt(a) - parseInt(b));
    clusterKeys.forEach((cId) => {
      const item = clusterData[cId];
      const isSelected = cId === activeClusterId;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `cluster-opt w-full text-left px-3 py-1.5 font-label-md text-label-md hover:bg-surface-hover flex items-center justify-between ${
        isSelected ? 'text-on-surface font-semibold bg-surface-hover' : 'text-secondary'
      }`;
      btn.setAttribute('data-cluster', cId);
      btn.innerHTML = `
        <span>Cluster ${cId} (${item.badge || 'C' + cId})</span>
        ${isSelected ? '<span class="material-symbols-outlined text-[14px] text-primary">check</span>' : ''}
      `;
      btn.addEventListener('click', () => {
        selectCluster(cId);
        clusterMenu.classList.add('hidden');
      });
      clusterMenu.appendChild(btn);
    });
  }

  function updateLegend() {
    const legendContainer = document.querySelector('.legend-btn')?.parentElement;
    if (!legendContainer) return;

    legendContainer.innerHTML = '<span class="text-secondary font-label-md text-label-md">Clusters:</span>';

    const clusterKeys = Object.keys(clusterData).sort((a, b) => parseInt(a) - parseInt(b));
    clusterKeys.forEach((cId) => {
      const color = CLUSTER_COLORS[cId] || '#475569';
      const isSelected = cId === activeClusterId;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `legend-btn inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs transition-colors ${
        isSelected
          ? 'bg-surface-hover text-on-surface font-semibold shadow-xs'
          : 'text-secondary hover:text-on-surface'
      }`;
      btn.setAttribute('data-cluster-tag', cId);
      btn.innerHTML = `
        <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${color}"></span>
        <span>C${cId}${isSelected ? ' (Active)' : ''}</span>
      `;
      btn.addEventListener('click', () => selectCluster(cId));
      legendContainer.appendChild(btn);
    });
  }

  function renderFeatureComparisonBars(data) {
    const rightPanel = document.querySelector('section.lg\\:col-span-4');
    if (!rightPanel) return;

    let barsContainer = document.getElementById('featureComparisonBars');
    if (!barsContainer) {
      barsContainer = document.createElement('div');
      barsContainer.id = 'featureComparisonBars';
      barsContainer.className = 'mt-5 pt-4 border-t border-border-subtle/80 space-y-3';
      
      const charSection = document.getElementById('characteristicsList')?.closest('div');
      if (charSection && charSection.parentNode) {
        charSection.parentNode.insertBefore(barsContainer, charSection.nextSibling);
      } else {
        rightPanel.appendChild(barsContainer);
      }
    }

    const f = data.fitur_mean || data.fitur_median || {};
    const pushPct = Math.round((f.frac_push || 0) * 100);
    const prPct = Math.round((f.frac_pr || 0) * 100);
    const issuePct = Math.round((f.frac_issue || 0) * 100);
    const createPct = Math.round((f.frac_create || 0) * 100);
    const repoSharePct = Math.round((f.max_repo_share || 0) * 100);
    const hourEntropyPct = Math.round((f.hour_entropy || 0) * 100);
    const activeFracPct = Math.round((f.active_frac || 0) * 100);

    const makeBar = (label, pctVal, colorClass = 'bg-primary') => `
      <div class="space-y-1">
        <div class="flex items-center justify-between text-xs">
          <span class="text-secondary font-medium">${label}</span>
          <span class="font-code-sm text-on-surface font-semibold">${pctVal}%</span>
        </div>
        <div class="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
          <div class="h-full rounded-full ${colorClass} transition-all duration-500 ease-out" style="width: ${Math.max(2, pctVal)}%;"></div>
        </div>
      </div>
    `;

    barsContainer.innerHTML = `
      <div class="flex items-center justify-between mb-2">
        <h4 class="font-headline-sm text-headline-sm text-on-surface">Feature Signatures</h4>
        <span class="font-code-sm text-[11px] text-secondary">Cluster Mean</span>
      </div>
      <div class="space-y-2.5 font-body-sm">
        ${makeBar('Push Ratio', pushPct, pushPct > 80 ? 'bg-primary' : 'bg-slate-600')}
        ${makeBar('Pull Request Ratio', prPct, 'bg-accent-cluster-2')}
        ${makeBar('Issue Comments / Triaging', issuePct, issuePct > 20 ? 'bg-accent-anomaly' : 'bg-slate-500')}
        ${makeBar('Create Actions (Branch/Repo)', createPct, 'bg-accent-cluster-1')}
        ${makeBar('Max Repository Share', repoSharePct, 'bg-slate-700')}
        ${makeBar('Hour Entropy (Circadian Uniformity)', hourEntropyPct, hourEntropyPct > 80 ? 'bg-amber-600' : 'bg-slate-400')}
        ${makeBar('Active Fraction in Block', activeFracPct, activeFracPct > 50 ? 'bg-red-600' : 'bg-slate-500')}
      </div>
    `;
  }

  function selectCluster(cId) {
    activeClusterId = cId;

    const selectedClusterLabel = document.getElementById('selectedClusterLabel');
    if (selectedClusterLabel) {
      selectedClusterLabel.textContent = cId === 'all' ? 'All' : 'C' + cId;
    }

    // Update point cloud opacities if SVG groups exist
    const clouds = {
      '0': document.getElementById('cloud-c0'),
      '1': document.getElementById('cloud-c1'),
      '2': document.getElementById('cloud-c2'),
      '3': document.getElementById('cloud-c3'),
    };

    if (cId === 'all') {
      Object.values(clouds).forEach((c) => {
        if (c) c.style.opacity = '0.85';
      });
      return;
    }

    Object.keys(clouds).forEach((key) => {
      if (!clouds[key]) return;
      clouds[key].style.opacity = key === cId ? '1' : '0.15';
    });

    const data = clusterData[cId];
    if (!data) return;

    // Update Detail Panel Metrics
    const titleEl = document.getElementById('detailClusterTitle');
    const badgeEl = document.getElementById('detailClusterBadge');
    const accountsEl = document.getElementById('statAccounts');
    const accountsPctEl = document.getElementById('statAccountsPct');
    const anomalyRateEl = document.getElementById('statAnomalyRate');
    const eventsEl = document.getElementById('statEvents');
    const reposEl = document.getElementById('statRepos');
    const charList = document.getElementById('characteristicsList');

    if (titleEl) titleEl.textContent = data.title || `Cluster ${cId}`;
    if (badgeEl) badgeEl.textContent = data.badge || 'Automated / Push Activity';
    if (accountsEl) accountsEl.textContent = data.accounts || data.jumlah_akun || '-';
    if (accountsPctEl) accountsPctEl.textContent = data.accountsPct || (data.persentase_akun ? `(${data.persentase_akun}%)` : '');
    
    if (anomalyRateEl) {
      const aVal = data.anomalyRate || (data.persentase_anomali !== undefined ? `${data.persentase_anomali.toFixed(1)}%` : '-');
      anomalyRateEl.textContent = aVal;
      const numRate = parseFloat(aVal);
      if (numRate >= 10) {
        anomalyRateEl.className = 'font-headline-sm text-headline-sm text-accent-anomaly font-semibold';
      } else {
        anomalyRateEl.className = 'font-headline-sm text-headline-sm text-on-surface font-semibold';
      }
    }

    if (eventsEl) eventsEl.textContent = data.events || data.n_events_median || '-';
    if (reposEl) reposEl.textContent = data.repos || data.n_repos_median || '-';

    if (charList && data.characteristics) {
      charList.innerHTML = data.characteristics
        .map((item) => `<li class="flex items-start gap-2"><span class="text-primary mt-1 shrink-0">•</span><span>${item}</span></li>`)
        .join('');
    }

    // Render Feature Comparison Progress Bars
    renderFeatureComparisonBars(data);

    // Update active state on cluster cards
    document.querySelectorAll('.cluster-card').forEach((card) => {
      const cardId = card.getAttribute('data-cluster-card');
      if (cardId === cId) {
        card.className = 'cluster-card p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between select-none bg-surface-container-lowest border-primary ring-2 ring-primary/20 shadow-sm';
      } else {
        card.className = 'cluster-card p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between select-none bg-surface-container-lowest border-border-subtle hover:border-primary/40 hover:bg-surface-hover/50 shadow-xs';
      }
    });

    // Update Legend buttons
    document.querySelectorAll('.legend-btn').forEach((btn) => {
      const tag = btn.getAttribute('data-cluster-tag');
      if (tag === cId) {
        btn.className = 'legend-btn inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs bg-surface-hover text-on-surface font-semibold shadow-xs transition-colors';
      } else {
        btn.className = 'legend-btn inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs text-secondary hover:text-on-surface transition-colors';
      }
    });

    // Update dropdown
    updateDropdownMenu();
  }

  async function init() {
    await loadClusterProfiles();
    renderClusterCards();
    updateDropdownMenu();
    updateLegend();

    // Select initial cluster (default to 2)
    selectCluster(activeClusterId);
  }

  // Expose global API
  window.GHCluster = {
    init: init,
    selectCluster: selectCluster,
    getData: () => clusterData
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
