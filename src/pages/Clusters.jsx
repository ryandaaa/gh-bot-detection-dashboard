import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Crosshair, Layers, Sliders, Info } from 'lucide-react';

const POPULATION_BASELINE = {
  log_n: 3.7716,
  frac_push: 0.8015,
  frac_create: 0.1200,
  frac_pr: 0.0464,
  frac_issue: 0.0318,
  frac_social: 0.0003,
  log_events_per_repo: 3.0604,
  max_repo_share: 0.7959,
  hour_entropy: 0.7424,
  active_frac: 0.3092,
  log_max_per_hour: 1.9047
};

const RADAR_METRICS = [
  { key: 'log_n', label: 'Volume (log n)', min: 2.0, max: 6.0, format: v => v.toFixed(2), desc: 'Logaritma total volume event selama jendela observasi.' },
  { key: 'frac_push', label: 'Push Ratio', min: 0.0, max: 1.0, format: v => `${(v * 100).toFixed(1)}%`, desc: 'Proporsi operasi Git push terhadap seluruh aktivitas tercatat.' },
  { key: 'frac_create', label: 'Create Ratio', min: 0.0, max: 0.4, format: v => `${(v * 100).toFixed(1)}%`, desc: 'Proporsi pembuatan repositori, tag, atau cabang kerja (branch).' },
  { key: 'frac_pr', label: 'PR Ratio', min: 0.0, max: 0.3, format: v => `${(v * 100).toFixed(1)}%`, desc: 'Aktivitas pull request: pembukaan, peninjauan, dan komentar review.' },
  { key: 'frac_issue', label: 'Issue Ratio', min: 0.0, max: 0.5, format: v => `${(v * 100).toFixed(1)}%`, desc: 'Aktivitas pembukaan laporan masalah (issue) dan komentar diskusi.' },
  { key: 'frac_social', label: 'Social Ratio', min: 0.0, max: 0.06, format: v => `${(v * 100).toFixed(2)}%`, desc: 'Sinyal sosial interaktif: pemberian bintang (star), pantauan (watch), dan forking.' },
  { key: 'log_events_per_repo', label: 'Events/Repo', min: 1.0, max: 5.0, format: v => v.toFixed(2), desc: 'Konsentrasi rata-rata volume event pada setiap repositori.' },
  { key: 'max_repo_share', label: 'Repo Concentr.', min: 0.2, max: 1.0, format: v => `${(v * 100).toFixed(1)}%`, desc: 'Fraksi aktivitas yang terkonsentrasi pada satu repositori utama.' },
  { key: 'hour_entropy', label: '24h Entropy', min: 0.1, max: 1.0, format: v => v.toFixed(2), desc: 'Keseragaman sirkadian waktu aktivitas sepanjang 24 jam sehari.' },
  { key: 'active_frac', label: 'Active Hours', min: 0.05, max: 0.8, format: v => `${(v * 100).toFixed(1)}%`, desc: 'Proporsi jam aktif dengan minimal satu event selama 152 jam pengamatan.' },
  { key: 'log_max_per_hour', label: 'Peak Hour Rate', min: 1.0, max: 4.0, format: v => v.toFixed(2), desc: 'Logaritma volume event tertinggi yang terjadi dalam satu jam puncak.' },
];

