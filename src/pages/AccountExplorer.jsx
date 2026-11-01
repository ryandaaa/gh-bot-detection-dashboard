import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import Skeleton, { SkeletonCard } from '../components/Skeleton';

const ACCOUNTS_DATA = [
  {
    id: 'a91f7c2e9b8841fd',
    events: 1868,
    repos: 1,
    activeHours: '100%',
    activeFraction: 1.0,
    score: 0.820,
    cluster: 'C2',
    clusterId: 2,
    block: 'block-a',
    isAnomaly: true,
  },
  {
    id: 'f82b9d1a3c77102e',
    events: 566,
    repos: 1,
    activeHours: '98.7%',
    activeFraction: 0.987,
    score: 0.781,
    cluster: 'C1',
    clusterId: 1,
    block: 'block-a',
    isAnomaly: true,
  },
  {
    id: 'b31e4f9011deaa54',
    events: 151,
    repos: 19,
    activeHours: '56.3%',
    activeFraction: 0.563,
    score: 0.690,
    cluster: 'C3',
    clusterId: 3,
    block: 'block-b',
    isAnomaly: true,
  },
  {
    id: 'c7d2a6e144fe9821',
    events: 438,
    repos: 2,
    activeHours: '94.1%',
    activeFraction: 0.941,
    score: 0.677,
    cluster: 'C2',
    clusterId: 2,
    block: 'block-a',
    isAnomaly: true,
  },
  {
    id: 'e4a0b9c87890bc11',
    events: 1204,
    repos: 1,
    activeHours: '100%',
    activeFraction: 1.0,
    score: 0.671,
    cluster: 'C0',
    clusterId: 0,
    block: 'block-b',
    isAnomaly: true,
  },
  {
    id: '78ab31df5512ae30',
    events: 892,
    repos: 3,
    activeHours: '88.4%',
    activeFraction: 0.884,
    score: 0.612,
    cluster: 'C1',
    clusterId: 1,
    block: 'block-a',
    isAnomaly: true,
  },
  {
    id: '45e2c90a12bb56fa',
    events: 2410,
    repos: 1,
    activeHours: '99.2%',
    activeFraction: 0.992,
    score: 0.742,
    cluster: 'C2',
    clusterId: 2,
    block: 'block-b',
    isAnomaly: true,
  },
  {
    id: '9012f84b67ddcc89',
    events: 320,
    repos: 5,
    activeHours: '42.1%',
    activeFraction: 0.421,
    score: 0.548,
    cluster: 'C3',
    clusterId: 3,
    block: 'block-a',
    isAnomaly: false,
  },
  {
    id: '01bc89aef34255cd',
    events: 78,
    repos: 4,
    activeHours: '28.3%',
    activeFraction: 0.283,
    score: 0.492,
    cluster: 'C5',
    clusterId: 5,
    block: 'block-b',
    isAnomaly: false,
  },
  {
    id: '3349debc1088992a',
    events: 42,
    repos: 2,
    activeHours: '18.4%',
    activeFraction: 0.184,
    score: 0.412,
    cluster: 'C1',
    clusterId: 1,
    block: 'block-a',
    isAnomaly: false,
  },
  {
    id: '67a89ff0124433bb',
    events: 95,
    repos: 1,
    activeHours: '31.6%',
    activeFraction: 0.316,
    score: 0.380,
    cluster: 'C1',
    clusterId: 1,
    block: 'block-b',
    isAnomaly: false,
  },
  {
    id: '12fa4b90ce881240',
    events: 19,
    repos: 1,
    activeHours: '9.2%',
    activeFraction: 0.092,
    score: 0.365,
    cluster: 'C1',
    clusterId: 1,
    block: 'block-a',
    isAnomaly: false,
  },
  {
    id: 'aa90812cf5540981',
    events: 14,
    repos: 2,
    activeHours: '7.9%',
    activeFraction: 0.079,
    score: 0.334,
    cluster: 'C1',
    clusterId: 1,
    block: 'block-a',
    isAnomaly: false,
  },
  {
    id: '5561de09bc872211',
    events: 230,
    repos: 8,
    activeHours: '45.4%',
    activeFraction: 0.454,
    score: 0.589,
    cluster: 'C2',
    clusterId: 2,
    block: 'block-b',
    isAnomaly: true,
  },
  {
    id: '8876cba90123ef11',
    events: 89,
    repos: 3,
    activeHours: '22.4%',
    activeFraction: 0.224,
    score: 0.441,
    cluster: 'C5',
    clusterId: 5,
    block: 'block-a',
    isAnomaly: false,
  },
];

