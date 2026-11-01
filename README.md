# GH Intelligence — GitHub Bot & Anomaly Detection Dashboard

[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.4-F7931E?logo=scikitlearn&logoColor=white)](https://scikit-learn.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Platform Web Interaktif untuk Deteksi dan Klasterisasi Akun Bot Siluman (*Stealth Bots*) pada Aktivitas GitHub Menggunakan MongoDB Atlas, Isolation Forest, dan K-Means.**

Proyek ini merupakan deliverable interaktif berbasis web untuk **Project-Based Learning (PBL) Big Data 2026** di Program Studi Teknik Informatika, Fakultas Teknik, Universitas Riau.

- **Dosen Pembimbing**: Assoc. Prof. Dr. Rahmad Kurniawan, ST., MIT.
- **Pengembang**: Ryanda Valents Anakri ([@ryandaaa](https://github.com/ryandaaa))
- **Repositori Pipeline Data**: [ryandaaa/gh-bot-detection](https://github.com/ryandaaa/gh-bot-detection)
- **Repositori Dashboard**: [ryandaaa/gh-bot-detection-dashboard](https://github.com/ryandaaa/gh-bot-detection-dashboard)

---

## 🌟 Fitur Utama

1. **Live GitHub Account Intelligence**
   - Evaluasi real-time profil publik pengguna GitHub langsung via GitHub REST API v3.
   - Pengekstraksian hingga 300 event publik terbaru secara asinkron (*concurrent pagination*).
   - Ekstraksi 11 dimensi fitur perilaku dan inferensi skor anomali langsung menggunakan model Isolation Forest terlatih.
   - Deteksi otomatis akun bot resmi GitHub (`[bot]` slug & `type == "Bot"`).

2. **Account Inspector & Parameter Simulator**
   - **Mode Akun Termodel**: Inspeksi akun hasil olahan MongoDB Atlas dengan skor anomali aktual dan atribusi klaster terverifikasi.
   - **Mode Parameter Simulator**: Simulator 11 dimensi metrik aktivitas (volume event, repositori unik, rasio Push, rasio PR, entropi waktu, variasi tipe event) dengan tombol cepat arketipe (*SEO Spam Bot*, *Forex EA Deployer*, *100k Spoofer*, *CI Bot*, *Active Human Dev*).

3. **Overview & Visualisasi Analitik**
   - **Kurva Distribusi Skor Anomali (KDE)**: Estimasi densitas kernel interaktif pada 44.200 akun dengan penunjuk garis ambang batas (*cutoff*) $\tau = 0.5514$ (top 5% anomali) dan *crosshair scrubber*.
   - **Komposisi Klaster Donut**: Pemetaan 7 arketipe perilaku ($C_0 - C_6$) hasil partisi algoritma K-Means.

4. **Account Explorer**
   - Penelusuran dataset akun termodel dengan filter multi-kriteria (Blok observasi temporal, Klaster perilaku, Status deteksi anomali) serta pencarian ID tersamar (*pseudonymized hash*).

5. **Cloudflare Kumo Design System**
   - Skema warna gelap presisi diekstrak langsung dari token desain Cloudflare Kumo (`#101010` untuk kanvas dan kartu, `#262626` untuk hairline border, dan aksen putih monokrom elegan).
   - Layout *edge-to-edge*, dock navigasi melayang (*floating navigation dock*), dan transisi halaman halus.

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                   GitHub Archive (GH Archive)               │
│               9.88M Event Publik (152 Jam Observasi)        │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      MongoDB Atlas M10                      │
│             Agregasi & Ekstraksi 11 Fitur Perilaku          │
│                44.200 Akun Kontributor Termodel             │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  Machine Learning Pipeline                  │
│  - Isolation Forest: Deteksi Anomali (Cutoff τ = 0.5514)    │
│  - K-Means (k=7): Segmentasi Arketipe Perilaku Kontributor  │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│      FastAPI Backend         │ │     React 18 + Vite SPA    │
│  - Streaming GitHub REST API │ │  - Interaktif Visualisasi  │
│  - Runtime Scikit-Learn Inf  │ │  - Cloudflare Kumo Theme   │
└──────────────────────────────┘ └────────────────────────────┘
```

---

## 📊 11 Dimensi Fitur Perilaku

| No | Fitur | Deskripsi |
|---|---|---|
| 1 | `n_events` | Total volume tindakan publik yang dilakukan oleh akun |
| 2 | `n_repos` | Jumlah repositori unik yang disentuh oleh akun |
| 3 | `active_hours` | Rentang jendela jam aktif observasi (dari total 152 jam) |
| 4 | `events_per_hour` | Intensitas laju peristiwa per jam aktif |
| 5 | `push_ratio` | Proporsi tindakan pengiriman kode (`PushEvent`) |
| 6 | `watch_ratio` | Proporsi tindakan pemberian bintang (`WatchEvent`) |
| 7 | `pr_ratio` | Proporsi tindakan pengajuan pull request (`PullRequestEvent`) |
| 8 | `fork_ratio` | Proporsi tindakan duplikasi repositori (`ForkEvent`) |
| 9 | `issue_ratio` | Proporsi interaksi tiket kendala (`IssuesEvent`) |
| 10 | `repo_entropy` | Diversitas dan sebaran tindakan lintas berbagai repositori |
| 11 | `hour_entropy` | Kerataan distribusi aktivitas sepanjang 24 jam (pola bot 24/7) |

---

## 🚀 Panduan Menjalankan Secara Lokal

### Prasyarat
- [Node.js](https://nodejs.org/) (v18+) atau [Bun](https://bun.sh/)
- [Python](https://python.org/) 3.10+
- [Git](https://git-scm.com/)

### 1. Kloning Repositori
```bash
git clone https://github.com/ryandaaa/gh-bot-detection-dashboard.git
cd gh-bot-detection-dashboard
```

### 2. Jalankan Backend (FastAPI)
```bash
# Buat dan aktifkan virtual environment (opsional)
python -m venv .venv
source .venv/bin/activate  # Di Linux/macOS
# .venv\Scripts\activate   # Di Windows

# Pasang pustaka dependensi
pip install -r requirements.txt

# Jalankan server FastAPI pada port 8000
uvicorn api.index:app --reload --port 8000
```
Server backend akan aktif di: `http://localhost:8000` (Dokumentasi Swagger di: `http://localhost:8000/docs`).

### 3. Jalankan Frontend (React + Vite)
Buka terminal baru pada folder yang sama:
```bash
# Pasang paket dependensi
bun install   # atau: npm install

# Jalankan development server
bun run dev   # atau: npm run dev
```
Dashboard akan dapat diakses pada browser di: `http://localhost:5173`.

---

## 🚢 Konfigurasi Deployment (Vercel)

Aplikasi ini telah dirancang untuk siap diterapkan langsung di **Vercel** dengan arsitektur *Monorepo Serverless*:
- File [`vercel.json`](./vercel.json) mengarahkan endpoint `/api/*` secara otomatis ke serverless function Python di [`api/index.py`](./api/index.py).
- Build frontend SPA ditangani otomatis oleh Vite ke direktori `dist/`.

---

## 📄 Hak Cipta & Lisensi

Diterbitkan di bawah lisensi **MIT License**. Dikembangkan untuk tujuan riset akademis dan portofolio Project-Based Learning (PBL) Big Data 2026, Universitas Riau.