const FALLBACK_CLUSTERS = {
  '0': {
    cluster_id: 0,
    title: 'Cluster 0',
    badge: 'Burst Pushers (Stealth)',
    color: '#2563eb',
    accounts: '954',
    accountsPct: '6.3%',
    anomalyRate: '12.7%',
    score: '0.482',
    events: '48',
    repos: '1',
    characteristics: [
      'Aktivitas: median 48 event (103.8 rerata) pada 1 repositori tunggal',
      'Dominasi aksi: push 94.5%, PR 0.5%, issue 0.1%, sosial 0.0%',
      'Pola kerja: entropi jam 0.29, fraksi jam aktif 7.3% (burst spike)',
      'Deteksi anomali: 12.7% ditandai anomali (skor rata-rata μ 0.482)'
    ],
    fitur_mean: {
      log_n: 4.1522,
      frac_push: 0.9446,
      frac_create: 0.0495,
      frac_pr: 0.0046,
      frac_issue: 0.0012,
      frac_social: 0.0001,
      log_events_per_repo: 3.4832,
      max_repo_share: 0.7645,
      hour_entropy: 0.2895,
      active_frac: 0.0728,
      log_max_per_hour: 3.4548
    }
  },
  '1': {
    cluster_id: 1,
    title: 'Cluster 1',
    badge: 'Heavy Pushers (Normal)',
    color: '#64748b',
    accounts: '6,008',
    accountsPct: '39.5%',
    anomalyRate: '0.0%',
    score: '0.375',
    events: '29',
    repos: '1',
    characteristics: [
      'Aktivitas: median 29 event (34.1 rerata) pada 1 repositori',
      'Dominasi aksi: push 94.4%, PR 1.2%, issue 0.6%, sosial 0.0%',
      'Pola kerja: entropi jam 0.75, fraksi jam aktif 25.7% (organik)',
      'Deteksi anomali: 0.0% ditandai anomali (skor rata-rata μ 0.375 baseline)'
    ],
    fitur_mean: {
      log_n: 3.4880,
      frac_push: 0.9441,
      frac_create: 0.0386,
      frac_pr: 0.0116,
      frac_issue: 0.0057,
      frac_social: 0.0,
      log_events_per_repo: 3.2171,
      max_repo_share: 0.9380,
      hour_entropy: 0.7471,
      active_frac: 0.2574,
      log_max_per_hour: 1.6678
    }
  },
  '2': {
    cluster_id: 2,
    title: 'Cluster 2',
    badge: 'Multi-Repo Pushers',
    color: '#0f172a',
    accounts: '2,739',
    accountsPct: '18.0%',
    anomalyRate: '3.5%',
    score: '0.446',
    events: '31',
    repos: '8',
    characteristics: [
      'Aktivitas: median 31 event (43.6 rerata) terdistribusi pada 8 repositori',
      'Dominasi aksi: push 74.1%, PR 5.5%, issue 2.5%, create 17.9%',
      'Pola kerja: entropi jam 0.73, fraksi jam aktif 26.8%',
      'Deteksi anomali: 3.5% ditandai anomali (skor rata-rata μ 0.446)'
    ],
    fitur_mean: {
      log_n: 3.6190,
      frac_push: 0.7408,
      frac_create: 0.1792,
      frac_pr: 0.0549,
      frac_issue: 0.0250,
      frac_social: 0.0001,
      log_events_per_repo: 1.7017,
      max_repo_share: 0.3589,
      hour_entropy: 0.7327,
      active_frac: 0.2681,
      log_max_per_hour: 1.8648
    }
  },
  '3': {
    cluster_id: 3,
    title: 'Cluster 3',
    badge: 'Automated CI / Bots',
    color: '#dc2626',
    accounts: '534',
    accountsPct: '3.5%',
    anomalyRate: '42.9%',
    score: '0.548',
    events: '32',
    repos: '2',
    characteristics: [
      'Aktivitas: median 32 event (95.1 rerata) pada 2 repositori',
      'Dominasi aksi: push 26.5%, PR 22.1%, issue 40.5% (otomasi tooling)',
      'Pola kerja: entropi jam 0.78, fraksi jam aktif 33.3%',
      'Deteksi anomali: 42.9% ditandai anomali tinggi (skor rata-rata μ 0.548)'
    ],
    fitur_mean: {
      log_n: 3.7487,
      frac_push: 0.2648,
      frac_create: 0.1089,
      frac_pr: 0.2211,
      frac_issue: 0.4051,
      frac_social: 0.0001,
      log_events_per_repo: 2.6025,
      max_repo_share: 0.7057,
      hour_entropy: 0.7763,
      active_frac: 0.3329,
      log_max_per_hour: 1.8462
    }
  },
  '4': {
    cluster_id: 4,
    title: 'Cluster 4',
    badge: 'Tooling / Social Bots',
    color: '#d97706',
    accounts: '58',
    accountsPct: '0.4%',
    anomalyRate: '46.6%',
    score: '0.548',
    events: '28',
    repos: '6',
    characteristics: [
      'Aktivitas: median 28 event (45.5 rerata) pada 6 repositori',
      'Dominasi aksi: push 66.2%, PR 4.8%, issue 4.7%, sosial 5.4%',
      'Pola kerja: entropi jam 0.69, fraksi jam aktif 23.1%',
      'Deteksi anomali: 46.6% anomali tinggi (skor rata-rata μ 0.548)'
    ],
    fitur_mean: {
      log_n: 3.5032,
      frac_push: 0.6624,
      frac_create: 0.1894,
      frac_pr: 0.0475,
      frac_issue: 0.0465,
      frac_social: 0.0542,
      log_events_per_repo: 1.5296,
      max_repo_share: 0.4645,
      hour_entropy: 0.6863,
      active_frac: 0.2307,
      log_max_per_hour: 1.8846
    }
  },
  '5': {
    cluster_id: 5,
    title: 'Cluster 5',
    badge: 'Push & Create Archetype',
    color: '#7c3aed',
    accounts: '2,984',
    accountsPct: '19.6%',
    anomalyRate: '4.1%',
    score: '0.436',
    events: '29',
    repos: '2',
    characteristics: [
      'Aktivitas: median 29 event (35.8 rerata) pada 2 repositori',
      'Dominasi aksi: push 53.7%, PR 11.2%, issue 4.8%, create 30.3%',
      'Pola kerja: entropi jam 0.76, fraksi jam aktif 27.2%',
      'Deteksi anomali: 4.1% ditandai anomali (skor rata-rata μ 0.436)'
    ],
    fitur_mean: {
      log_n: 3.5048,
      frac_push: 0.5366,
      frac_create: 0.3031,
      frac_pr: 0.1122,
      frac_issue: 0.0480,
      frac_social: 0.0001,
      log_events_per_repo: 2.9548,
      max_repo_share: 0.8757,
      hour_entropy: 0.7605,
      active_frac: 0.2715,
      log_max_per_hour: 1.6679
    }
  },
  '6': {
    cluster_id: 6,
    title: 'Cluster 6',
    badge: '24/7 Continuous Pushers',
    color: '#059669',
    accounts: '1,936',
    accountsPct: '12.7%',
    anomalyRate: '8.5%',
    score: '0.454',
    events: '134',
    repos: '1',
    characteristics: [
      'Aktivitas: median 134 event (646.2 rerata) pada 1 repositori personal',
      'Dominasi aksi: push 93.5%, PR 1.3%, issue 0.9%, sosial 0.0%',
      'Pola kerja: entropi jam 0.93, fraksi jam aktif 69.9% (hampir non-stop)',
      'Deteksi anomali: 8.5% anomali (skor rata-rata μ 0.454)'
    ],
    fitur_mean: {
      log_n: 5.1054,
      frac_push: 0.9350,
      frac_create: 0.0426,
      frac_pr: 0.0135,
      frac_issue: 0.0088,
      frac_social: 0.0,
      log_events_per_repo: 4.6232,
      max_repo_share: 0.9005,
      hour_entropy: 0.9295,
      active_frac: 0.6987,
      log_max_per_hour: 2.3139
    }
  }
};

