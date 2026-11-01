import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Check,
  X
} from 'lucide-react';
import Skeleton, { SkeletonCard } from '../components/Skeleton';
import { ACCOUNTS_DATA } from '../data/accountsData';

/**
 * Custom CSS Dropdown Component
 * Replaces native HTML select with a high-end, full-height SaaS dropdown popover.
 * Anti box-in-a-box: integrates seamlessly into full-height toolbar divider cells.
 */
function CustomDropdown({ labelPrefix, value, onChange, options, align = 'right' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const selectedOption = options.find((o) => o.value === value) || options[0];

  return (
    <div ref={dropdownRef} className="relative h-full flex items-stretch">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`h-full px-4 flex items-center gap-2 text-[12px] font-sans transition-colors select-none ${
          isOpen ? 'bg-slate-100 text-slate-900' : 'hover:bg-slate-50 text-slate-700'
        }`}
      >
        <span className="text-slate-400 font-normal">{labelPrefix}</span>
        <span className="text-slate-900 font-medium whitespace-nowrap">
          {selectedOption.label}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${
            isOpen ? 'rotate-180 text-slate-700' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            align === 'left' ? 'left-0' : 'right-0'
          } top-full mt-1.5 min-w-[210px] max-h-[320px] overflow-y-auto bg-white border border-slate-200 rounded-[4px] shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100 divide-y divide-slate-100`}
        >
          <div className="py-0.5">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left text-[12px] flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-slate-50 text-navy-950 font-semibold'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-normal'
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-navy-950 ml-2 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AccountExplorer({ onOpenAnalyzeModal }) {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('all');
  const [selectedCluster, setSelectedCluster] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 240);
    return () => clearTimeout(timer);
  }, []);

  // Filter accounts
  const filteredAccounts = useMemo(() => {
    return ACCOUNTS_DATA.filter((acc) => {
      if (search.trim()) {
        const query = search.trim().toLowerCase();
        if (!acc.id.toLowerCase().includes(query)) {
          return false;
        }
      }
      if (selectedBlock !== 'all' && acc.block !== selectedBlock) {
        return false;
      }
      if (selectedCluster !== 'all' && acc.cluster !== selectedCluster) {
        return false;
      }
      if (selectedStatus === 'anomaly' && !acc.isAnomaly) {
        return false;
      }
      if (selectedStatus === 'normal' && acc.isAnomaly) {
        return false;
      }
      return true;
    });
  }, [search, selectedBlock, selectedCluster, selectedStatus]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredAccounts.length / itemsPerPage));
  const paginatedAccounts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAccounts.slice(start, start + itemsPerPage);
  }, [filteredAccounts, currentPage, itemsPerPage]);

  // Windowed pagination items
  const paginationRange = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [1];
    if (currentPage > 3) {
      pages.push('...');
    }
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) {
      pages.push('...');
    }
    pages.push(totalPages);
    return pages;
  }, [currentPage, totalPages]);

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
        <div className="space-y-2 border-b border-slate-200/80 pb-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>

        {/* Table Shimmer Skeleton */}
        <div className="bg-white border border-slate-200/90 rounded-[4px] overflow-hidden">
          <div className="h-11 border-b border-slate-200 bg-slate-50 flex items-center px-4 justify-between">
            <Skeleton className="h-4 w-64" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="divide-y divide-slate-100 p-2 space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2 px-3">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
      {/* Editorial Page Header - Calm, Clean, Focused */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">
            Account Explorer
          </h1>
          <p className="text-[13px] text-slate-500 mt-0.5">
            Penyaringan, inspeksi, dan evaluasi akun termodel berdasarkan 11 fitur perilaku dan skor anomali lintas-blok observasi.
          </p>
        </div>
        <div className="text-[11px] font-medium text-slate-500">
          Menampilkan <strong className="text-slate-900">{filteredAccounts.length.toLocaleString()}</strong> akun termodel
        </div>
      </div>

      {/* Standalone Filter & Search Toolbar Pill */}
      <div className="bg-white border border-slate-200/90 rounded-[6px] shadow-2xs flex flex-col md:flex-row items-stretch divide-y md:divide-y-0 md:divide-x divide-slate-200 relative z-20 overflow-visible">
        {/* Integrated Search Input (Full Height, No Inner Border or Whitespace) */}
        <div className="flex-1 h-11 flex items-center px-4 gap-2.5 min-w-0">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari ID pseudonim (contoh: a91f, c7d2)..."
            className="w-full h-full bg-transparent text-[13px] text-slate-900 placeholder:text-slate-400 outline-none font-sans"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setCurrentPage(1);
              }}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-[2px] transition-colors"
              title="Hapus pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Full-Height Filter Dropdowns with Custom CSS Popovers */}
        <div className="flex items-stretch divide-x divide-slate-200 shrink-0 relative overflow-visible h-11">
          {/* Block Selector */}
          <CustomDropdown
            labelPrefix="Block:"
            value={selectedBlock}
            align="left"
            onChange={(val) => {
              setSelectedBlock(val);
              setCurrentPage(1);
            }}
            options={[
              { value: 'all', label: 'All Blocks' },
              { value: 'block-a', label: 'Block A (78 jam)' },
              { value: 'block-b', label: 'Block B (74 jam)' },
            ]}
          />

          {/* Cluster Selector */}
          <CustomDropdown
            labelPrefix="Cluster:"
            value={selectedCluster}
            align="right"
            onChange={(val) => {
              setSelectedCluster(val);
              setCurrentPage(1);
            }}
            options={[
              { value: 'all', label: 'All Clusters' },
              { value: 'C0', label: 'C0 · Burst Pushers' },
              { value: 'C1', label: 'C1 · Heavy Pushers' },
              { value: 'C2', label: 'C2 · Multi-Repo Push' },
              { value: 'C3', label: 'C3 · Automated CI' },
              { value: 'C4', label: 'C4 · Tooling Bots' },
              { value: 'C5', label: 'C5 · Push & Create' },
              { value: 'C6', label: 'C6 · 24/7 High Vol' },
            ]}
          />

          {/* Status Selector */}
          <CustomDropdown
            labelPrefix="Status:"
            value={selectedStatus}
            align="right"
            onChange={(val) => {
              setSelectedStatus(val);
              setCurrentPage(1);
            }}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'anomaly', label: 'Hanya Anomali (τ ≥ 0.5514)' },
              { value: 'normal', label: 'Hanya Normal (τ < 0.5514)' },
            ]}
          />
        </div>
      </div>

      {/* Standalone Data Table Card */}
      <section className="bg-white border border-slate-200/90 rounded-[6px] shadow-2xs overflow-hidden">
        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-sans text-[11px] font-semibold select-none">
                <th className="py-2.5 px-6" scope="col">
                  Account Identifier
                </th>
                <th className="py-2.5 px-4 text-right" scope="col">
                  Events
                </th>
                <th className="py-2.5 px-4 text-right" scope="col">
                  Repos
                </th>
                <th className="py-2.5 px-4 text-right" scope="col">
                  Active Window
                </th>
                <th className="py-2.5 px-4 text-right" scope="col">
                  Anomaly Score
                </th>
                <th className="py-2.5 px-4 text-center" scope="col">
                  Cluster
                </th>
                <th className="py-2.5 px-6 text-right w-24" scope="col">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-900 font-sans text-[13px]">
              {paginatedAccounts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-500 text-[13px]">
                    Tidak ada data akun yang sesuai dengan filter atau kata kunci pencarian.
                  </td>
                </tr>
              ) : (
                paginatedAccounts.map((account) => (
                  <tr
                    key={account.id}
                    onClick={() => onOpenAnalyzeModal(account)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-6 font-mono text-[12px] text-slate-900 font-medium">
                      {account.id}
                    </td>
                    <td className="py-3 px-4 font-mono text-[12px] text-right text-slate-700 tabular-nums">
                      {account.events.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono text-[12px] text-right text-slate-700 tabular-nums">
                      {account.repos}
                    </td>
                    <td className="py-3 px-4 font-mono text-[12px] text-right text-slate-700 tabular-nums">
                      {account.activeHours}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-block font-mono text-[11px] font-semibold px-2 py-0.5 rounded-[4px] border ${
                          account.isAnomaly
                            ? 'text-rose-700 bg-rose-50 border-rose-200'
                            : 'text-slate-700 bg-slate-100 border-slate-200'
                        }`}
                      >
                        {account.score.toFixed(3)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block font-mono text-[11px] font-medium px-2 py-0.5 bg-slate-100 text-slate-800 border border-slate-200 rounded-[4px]">
                        {account.cluster}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 group-hover:text-navy-950 transition-colors">
                        <span>Inspect</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Summary Footer */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 select-none">
          <div className="text-[12px] text-slate-500">
            Menampilkan{' '}
            <strong className="text-slate-900 font-semibold">
              {filteredAccounts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}–
              {Math.min(currentPage * itemsPerPage, filteredAccounts.length)}
            </strong>{' '}
            dari <strong className="text-slate-900 font-semibold">{filteredAccounts.length}</strong> data akun
          </div>

          <nav aria-label="Pagination" className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="w-7 h-7 flex items-center justify-center rounded-[4px] text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors disabled:opacity-30 disabled:pointer-events-none"
              type="button"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {paginationRange.map((page, idx) => {
              if (page === '...') {
                return (
                  <span key={`ellipsis-${idx}`} className="w-6 text-center text-slate-400 text-[11px]">
                    …
                  </span>
                );
              }
              const isCurrent = page === currentPage;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 flex items-center justify-center rounded-[4px] text-[12px] transition-colors ${
                    isCurrent
                      ? 'bg-navy-950 text-white font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  type="button"
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="w-7 h-7 flex items-center justify-center rounded-[4px] text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors disabled:opacity-30 disabled:pointer-events-none"
              type="button"
              aria-label="Next page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </nav>
        </div>
      </section>

      {/* Privacy Notice Bar */}
      <footer className="px-5 py-3 bg-white border border-slate-200/90 rounded-[4px] shadow-2xs text-slate-500 text-[11px] flex items-center justify-between">
        <span>
          Pemberitahuan Privasi: Identifikator akun telah di-hash secara satu arah dan disamarkan (potongan SHA-256) untuk menjaga integritas data.
        </span>
        <span className="font-mono text-slate-400">
          MongoDB Atlas · user_profiles
        </span>
      </footer>
    </div>
  );
}
