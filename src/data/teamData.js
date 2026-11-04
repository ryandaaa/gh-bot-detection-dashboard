/**
 * Data Tim Peneliti - Kelompok 4 PBL Big Data 2026
 *
 * CARA MENGISI:
 * 1. Taruh foto di folder public/images/team/ dengan nama file sesuai field `foto`.
 *    Format JPG/PNG/WebP, rasio 1:1 (persegi), ukuran minimal 400x400 px.
 * 2. Ganti nama, NIM, dan peran setiap anggota di bawah ini.
 * 3. Field yang dikosongkan ('') tidak akan ditampilkan di halaman.
 *
 * Jika foto belum ada atau gagal dimuat, halaman otomatis menampilkan inisial nama.
 */

export const dosen = {
  nama: 'Assoc. Prof. Dr. Rahmad Kurniawan, ST., MIT.',
  peran: 'Dosen Pengampu & Pembimbing',
  afiliasi: 'Program Studi S-1 Sistem Informasi, FMIPA Universitas Riau',
  mataKuliah: 'Big Data (PBL 2026)',
  foto: '/images/team/rahmad-kurniawan.jpg',
};

export const anggota = [
  {
    nama: 'Ryanda Valents Anakri',
    nim: '2303113649',
    peran: 'Anggota Tim',
    foto: '/images/team/anggota-1.jpg',
  },
  {
    nama: 'M. Thariq Adzikra',
    nim: '0000',
    peran: 'Anggota Tim',
    foto: '/images/team/anggota-2.jpg',
  },
  {
    nama: 'Anggota 3',
    nim: '2303126077',
    peran: 'Anggota Tim',
    foto: '/images/team/anggota-3.jpeg',
  },
  {
    nama: 'yesi rahma putri utami',
    nim: '0000000',
    peran: 'Anggota Tim',
    foto: '/images/team/anggota-4.jpg',
  },
  {
    nama: 'Anggota 5',
    nim: '',
    peran: 'Anggota Tim',
    foto: '/images/team/anggota-5.jpg',
  },
  {
    nama: 'Anggota 6',
    nim: '',
    peran: 'Anggota Tim',
    foto: '/images/team/anggota-6.jpg',
  },
];

export const proyek = {
  kelompok: 'Kelompok 4 Big Data',
  prodi: 'Program Studi S-1 Sistem Informasi',
  fakultas: 'Fakultas Matematika dan Ilmu Pengetahuan Alam',
  kampus: 'Universitas Riau',
  repositori: [
    {
      label: 'Notebook & Dokumentasi Riset',
      url: 'https://github.com/ryandaaa/gh-bot-detection',
    },
    {
      label: 'Source Code Dashboard',
      url: 'https://github.com/ryandaaa/gh-bot-detection-dashboard',
    },
  ],
};