// Universe Point Cloud Dataset: Synthesized from real cluster distribution + empirical bot profiles
const UNIVERSE_POINTS = [
  // Cluster 0: Burst Pushers (Spam / Sudden Bursts)
  { id: '0x1c84f2', cluster: 0, pc1: 0.72, pc2: -2.14, score: 0.492, isAnomaly: false },
  { id: '0x3a921d', cluster: 0, pc1: 0.88, pc2: -2.35, score: 0.512, isAnomaly: false },
  { id: '0x8f01b3', cluster: 0, pc1: 0.64, pc2: -1.98, score: 0.478, isAnomaly: false },
  { id: '0x4e29cc', cluster: 0, pc1: 1.05, pc2: -2.48, score: 0.562, isAnomaly: true },
  { id: '0x992da1', cluster: 0, pc1: 0.79, pc2: -2.05, score: 0.481, isAnomaly: false },
  { id: '0x21bb78', cluster: 0, pc1: 0.92, pc2: -2.28, score: 0.505, isAnomaly: false },
  { id: '0x7e44a9', cluster: 0, pc1: 0.58, pc2: -1.88, score: 0.465, isAnomaly: false },
  { id: '0xb23190', cluster: 0, pc1: 1.12, pc2: -2.62, score: 0.584, isAnomaly: true },
  { id: '0x55ca01', cluster: 0, pc1: 0.81, pc2: -2.18, score: 0.489, isAnomaly: false },

  // Cluster 1: Heavy Pushers (Normal Human Baseline)
  { id: '0x82a9f1', cluster: 1, pc1: -1.15, pc2: 0.38, score: 0.368, isAnomaly: false },
  { id: '0x73b402', cluster: 1, pc1: -1.32, pc2: 0.52, score: 0.382, isAnomaly: false },
  { id: '0x61e899', cluster: 1, pc1: -1.04, pc2: 0.22, score: 0.355, isAnomaly: false },
  { id: '0x9941ac', cluster: 1, pc1: -1.45, pc2: 0.65, score: 0.392, isAnomaly: false },
  { id: '0x22c5e0', cluster: 1, pc1: -0.92, pc2: 0.15, score: 0.348, isAnomaly: false },
  { id: '0x55f1b2', cluster: 1, pc1: -1.28, pc2: 0.44, score: 0.379, isAnomaly: false },
  { id: '0x3344cc', cluster: 1, pc1: -1.08, pc2: 0.31, score: 0.362, isAnomaly: false },
  { id: '0x44dd11', cluster: 1, pc1: -1.38, pc2: 0.59, score: 0.388, isAnomaly: false },
  { id: '0x77ee33', cluster: 1, pc1: -1.18, pc2: 0.41, score: 0.371, isAnomaly: false },
  { id: '0x88ff44', cluster: 1, pc1: -1.52, pc2: 0.72, score: 0.399, isAnomaly: false },

  // Cluster 2: Multi-Repo Pushers
  { id: '0x41ba9e', cluster: 2, pc1: 1.55, pc2: 1.18, score: 0.442, isAnomaly: false },
  { id: '0x52cb0f', cluster: 2, pc1: 1.72, pc2: 1.35, score: 0.461, isAnomaly: false },
  { id: '0x63dc1a', cluster: 2, pc1: 1.42, pc2: 1.02, score: 0.435, isAnomaly: false },
  { id: '0x74ed2b', cluster: 2, pc1: 1.85, pc2: 1.48, score: 0.478, isAnomaly: false },
  { id: '0x85fe3c', cluster: 2, pc1: 1.35, pc2: 0.95, score: 0.428, isAnomaly: false },
  { id: '0x960f4d', cluster: 2, pc1: 1.68, pc2: 1.28, score: 0.455, isAnomaly: false },
  { id: '0xa71a5e', cluster: 2, pc1: 1.95, pc2: 1.62, score: 0.558, isAnomaly: true },
  { id: '0xb82b6f', cluster: 2, pc1: 1.48, pc2: 1.12, score: 0.439, isAnomaly: false },

  // Cluster 3: Automated CI / Bots
  { id: '0xc93c70', cluster: 3, pc1: -2.18, pc2: 2.05, score: 0.542, isAnomaly: false },
  { id: '0xda4d81', cluster: 3, pc1: -2.35, pc2: 2.24, score: 0.588, isAnomaly: true },
  { id: '0xeb5e92', cluster: 3, pc1: -2.05, pc2: 1.88, score: 0.528, isAnomaly: false },
  { id: '0xfc6fa3', cluster: 3, pc1: -2.48, pc2: 2.38, score: 0.615, isAnomaly: true },
  { id: '0x0d70b4', cluster: 3, pc1: -2.25, pc2: 2.12, score: 0.565, isAnomaly: true },
  { id: '0x1e81c5', cluster: 3, pc1: -1.95, pc2: 1.78, score: 0.515, isAnomaly: false },
  { id: '0x2f92d6', cluster: 3, pc1: -2.55, pc2: 2.45, score: 0.642, isAnomaly: true },

  // Cluster 4: Tooling / Social Bots
  { id: '0x30a3e7', cluster: 4, pc1: -1.58, pc2: 1.05, score: 0.538, isAnomaly: false },
  { id: '0x41b4f8', cluster: 4, pc1: -1.72, pc2: 1.18, score: 0.572, isAnomaly: true },
  { id: '0x52c509', cluster: 4, pc1: -1.45, pc2: 0.95, score: 0.522, isAnomaly: false },
  { id: '0x63d61a', cluster: 4, pc1: -1.85, pc2: 1.32, score: 0.605, isAnomaly: true },
  { id: '0x74e72b', cluster: 4, pc1: -1.65, pc2: 1.12, score: 0.559, isAnomaly: true },

  // Cluster 5: Push & Create Archetype
  { id: '0x85f83c', cluster: 5, pc1: 0.68, pc2: 1.45, score: 0.431, isAnomaly: false },
  { id: '0x96094d', cluster: 5, pc1: 0.82, pc2: 1.62, score: 0.448, isAnomaly: false },
  { id: '0xa71a5e', cluster: 5, pc1: 0.55, pc2: 1.32, score: 0.422, isAnomaly: false },
  { id: '0xb82b6f', cluster: 5, pc1: 0.95, pc2: 1.75, score: 0.465, isAnomaly: false },
  { id: '0xc93c70', cluster: 5, pc1: 0.75, pc2: 1.52, score: 0.439, isAnomaly: false },
  { id: '0xda4d81', cluster: 5, pc1: 1.08, pc2: 1.88, score: 0.562, isAnomaly: true },

  // Cluster 6: 24/7 Continuous Pushers
  { id: '0xeb5e92', cluster: 6, pc1: 2.45, pc2: -0.38, score: 0.458, isAnomaly: false },
  { id: '0xfc6fa3', cluster: 6, pc1: 2.62, pc2: -0.52, score: 0.485, isAnomaly: false },
  { id: '0x0d70b4', cluster: 6, pc1: 2.32, pc2: -0.25, score: 0.442, isAnomaly: false },
  { id: '0x1e81c5', cluster: 6, pc1: 2.78, pc2: -0.68, score: 0.575, isAnomaly: true },
  { id: '0x2f92d6', cluster: 6, pc1: 2.52, pc2: -0.45, score: 0.468, isAnomaly: false },
  { id: '0x30a3e7', cluster: 6, pc1: 2.92, pc2: -0.82, score: 0.612, isAnomaly: true },

  // EMPIRICAL REAL BOTS AND HUMAN BENCHMARK
  {
    id: 'mccartyashley284',
    cluster: 0,
    pc1: 0.95,
    pc2: -2.65,
    score: 0.724,
    isAnomaly: true,
    isEmpirical: true,
    empName: 'mccartyashley284',
    empRole: 'Spam Gambling Bot',
    empDetail: 'Rapid burst commits with backlink markdown spam in 2h window.'
  },
  {
    id: 'hiro-kurage',
    cluster: 6,
    pc1: 2.68,
    pc2: -0.72,
    score: 0.648,
    isAnomaly: true,
    isEmpirical: true,
    empName: 'hiro-kurage',
    empRole: 'Forex EA Logger',
    empDetail: '24/7 cron script logging trading account statistics every 15m.'
  },
  {
    id: 'nonkh',
    cluster: 6,
    pc1: 3.52,
    pc2: -0.18,
    score: 0.820,
    isAnomaly: true,
    isEmpirical: true,
    empName: 'nonkh',
    empRole: 'Commit Spoofer',
    empDetail: '1,868 continuous automated commits spoofing activity graph.'
  },
  {
    id: 'torvalds',
    cluster: 1,
    pc1: -1.45,
    pc2: 0.35,
    score: 0.324,
    isAnomaly: false,
    isEmpirical: true,
    empName: 'torvalds',
    empRole: 'Human Maintainer',
    empDetail: 'Organically distributed git merge and commit activity baseline.'
  }
];