export default function AccountExplorer({ onOpenAnalyzeModal }) {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('all');
  const [selectedCluster, setSelectedCluster] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 320);
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

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
        {/* Header Skeleton */}
        <div className="bg-white border border-slate-200/90 rounded-[4px] p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </div>
          <Skeleton className="h-7 w-36" />
        </div>

        {/* Toolbar Skeleton */}
        <div className="bg-white border border-slate-200/90 rounded-[4px] p-4 flex flex-col lg:flex-row gap-3">
          <Skeleton className="h-9 flex-1" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-36" />
          </div>
        </div>

        {/* Table Shimmer Skeleton */}
        <div className="bg-white border border-slate-200/90 rounded-[4px] overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="divide-y divide-slate-100 p-2 space-y-3">
            {[...Array(7)].map((_, i) => (
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
      {/* Editorial Header Card - Modular, No duplicate button */}
      <section className="bg-white border border-slate-200/90 rounded-[4px] p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-navy-950 tracking-tight uppercase">
            Account Explorer
          </h1>
          <p className="text-[13px] text-slate-500 mt-0.5">
            Filter, inspect, and evaluate modeled accounts based on 11 behavioral features and anomaly scores across observation blocks.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-[11px] font-semibold text-navy-800 bg-navy-50 border border-navy-200/70 px-2.5 py-1 rounded-[4px] uppercase tracking-wider">
            {filteredAccounts.length} ACCOUNTS MATCHED
          </span>
        </div>
      </section>

      {/* Query & Filter Toolbar - Modular Card */}
      <section className="bg-white border border-slate-200/90 rounded-[4px] p-4 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search pseudonymized ID (e.g. a91f, c7d2)..."
            className="w-full bg-slate-50/50 text-navy-950 font-mono text-[12px] pl-8 pr-3 py-1.5 rounded-[4px] border border-slate-300 outline-none focus:border-navy-800 focus:bg-white transition-colors"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Block Selector */}
          <select
            value={selectedBlock}
            onChange={(e) => {
              setSelectedBlock(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-white text-slate-700 font-mono text-[11px] py-1.5 px-3 rounded-[4px] border border-slate-300 outline-none focus:border-navy-800 cursor-pointer"
          >
            <option value="all">BLOCK: ALL</option>
            <option value="block-a">BLOCK: BLOCK A</option>
            <option value="block-b">BLOCK: BLOCK B</option>
          </select>

          {/* Cluster Selector */}
          <select
            value={selectedCluster}
            onChange={(e) => {
              setSelectedCluster(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-white text-slate-700 font-mono text-[11px] py-1.5 px-3 rounded-[4px] border border-slate-300 outline-none focus:border-navy-800 cursor-pointer"
          >
            <option value="all">CLUSTER: ALL</option>
            <option value="C0">C0: BURST PUSHERS</option>
            <option value="C1">C1: HEAVY PUSHERS</option>
            <option value="C2">C2: MULTI-REPO PUSH</option>
            <option value="C3">C3: AUTOMATED CI</option>
            <option value="C4">C4: TOOLING BOTS</option>
            <option value="C5">C5: PUSH & CREATE</option>
            <option value="C6">C6: 24/7 CONTINUOUS</option>
          </select>

          {/* Status Selector */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-white text-slate-700 font-mono text-[11px] py-1.5 px-3 rounded-[4px] border border-slate-300 outline-none focus:border-navy-800 cursor-pointer"
          >
            <option value="all">STATUS: ALL</option>
            <option value="anomaly">ANOMALY CANDIDATE (≥ 0.5514)</option>
            <option value="normal">NORMAL BEHAVIOR</option>
          </select>
        </div>
      </section>

      {/* Modular Data Table Card */}
      <section className="bg-white border border-slate-200/90 rounded-[4px] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px] uppercase tracking-wider select-none">
                <th className="py-2.5 px-6 font-semibold" scope="col">
                  Account ID
                </th>
                <th className="py-2.5 px-4 font-semibold text-right" scope="col">
                  Events
                </th>
                <th className="py-2.5 px-4 font-semibold text-right" scope="col">
                  Repos
                </th>
                <th className="py-2.5 px-4 font-semibold text-right" scope="col">
                  Active Window
                </th>
                <th className="py-2.5 px-4 font-semibold text-right" scope="col">
                  Anomaly Score
                </th>
                <th className="py-2.5 px-4 font-semibold text-center" scope="col">
                  Cluster
                </th>
                <th className="py-2.5 px-6 font-semibold text-right w-20" scope="col">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-900 font-sans text-[13px]">
              {paginatedAccounts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-mono text-[12px]">
                    No matching accounts found for the current query parameters.
                  </td>
                </tr>
              ) : (
                paginatedAccounts.map((account) => (
                  <tr
                    key={account.id}
                    onClick={() => onOpenAnalyzeModal(account)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-6 font-mono text-[12px] text-navy-950 font-medium">
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
                      <span className="inline-block font-mono text-[11px] font-medium px-2 py-0.5 bg-slate-100 text-navy-900 border border-slate-200 rounded-[4px]">
                        {account.cluster}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-400 group-hover:text-navy-950 transition-colors">
                        <span>INSPECT</span>
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
          <div className="font-mono text-[11px] text-slate-500">
            Showing{' '}
            <span className="font-semibold text-navy-950">
              {filteredAccounts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}–
              {Math.min(currentPage * itemsPerPage, filteredAccounts.length)}
            </span>{' '}
            of <span className="font-semibold text-navy-950">{filteredAccounts.length}</span> records
          </div>

          <nav aria-label="Pagination" className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="w-7 h-7 flex items-center justify-center rounded-[4px] text-slate-500 hover:bg-slate-100 hover:text-navy-950 transition-colors disabled:opacity-30 disabled:pointer-events-none"
              type="button"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const page = idx + 1;
              const isCurrent = page === currentPage;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 flex items-center justify-center rounded-[4px] font-mono text-[11px] transition-colors ${
                    isCurrent
                      ? 'bg-navy-950 text-white font-bold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-navy-950'
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
              className="w-7 h-7 flex items-center justify-center rounded-[4px] text-slate-500 hover:bg-slate-100 hover:text-navy-950 transition-colors disabled:opacity-30 disabled:pointer-events-none"
              type="button"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </nav>
        </div>
      </section>

      {/* Privacy Note Card */}
      <footer className="p-4 bg-white border border-slate-200/90 rounded-[4px] shadow-2xs text-slate-500 font-mono text-[11px]">
        PRIVACY NOTICE: Account identifiers are irreversibly hashed and pseudonymized. Unobserved actors outside the 152-hour observation window are excluded from feature modeling.
      </footer>
    </div>
  );
}
