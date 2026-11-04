import React, { useState } from 'react';
import { GraduationCap, UsersRound, ExternalLink, Github } from 'lucide-react';
import { dosen, anggota, proyek } from '../data/teamData';

/**
 * Ambil inisial dari nama, abaikan gelar akademik (token berakhiran titik).
 * Contoh: "Assoc. Prof. Dr. Rahmad Kurniawan, ST., MIT." -> "RK"
 */
function getInitials(name = '') {
  const words = name
    .split(/\s+/)
    .map((w) => w.replace(/,+$/, ''))
    .filter((w) => w && !w.endsWith('.'));
  if (words.length === 0) return '?';
  const first = words[0][0] || '';
  const last = words.length > 1 ? words[words.length - 1][0] || '' : '';
  return (first + last).toUpperCase();
}

/**
 * Foto profil dengan fallback inisial.
 * Jika file foto belum diunggah atau gagal dimuat, tampilkan inisial nama.
 */
function ProfilePhoto({ src, name, className = '', initialsClassName = 'text-[28px]' }) {
  const [failed, setFailed] = useState(!src);

  if (failed) {
    return (
      <div
        className={`${className} bg-slate-100 text-slate-400 flex items-center justify-center font-semibold tracking-tight select-none`}
        aria-label={`Foto ${name} belum tersedia`}
        role="img"
      >
        <span className={initialsClassName}>{getInitials(name)}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`Foto ${name}`}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`${className} object-cover bg-slate-100`}
    />
  );
}

function SectionLabel({ icon: Icon, children, aside }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-3">
      <div className="flex items-center gap-2 text-[11px] text-slate-500 uppercase tracking-wider font-bold font-mono">
        <Icon className="w-3.5 h-3.5" />
        <span>{children}</span>
      </div>
      {aside && <div className="text-[11px] font-medium text-slate-400">{aside}</div>}
    </div>
  );
}

export default function Team() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Research Team</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">
            {proyek.kelompok} · {proyek.prodi}, {proyek.fakultas}, {proyek.kampus}.
          </p>
        </div>
        <div className="text-[11px] font-medium text-slate-500">PBL Big Data 2026 · Universitas Riau</div>
      </div>

      {/* Dosen Pengampu */}
      <section aria-labelledby="dosen-heading">
        <SectionLabel icon={GraduationCap}>Dosen Pengampu</SectionLabel>
        <div className="bg-white border border-slate-200/90 rounded-[4px] p-5 sm:p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-7 sm:items-center">
            <ProfilePhoto
              src={dosen.foto}
              name={dosen.nama}
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-[6px] shrink-0"
              initialsClassName="text-[40px]"
            />
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {dosen.peran}
              </div>
              <h2 id="dosen-heading" className="text-[18px] sm:text-[22px] font-bold text-slate-900 tracking-tight mt-1 leading-snug">
                {dosen.nama}
              </h2>
              <dl className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-[12px] max-w-[640px]">
                <div className="flex justify-between gap-4 py-1 border-b border-slate-100">
                  <dt className="text-slate-500">Afiliasi</dt>
                  <dd className="font-semibold text-navy-950 text-right">{dosen.afiliasi}</dd>
                </div>
                <div className="flex justify-between gap-4 py-1 border-b border-slate-100">
                  <dt className="text-slate-500">Mata Kuliah</dt>
                  <dd className="font-semibold text-navy-950 text-right">{dosen.mataKuliah}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Anggota Tim */}
      <section aria-label="Anggota tim">
        <SectionLabel icon={UsersRound} aside={`${anggota.length} anggota`}>
          Anggota Tim
        </SectionLabel>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5">
          {anggota.map((orang, idx) => (
            <article
              key={`${orang.nama}-${idx}`}
              className="bg-white border border-slate-200/90 rounded-[4px] overflow-hidden shadow-2xs hover:border-slate-300 transition-colors"
            >
              <ProfilePhoto
                src={orang.foto}
                name={orang.nama}
                className="w-full aspect-[4/3] object-top"
                initialsClassName="text-[36px] sm:text-[44px]"
              />
              <div className="px-3 py-3 sm:px-4 sm:py-3.5">
                <div className="text-[13px] sm:text-[15px] font-semibold text-slate-900 leading-snug">{orang.nama}</div>
                {orang.nim && (
                  <div className="text-[11px] sm:text-[12px] text-slate-500 mt-0.5 tabular-nums">NIM {orang.nim}</div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Repositori Proyek */}
      <section aria-label="Repositori proyek">
        <SectionLabel icon={Github}>Repositori Proyek</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {proyek.repositori.map((repo) => (
            <a
              key={repo.url}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white border border-slate-200/90 rounded-[4px] px-4 py-3 shadow-2xs hover:border-slate-300 transition-colors flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-slate-900">{repo.label}</div>
                <div className="text-[11px] text-slate-500 truncate">{repo.url.replace('https://', '')}</div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-700 shrink-0 transition-colors" />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