export default function Clusters() {
  const [clusters, setClusters] = useState(FALLBACK_CLUSTERS);
  const [activeClusterId, setActiveClusterId] = useState('0');
  const [isolatedClusterId, setIsolatedClusterId] = useState(null); // null = all visible
  const [selectedBlock, setSelectedBlock] = useState('A');
  
  // Interactive 2D PCA State
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoveredAxis, setHoveredAxis] = useState(null);
  const svgRef = useRef(null);

  useEffect(() => {
    fetch('/api/clusters')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Not ok');
      })
      .then((data) => {
        if (data && typeof data === 'object') {
          const merged = { ...FALLBACK_CLUSTERS };
          Object.keys(data).forEach((k) => {
            if (merged[k]) {
              merged[k] = { ...merged[k], ...data[k] };
            }
          });
          setClusters(merged);
        }
      })
      .catch(() => {
        // Fallback embedded
      });
  }, []);

  const activeCluster = clusters[activeClusterId] || clusters['0'];

  // PCA coordinate transformations: SVG ViewBox 680 x 420
  // Center is (340, 210), Scale factor: PC1 [-4, 4] -> span 540, PC2 [-4, 4] -> span 320
  const toSvgCoords = (pc1, pc2) => {
    const cx = 340;
    const cy = 210;
    const scaleX = 68;
    const scaleY = 38;
    return {
      x: cx + pc1 * scaleX,
      y: cy - pc2 * scaleY
    };
  };

  const handleZoomIn = () => setZoom((z) => Math.min(2.5, +(z + 0.25).toFixed(2)));
  const handleZoomOut = () => setZoom((z) => Math.max(0.75, +(z - 0.25).toFixed(2)));
  const handleResetView = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
    setHoveredPoint(null);
    setIsolatedClusterId(null);
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const focusEmpirical = (account) => {
    setIsolatedClusterId(account.cluster);
    setActiveClusterId(String(account.cluster));
    setHoveredPoint(account);
    const coords = toSvgCoords(account.pc1, account.pc2);
    // Smoothly pan to focus
    setPan({
      x: (340 - coords.x) * 0.6,
      y: (210 - coords.y) * 0.6
    });
    setZoom(1.35);
  };

  // Radar Chart Geometry: Center at (180, 160), Radius 110
  const radarCenter = { x: 180, y: 160 };
  const radarRadius = 110;
  const numAxes = RADAR_METRICS.length;

  const getRadarPoint = (metricIndex, normalizedValue) => {
    const angle = -Math.PI / 2 + (metricIndex * 2 * Math.PI) / numAxes;
    const r = Math.max(0.08, Math.min(0.98, normalizedValue)) * radarRadius;
    return {
      x: +(radarCenter.x + r * Math.cos(angle)).toFixed(1),
      y: +(radarCenter.y + r * Math.sin(angle)).toFixed(1)
    };
  };

  const getAxisEndpoint = (metricIndex, length = radarRadius + 18) => {
    const angle = -Math.PI / 2 + (metricIndex * 2 * Math.PI) / numAxes;
    return {
      x: +(radarCenter.x + length * Math.cos(angle)).toFixed(1),
      y: +(radarCenter.y + length * Math.sin(angle)).toFixed(1),
      angle
    };
  };

  // Build Radar Polygons
  const activePolygonPoints = RADAR_METRICS.map((m, i) => {
    const val = activeCluster.fitur_mean ? activeCluster.fitur_mean[m.key] : POPULATION_BASELINE[m.key];
    const norm = (val - m.min) / (m.max - m.min);
    const pt = getRadarPoint(i, norm);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  const baselinePolygonPoints = RADAR_METRICS.map((m, i) => {
    const val = POPULATION_BASELINE[m.key];
    const norm = (val - m.min) / (m.max - m.min);
    const pt = getRadarPoint(i, norm);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
      {/* Editorial Header Bar */}
      <section className="bg-white border border-slate-200/90 rounded-[4px] px-6 py-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">
            Cluster Explorer
          </h1>
          <p className="text-[13px] text-slate-500 mt-0.5">
            Arketipe klasterisasi perilaku berbasis K-Means (k=7) pada 11 dimensi fitur terstandarisasi dengan proyeksi 2D PCA.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex border border-slate-300 rounded-[4px] overflow-hidden">
            <button
              onClick={() => setSelectedBlock('A')}
              className={`px-3 py-1 text-[12px] font-medium transition-colors ${
                selectedBlock === 'A' ? 'bg-navy-950 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Block A (78 jam)
            </button>
            <button
              onClick={() => setSelectedBlock('B')}
              className={`px-3 py-1 text-[12px] font-medium transition-colors border-l border-slate-200 ${
                selectedBlock === 'B' ? 'bg-navy-950 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Block B (74 jam)
            </button>
          </div>
        </div>
      </section>

      {/* Main Grid: Left Column 7 cols (PCA Explorer + Archetype Cards), Right Column 5 cols (Radar Chart + Metrics) */}
      <section className="w-full grid grid-cols-1 lg:grid-cols-12 border border-slate-200/90 rounded-[4px] shadow-2xs bg-white divide-y lg:divide-y-0 lg:divide-x divide-slate-200 overflow-hidden">
        {/* Left Column */}
        <div className="lg:col-span-7 flex flex-col divide-y divide-slate-200">
          {/* Interactive 2D PCA Universe Explorer */}
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
              <div>
                <h2 className="text-[14px] font-semibold text-slate-900">
                  2D PCA Universe Explorer
                </h2>
                <p className="text-[12px] text-slate-500">
                  Proyeksi Principal Component Analysis (PCA) dari vektor fitur perilaku 11 dimensi.
                </p>
              </div>
              <div className="flex items-center gap-3 text-[12px] text-slate-600">
                <span>Varians terjelaskan: <strong className="text-slate-900 font-semibold">68.4%</strong></span>
              </div>
            </div>

            {/* Empirical Bot Candidates Quick Jump Strip */}
            <div className="mb-3 flex flex-wrap items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-[4px]">
              <span className="text-[11px] font-bold text-navy-950 uppercase tracking-wide">
                Target Profiles:
              </span>
              {UNIVERSE_POINTS.filter((p) => p.isEmpirical).map((bot) => {
                const isSelected = hoveredPoint?.id === bot.id;
                return (
                  <button
                    key={bot.id}
                    type="button"
                    onClick={() => focusEmpirical(bot)}
                    className={`px-2 py-1 text-[11px] font-medium border rounded-[4px] transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-navy-950 text-white border-navy-950 shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    <span>{bot.empName}</span>
                    <span className={`text-[10px] px-1 py-0.2 rounded-[2px] font-semibold ${
                      bot.isAnomaly ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {bot.empRole}
                    </span>
                  </button>
                );
              })}
              {isolatedClusterId !== null && (
                <button
                  type="button"
                  onClick={handleResetView}
                  className="ml-auto text-[11px] text-navy-800 hover:text-navy-950 underline font-medium"
                >
                  Hapus Isolasi
                </button>
              )}
            </div>

            {/* Canvas Container with Controls */}
            <div className="relative w-full aspect-[16/10] bg-slate-50 border border-slate-200 rounded-[4px] overflow-hidden select-none">
              {/* Zoom & Pan HUD Buttons */}
              <div className="absolute top-3 right-3 z-10 flex items-center bg-white/95 backdrop-blur-xs border border-slate-300 rounded-[4px] shadow-xs divide-x divide-slate-200">
                <button
                  onClick={handleZoomIn}
                  className="p-1.5 text-slate-600 hover:text-navy-950 hover:bg-slate-100 transition-colors"
                  title="Zoom In"
                  type="button"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-1.5 text-slate-600 hover:text-navy-950 hover:bg-slate-100 transition-colors"
                  title="Zoom Out"
                  type="button"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleResetView}
                  className="px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-navy-950 hover:bg-slate-100 flex items-center gap-1 transition-colors"
                  title="Reset View"
                  type="button"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* View scale indicator */}
              <div className="absolute top-3 left-3 z-10 text-[10px] text-slate-500 font-mono bg-white/90 px-2 py-0.5 border border-slate-200 rounded-[4px]">
                ZOOM: {Math.round(zoom * 100)}% {isolatedClusterId !== null ? `· ISOLATED: C${isolatedClusterId}` : ''}
              </div>

              {/* SVG Universe Canvas */}
              <svg
                ref={svgRef}
                className={`w-full h-full ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
                viewBox="0 0 680 420"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <defs>
                  <pattern id="pca-fine-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2 3" />
                  </pattern>
                  {/* Subtle radial glow filter for empirical bots */}
                  <filter id="glow-empirical" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Transformed universe layer with zoom and pan */}
                <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`} transform-origin="340 210">
                  {/* Grid background */}
                  <rect x="-100" y="-100" width="880" height="620" fill="url(#pca-fine-grid)" />

                  {/* Major Quadrant Axes */}
                  <line x1="20" y1="210" x2="660" y2="210" stroke="#cbd5e1" strokeWidth="1.2" />
                  <line x1="340" y1="20" x2="340" y2="400" stroke="#cbd5e1" strokeWidth="1.2" />

                  {/* Axis numerical ticks */}
                  <g className="text-[10px] font-mono fill-slate-400 select-none">
                    <text x="340" y="415" textAnchor="middle">PC1: 0.0</text>
                    <text x="612" y="224" textAnchor="end">+4.0</text>
                    <text x="68" y="224" textAnchor="start">-4.0</text>
                    <text x="348" y="58" textAnchor="start">PC2: +4.0</text>
                    <text x="348" y="362" textAnchor="start">PC2: -4.0</text>
                  </g>

                  {/* Cluster Centroid Halos */}
                  {Object.keys(clusters).map((key) => {
                    const cl = clusters[key];
                    const isClusterIsolated = isolatedClusterId === null || isolatedClusterId === cl.cluster_id;
                    const coords = toSvgCoords(
                      cl.cluster_id === 0 ? 0.8 : cl.cluster_id === 1 ? -1.2 : cl.cluster_id === 2 ? 1.6 : cl.cluster_id === 3 ? -2.2 : cl.cluster_id === 4 ? -1.6 : cl.cluster_id === 5 ? 0.7 : 2.5,
                      cl.cluster_id === 0 ? -2.2 : cl.cluster_id === 1 ? 0.4 : cl.cluster_id === 2 ? 1.2 : cl.cluster_id === 3 ? 2.1 : cl.cluster_id === 4 ? 1.1 : cl.cluster_id === 5 ? 1.5 : -0.4
                    );
                    return (
                      <g key={`halo-${key}`} opacity={isClusterIsolated ? 0.18 : 0.03} className="transition-opacity duration-300">
                        <circle cx={coords.x} cy={coords.y} r="38" fill={cl.color} />
                      </g>
                    );
                  })}

                  {/* Render Normal Points */}
                  {UNIVERSE_POINTS.filter((p) => !p.isEmpirical).map((pt) => {
                    const coords = toSvgCoords(pt.pc1, pt.pc2);
                    const cl = clusters[String(pt.cluster)] || clusters['0'];
                    const isDimmed = isolatedClusterId !== null && isolatedClusterId !== pt.cluster;
                    const isHovered = hoveredPoint?.id === pt.id;

                    return (
                      <circle
                        key={pt.id}
                        cx={coords.x}
                        cy={coords.y}
                        r={isHovered ? 6.5 : pt.isAnomaly ? 4.5 : 3.5}
                        fill={cl.color}
                        stroke={isHovered ? '#0a192f' : pt.isAnomaly ? '#ffffff' : 'none'}
                        strokeWidth={isHovered ? 2 : pt.isAnomaly ? 1 : 0}
                        opacity={isDimmed ? 0.12 : isHovered ? 1.0 : pt.isAnomaly ? 0.95 : 0.75}
                        className="cursor-pointer transition-all duration-200"
                        onMouseEnter={() => setHoveredPoint(pt)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    );
                  })}

                  {/* Render Empirical Bot Special Markers */}
                  {UNIVERSE_POINTS.filter((p) => p.isEmpirical).map((bot) => {
                    const coords = toSvgCoords(bot.pc1, bot.pc2);
                    const isDimmed = isolatedClusterId !== null && isolatedClusterId !== bot.cluster;
                    const isHovered = hoveredPoint?.id === bot.id;
                    const cl = clusters[String(bot.cluster)] || clusters['0'];

                    return (
                      <g
                        key={bot.id}
                        transform={`translate(${coords.x}, ${coords.y})`}
                        opacity={isDimmed ? 0.2 : 1.0}
                        className="cursor-pointer transition-all duration-200"
                        onMouseEnter={() => setHoveredPoint(bot)}
                        onClick={() => focusEmpirical(bot)}
                      >
                        {/* Target Reticle Outer Ring */}
                        <circle
                          r={isHovered ? 16 : 12}
                          fill="none"
                          stroke={bot.isAnomaly ? '#dc2626' : '#0a192f'}
                          strokeWidth={isHovered ? 2 : 1.2}
                          strokeDasharray={isHovered ? 'none' : '3 2'}
                          className={isHovered ? 'animate-pulse' : ''}
                        />

                        {/* Central Diamond Pin */}
                        <rect
                          x={-4}
                          y={-4}
                          width={8}
                          height={8}
                          transform="rotate(45)"
                          fill={bot.isAnomaly ? '#dc2626' : '#0a192f'}
                          stroke="#ffffff"
                          strokeWidth={1.5}
                        />

                        {/* Leader Label Card */}
                        <g transform={`translate(${bot.pc1 > 0 ? 12 : -110}, ${bot.pc2 > 0 ? -22 : 10})`}>
                          <rect
                            x="0"
                            y="0"
                            width="98"
                            height="18"
                            fill="white"
                            stroke={bot.isAnomaly ? '#f87171' : '#94a3b8'}
                            strokeWidth="1"
                            rx="2"
                          />
                          <text
                            x="49"
                            y="12"
                            textAnchor="middle"
                            className="text-[9px] font-mono font-bold"
                            fill={bot.isAnomaly ? '#991b1b' : '#0f172a'}
                          >
                            {bot.empName}
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </g>
              </svg>

              {/* Dynamic Floating Tooltip */}
              {hoveredPoint && (
                <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-sm z-20 bg-white border border-slate-300 rounded-[4px] p-3 shadow-md pointer-events-none transition-all">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 gap-3">
                    <span className="font-mono text-[12px] font-bold text-navy-950">
                      {hoveredPoint.empName || hoveredPoint.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-[2px] uppercase ${
                        hoveredPoint.isAnomaly
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {hoveredPoint.isAnomaly ? 'Bot Candidate' : 'Normal Human'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Archetype:</span>
                      <strong className="text-navy-950">
                        {clusters[String(hoveredPoint.cluster)]?.title} ({clusters[String(hoveredPoint.cluster)]?.badge})
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Anomaly Score:</span>
                      <strong className={hoveredPoint.isAnomaly ? 'text-rose-600' : 'text-navy-950'}>
                        τ = {hoveredPoint.score}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Coordinates:</span>
                      <span className="font-mono text-slate-700">
                        PC1: {hoveredPoint.pc1 > 0 ? `+${hoveredPoint.pc1}` : hoveredPoint.pc1} · PC2: {hoveredPoint.pc2 > 0 ? `+${hoveredPoint.pc2}` : hoveredPoint.pc2}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Threshold Status:</span>
                      <span className="text-slate-700">
                        {hoveredPoint.score >= 0.5514 ? 'τ ≥ 0.5514 (Cutoff Anomali)' : 'Dalam rentang batas normal'}
                      </span>
                    </div>
                  </div>

                  {hoveredPoint.empDetail && (
                    <div className="mt-2 pt-1.5 border-t border-slate-100 text-[11px] text-slate-600 italic">
                      {hoveredPoint.empDetail}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cluster Isolation Filter Bar */}
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-medium text-slate-600 mr-1">Filter Cluster:</span>
                <button
                  type="button"
                  onClick={() => setIsolatedClusterId(null)}
                  className={`px-2 py-0.5 rounded-[4px] border text-[11px] transition-colors ${
                    isolatedClusterId === null
                      ? 'bg-navy-950 text-white border-navy-950 font-semibold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Semua (7)
                </button>
                {Object.keys(clusters).map((key) => {
                  const cl = clusters[key];
                  const isIsolated = isolatedClusterId === cl.cluster_id;
                  return (
                    <button
                      key={cl.cluster_id}
                      type="button"
                      onClick={() => {
                        setIsolatedClusterId(isIsolated ? null : cl.cluster_id);
                        setActiveClusterId(String(cl.cluster_id));
                      }}
                      className={`px-2 py-0.5 rounded-[4px] border text-[11px] font-medium transition-colors flex items-center gap-1 ${
                        isIsolated
                          ? 'bg-navy-950 text-white border-navy-950 font-semibold shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-[1px]" style={{ backgroundColor: cl.color }} />
                      <span>C{cl.cluster_id}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Archetypes Selector Grid */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[14px] font-semibold text-slate-900">
                Behavioral Archetypes (7 Clusters)
              </h2>
              <span className="text-[11px] text-slate-500">
                Pilih arketipe untuk memeriksa radar fitur 11 dimensi dan perilakunya
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.keys(clusters).map((key) => {
                const cl = clusters[key];
                const isSelected = activeClusterId === String(cl.cluster_id);
                return (
                  <button
                    key={cl.cluster_id}
                    onClick={() => {
                      setActiveClusterId(String(cl.cluster_id));
                      setIsolatedClusterId(cl.cluster_id);
                    }}
                    type="button"
                    className={`p-3.5 text-left border rounded-[4px] transition-all ${
                      isSelected
                        ? 'bg-slate-100 border-navy-950 text-navy-950 shadow-2xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: cl.color }} />
                        <span className="text-[13px] font-bold text-navy-950">
                          {cl.title}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-600">
                        {cl.accounts} ({cl.accountsPct})
                      </span>
                    </div>

                    <div className="text-[12px] text-slate-600 truncate font-medium">
                      {cl.badge}
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-2 mt-2 border-t border-slate-200">
                      <span className="text-slate-500">
                        Anomaly: <strong className="text-rose-600">{cl.anomalyRate}</strong>
                      </span>
                      <span className="text-slate-500">
                        Mean: μ {cl.score}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: 11-Dimension Interactive Radar Chart & Profile Inspector */}
        <div className="lg:col-span-5 p-6 flex flex-col gap-6 bg-white">
          {/* Header of selected cluster */}
          <div className="pb-4 border-b border-slate-200 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: activeCluster.color }} />
                <h3 className="text-[16px] font-bold text-slate-900 tracking-tight">
                  {activeCluster.title}
                </h3>
              </div>
              <span className="text-[12px] font-medium text-slate-600 block mt-0.5">
                {activeCluster.badge}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-500 block">Total Accounts</span>
              <span className="text-2xl font-bold text-slate-900">
                {activeCluster.accounts}
              </span>
            </div>
          </div>

          {/* Metrics Trio Strip */}
          <div className="grid grid-cols-3 border border-slate-200 divide-x divide-slate-200 text-center bg-slate-50/50 rounded-[4px] overflow-hidden">
            <div className="p-3">
              <span className="text-[11px] text-slate-500 block">Anomaly Rate</span>
              <span className="text-base font-bold text-rose-600">{activeCluster.anomalyRate}</span>
            </div>
            <div className="p-3">
              <span className="text-[11px] text-slate-500 block">Mean Score</span>
              <span className="text-base font-bold text-slate-900">μ {activeCluster.score}</span>
            </div>
            <div className="p-3">
              <span className="text-[11px] text-slate-500 block">Median Evt</span>
              <span className="text-base font-bold text-slate-900">{activeCluster.events}</span>
            </div>
          </div>

          {/* 11-DIMENSION INTERACTIVE RADAR CHART */}
          <div className="border border-slate-200 rounded-[4px] p-4 bg-slate-50/40">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="text-[13px] font-bold text-navy-950 uppercase tracking-wider">
                  11-Dimension Feature Radar
                </h4>
                <p className="text-[11px] text-slate-500">
                  Poligon arketipe klaster dibandingkan dengan baseline rata-rata populasi normal.
                </p>
              </div>
              {/* Radar Legend */}
              <div className="flex flex-col gap-1 text-[10px] text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-[1px]" style={{ backgroundColor: activeCluster.color }} />
                  <span className="font-semibold text-navy-950">{activeCluster.title}</span>
                </div>
                <div className="flex items-center justify-end gap-1.5 text-slate-500">
                  <span className="w-2.5 h-0.5 bg-slate-400 inline-block border-b border-dashed border-slate-500" />
                  <span>Population Baseline</span>
                </div>
              </div>
            </div>

            {/* Radar Spider SVG Canvas */}
            <div className="relative w-full aspect-square max-w-[340px] mx-auto select-none">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 360 320">
                {/* Concentric Polygonal Guide Rings (20%, 40%, 60%, 80%, 100%) */}
                {[0.2, 0.4, 0.6, 0.8, 1.0].map((ringLevel) => {
                  const ringPoints = RADAR_METRICS.map((_, i) => {
                    const pt = getRadarPoint(i, ringLevel);
                    return `${pt.x},${pt.y}`;
                  }).join(' ');

                  return (
                    <polygon
                      key={`ring-${ringLevel}`}
                      points={ringPoints}
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth={ringLevel === 1.0 ? 1.2 : 0.75}
                      strokeDasharray={ringLevel === 1.0 ? 'none' : '2 2'}
                    />
                  );
                })}

                {/* Concentric Guide Ring Labels */}
                <text x={radarCenter.x} y={radarCenter.y - 0.5 * radarRadius} textAnchor="middle" className="text-[9px] font-mono fill-slate-300">
                  50%
                </text>
                <text x={radarCenter.x} y={radarCenter.y - 1.0 * radarRadius + 10} textAnchor="middle" className="text-[9px] font-mono fill-slate-400 font-semibold">
                  100%
                </text>

                {/* 11 Axis Spokes */}
                {RADAR_METRICS.map((metric, i) => {
                  const end = getAxisEndpoint(i, radarRadius);
                  const labelPos = getAxisEndpoint(i, radarRadius + 18);
                  const isHovered = hoveredAxis === i;

                  return (
                    <g key={metric.key} className="cursor-pointer" onMouseEnter={() => setHoveredAxis(i)} onMouseLeave={() => setHoveredAxis(null)}>
                      <line
                        x1={radarCenter.x}
                        y1={radarCenter.y}
                        x2={end.x}
                        y2={end.y}
                        stroke={isHovered ? '#1e3a8a' : '#cbd5e1'}
                        strokeWidth={isHovered ? 1.8 : 0.8}
                        className="transition-colors"
                      />
                      {/* Interactive Endpoint Label */}
                      <text
                        x={labelPos.x}
                        y={labelPos.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className={`text-[9px] font-medium transition-colors ${
                          isHovered ? 'fill-navy-950 font-bold' : 'fill-slate-500'
                        }`}
                      >
                        {metric.label.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}

                {/* Baseline Population Polygon */}
                <polygon
                  points={baselinePolygonPoints}
                  fill="#94a3b8"
                  fillOpacity="0.12"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />

                {/* Active Cluster Polygon */}
                <polygon
                  points={activePolygonPoints}
                  fill={activeCluster.color}
                  fillOpacity="0.25"
                  stroke={activeCluster.color}
                  strokeWidth="2.2"
                />

                {/* Active Cluster Node Circles */}
                {RADAR_METRICS.map((m, i) => {
                  const val = activeCluster.fitur_mean ? activeCluster.fitur_mean[m.key] : POPULATION_BASELINE[m.key];
                  const norm = (val - m.min) / (m.max - m.min);
                  const pt = getRadarPoint(i, norm);
                  const isHovered = hoveredAxis === i;

                  return (
                    <circle
                      key={`pt-${m.key}`}
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 5.5 : 3.5}
                      fill={activeCluster.color}
                      stroke="#ffffff"
                      strokeWidth={1.5}
                      className="cursor-pointer transition-all duration-150"
                      onMouseEnter={() => setHoveredAxis(i)}
                      onMouseLeave={() => setHoveredAxis(null)}
                    />
                  );
                })}
              </svg>
            </div>

            {/* Interactive Axis Hover Inspector Card */}
            <div className="mt-2 p-2.5 bg-white border border-slate-200 rounded-[4px] transition-all">
              {hoveredAxis !== null ? (
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-navy-950 text-[12px]">
                      {RADAR_METRICS[hoveredAxis].label} ({RADAR_METRICS[hoveredAxis].key})
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase">Axis {hoveredAxis + 1} of 11</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {RADAR_METRICS[hoveredAxis].desc}
                  </p>
                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 text-[11px]">
                    <span className="text-slate-600">
                      Nilai Klaster: <strong className="text-navy-950">{RADAR_METRICS[hoveredAxis].format(activeCluster.fitur_mean[RADAR_METRICS[hoveredAxis].key])}</strong>
                    </span>
                    <span className="text-slate-500">
                      Baseline: {RADAR_METRICS[hoveredAxis].format(POPULATION_BASELINE[RADAR_METRICS[hoveredAxis].key])}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-slate-500 text-center py-1">
                  Arahkan kursor pada sumbu atau titik pada radar spider untuk memeriksa nilai metrik dan deviasinya.
                </div>
              )}
            </div>
          </div>

          {/* Behavioral Characteristics */}
          <div>
            <h4 className="text-[12px] font-bold text-navy-950 uppercase tracking-wider mb-2">
              Behavioral Characteristics
            </h4>
            <ul className="p-3.5 border border-slate-200 bg-slate-50/40 rounded-[4px] space-y-2 text-[12px] text-slate-700 leading-relaxed">
              {activeCluster.characteristics.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-navy-900 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
