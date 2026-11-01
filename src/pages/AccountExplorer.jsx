import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronRight,
  ChevronLeft,
  ArrowRight
} from 'lucide-react';

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
    id: '12a9bc44ef338901',
    events: 98,
    repos: 14,
    activeHours: '21.0%',
    activeFraction: 0.21,
    score: 0.412,
    cluster: 'C3',
    clusterId: 3,
    block: 'block-b',
    isAnomaly: false,
  },
  {
    id: '67f082ed990145ef',
    events: 645,
    repos: 4,
    activeHours: '76.8%',
    activeFraction: 0.768,
    score: 0.518,
    cluster: 'C1',
    clusterId: 1,
    block: 'block-a',
    isAnomaly: false,
  },
  {
    id: '34bc90fa1288cd76',
    events: 42,
    repos: 2,
    activeHours: '14.5%',
    activeFraction: 0.145,
    score: 0.384,
    cluster: 'C1',
    clusterId: 1,
    block: 'block-a',
    isAnomaly: false,
  },
  {
    id: '55df81ac9833ee22',
    events: 78,
    repos: 6,
    activeHours: '32.1%',
    activeFraction: 0.321,
    score: 0.435,
    cluster: 'C5',
    clusterId: 5,
    block: 'block-b',
    isAnomaly: false,
  },
];

export default function AccountExplorer({ onOpenAnalyzeModal }) {
  const [search, setSearch] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('all');
  const [selectedCluster, setSelectedCluster] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter accounts
  const filteredAccounts = useMemo(() => {
    return ACCOUNTS_DATA.filter((acc) => {
      // Search by ID
      if (search && !acc.id.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      // Block
      if (selectedBlock !== 'all' && acc.block !== selectedBlock) {
        return false;
      }
      // Cluster
      if (selectedCluster !== 'all' && acc.cluster.toLowerCase() !== selectedCluster.toLowerCase()) {
        return false;
      }
      // Status
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

  return (
    <div className="w-full flex flex-col font-sans">
      {/* Editorial Header Bar - Full Bleed Edge-to-Edge */}
      <section className="px-6 py-5 border-b border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-navy-950 tracking-tight uppercase">
            Account Explorer
          </h1>
          <p className="text-[13px] text-slate-500 mt-0.5">
            Filter, inspect, and evaluate modeled accounts based on 11 behavioral features and anomaly scores across observation blocks.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenAnalyzeModal(null)}
            className="inline-flex items-center gap-1.5 bg-navy-950 hover:bg-navy-900 text-white px-3.5 py-1.5 rounded text-[12px] font-medium transition-colors border border-navy-800"
            type="button"
          >
            <span>Analyze Account</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
          </button>
        </div>
      </section>

      {/* Query & Filter Toolbar - Edge-to-Edge */}
      <section className="px-6 py-3 border-b border-slate-200 bg-slate-50/70 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
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
            className="w-full bg-white text-navy-950 font-mono text-[12px] pl-8 pr-3 py-1.5 rounded border border-slate-300 outline-none focus:border-navy-800 transition-colors"
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
            className="bg-white text-slate-700 font-mono text-[11px] py-1.5 px-3 rounded border border-slate-300 outline-none focus:border-navy-800 cursor-pointer"
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
            className="bg-white text-slate-700 font-mono text-[11px] py-1.5 px-3 rounded border border-slate-300 outline-none focus:border-navy-800 cursor-pointer"
          >
            <option value="all">CLUSTER: ALL</option>
            <option value="c0">CLUSTER: C0 (BURST PUSH)</option>
            <option value="c1">CLUSTER: C1 (MODERATE PUSH)</option>
            <option value="c2">CLUSTER: C2 (MULTI-REPO)</option>
            <option value="c3">CLUSTER: C3 (AUTOMATED CI)</option>
            <option value="c5">CLUSTER: C5 (PUSH & CREATE)</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-white text-slate-700 font-mono text-[11px] py-1.5 px-3 rounded border border-slate-300 outline-none focus:border-navy-800 cursor-pointer"
          >
            <option value="all">STATUS: ALL</option>
            <option value="anomaly">ANOMALY CANDIDATE (≥ 0.5514)</option>
            <option value="normal">NORMAL BEHAVIOR</option>
          </select>
        </div>
      </section>

      {/* Edge-to-Edge Data Table - Clean Hairline Grid */}
      <section className="w-full bg-white border-b border-slate-200 overflow-x-auto">
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
              <th className="py-2.5 px-6 font-semibold text-right w-16" scope="col">
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
                      className={`inline-block font-mono text-[11px] font-semibold px-2 py-0.5 rounded-xs border ${
                        account.isAnomaly
                          ? 'text-rose-700 bg-rose-50 border-rose-200'
                          : 'text-slate-700 bg-slate-100 border-slate-200'
                      }`}
                    >
                      {account.score.toFixed(3)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block font-mono text-[11px] font-medium px-2 py-0.5 bg-slate-100 text-navy-900 border border-slate-200 rounded-xs">
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
      </section>

      {/* Pagination & Summary Footer - Edge-to-Edge */}
      <section className="px-6 py-3 bg-white border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 select-none">
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
            className="w-7 h-7 flex items-center justify-center rounded text-slate-500 hover:bg-slate-100 hover:text-navy-950 transition-colors disabled:opacity-30 disabled:pointer-events-none"
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
                className={`w-7 h-7 flex items-center justify-center rounded font-mono text-[11px] transition-colors ${
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
            className="w-7 h-7 flex items-center justify-center rounded text-slate-500 hover:bg-slate-100 hover:text-navy-950 transition-colors disabled:opacity-30 disabled:pointer-events-none"
            type="button"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </nav>
      </section>

      {/* Privacy Note Footer */}
      <footer className="px-6 py-4 bg-slate-50 text-slate-500 font-mono text-[11px]">
        PRIVACY NOTICE: Account identifiers are irreversibly hashed and pseudonymized. Unobserved actors outside the 152-hour observation window are excluded from feature modeling.
      </footer>
    </div>
  );
}
